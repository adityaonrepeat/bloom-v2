"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Video, Shield } from "lucide-react"
import { socket } from "@/lib/socket"
import { authClient } from "@/lib/auth-client"

function ZegoVideoRoom({
  roomId,
  userName,
  userId,
  onLeave,
  onReady,
}: {
  roomId: string
  userName: string
  userId: string | null
  onLeave: () => void
  onReady: () => void
}) {
  const zpRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const joiningRef = useRef(false)
  const isActiveRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = true
    let cancelled = false

    const start = async () => {
      if (joiningRef.current) return
      if (!containerRef.current) return

      const container = containerRef.current
      if (!container) return

      joiningRef.current = true

      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt")
      if (cancelled) return

      const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)

      // Token is signed on the server — the ServerSecret never reaches the
      // browser. The route also tells us which user id the token is bound to.
      const tokenRes = await fetch("/api/talk/token", { method: "POST" })
      if (cancelled) return
      if (!tokenRes.ok) {
        console.error("Failed to obtain Zego token")
        joiningRef.current = false
        return
      }
      const { token, userId: zegoUserID } = await tokenRes.json()

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        token,
        roomId,
        zegoUserID,
        userName || "stranger"
      )

      const zp = ZegoUIKitPrebuilt.create(kitToken)
      if (cancelled) {
        try { zp.destroy() } catch { }
        return
      }

      zpRef.current = zp

      let readyCalled = false

      zp.joinRoom({
        container,
        scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
        showPreJoinView: false,
        showTextChat: true,
        maxUsers: 2,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showLeaveRoomConfirmDialog: false,
        onJoinRoom: () => {
          if (!isActiveRef.current) return
          if (!readyCalled) {
            readyCalled = true
            onReady()
          }
        },
        onLeaveRoom: () => {
          if (!isActiveRef.current) return
          joiningRef.current = false
          onLeave()
        },
      })

      // Fallback in case onJoinRoom never fires
      setTimeout(() => {
        if (!isActiveRef.current) return
        if (!readyCalled) {
          readyCalled = true
          onReady()
        }
      }, 5000)
    }

    // Wait 200ms before starting — this ensures any in-progress destroy() from
    // the previous mount (which has a 150ms delay) has fully settled before we
    // call joinRoom. Without this, old and new Zego instances overlap → createSpan crash.
    const startTimer = setTimeout(start, 200)

    return () => {
      cancelled = true
      isActiveRef.current = false
      joiningRef.current = false  // reset so remount can join without being blocked
      clearTimeout(startTimer)
      const zp = zpRef.current
      zpRef.current = null // null ref first so stale callbacks can't re-use it
      if (zp) {
        // 150ms lets Zego finish any in-flight async work before we tear down
        setTimeout(() => {
          try { zp.destroy() } catch {}
        }, 150)
      }
    }
  }, [roomId, userId, userName])

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
    />
  )
}


const VALID_EMOTIONS = ["happy", "calm", "stressed", "anxious"] as const
type EmotionTag = (typeof VALID_EMOTIONS)[number]

const EMOTIONS: { tag: EmotionTag; label: string; blurb: string }[] = [
  { tag: "happy", label: "Sunny & open", blurb: "Feeling good" },
  { tag: "calm", label: "Steady & grounded", blurb: "At ease" },
  { tag: "stressed", label: "Under pressure", blurb: "Stretched thin" },
  { tag: "anxious", label: "On edge", blurb: "Restless" },
]

type PageState = "lobby" | "searching" | "connected"

export default function TalkPage() {
  const router = useRouter()

  const [pageState, setPageState] = useState<PageState>("lobby")
  const [roomId, setRoomId] = useState<string | null>(null)
  const [hasReported, setHasReported] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [skipCooldown, setSkipCooldown] = useState(0)
  const [userName, setUserName] = useState("")
  const [zegoReady, setZegoReady] = useState(false)
  const [emotion, setEmotion] = useState<EmotionTag | null>(null)

  const sessionRef = useRef<{ id: string } | null>(null)

  useEffect(() => {
    if (skipCooldown <= 0) return
    const timer = setInterval(() => {
      setSkipCooldown(prev => prev <= 1 ? 0 : prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [skipCooldown])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const res = await authClient.getSession()
      const session = "data" in res ? res.data : null

      if (!session?.user?.id) {
        router.push("/login")
        return
      }

      setUserId(session.user.id)
      setUserName(session.user.name || "Anonymous")
      sessionRef.current = { id: session.user.id }

      // Emotion comes from the DB (authoritative), not localStorage. The user
      // confirms or changes it in the lobby before matchmaking starts.
      try {
        const eRes = await fetch("/api/user/emotion")
        if (eRes.ok) {
          const { emotionalTag } = await eRes.json()
          if (emotionalTag && (VALID_EMOTIONS as readonly string[]).includes(emotionalTag)) {
            setEmotion(emotionalTag as EmotionTag)
          }
        }
      } catch {
        // ignore — lobby lets the user pick emotion manually
      }

      if (!socket.connected) {
        socket.connect()
      }
    }

    init()

    const handleMatchFound = ({ roomId: newRoom, partnerId: pid }: { roomId: string; partnerId: string }) => {
      if (!mounted) return
      setRoomId(newRoom)
      setPartnerId(pid)
      setZegoReady(false)
      setPageState("connected")
      setHasReported(false)
    }

    const handleWaiting = () => {
      if (!mounted) return
      setZegoReady(false)
      setPageState("searching")
      setRoomId(null)
    }

    const handlePartnerLeft = () => {
      if (!mounted) return
      setZegoReady(false)
      setPageState("searching")
      setRoomId(null)
    }

    const handleSkipCooldown = ({ seconds }: { seconds: number }) => {
      setSkipCooldown(seconds)
    }

    socket.on("match-found", handleMatchFound)
    socket.on("waiting", handleWaiting)
    socket.on("partner-left", handlePartnerLeft)
    socket.on("skip-cooldown", handleSkipCooldown)

    return () => {
      mounted = false
      socket.off("match-found", handleMatchFound)
      socket.off("waiting", handleWaiting)
      socket.off("partner-left", handlePartnerLeft)
      socket.off("skip-cooldown", handleSkipCooldown)
    }
  }, [router])

  const startMatching = () => {
    if (!emotion || !sessionRef.current) return
    if (!socket.connected) socket.connect()
    setPageState("searching")
    socket.emit("join-queue", { emotion, userId: sessionRef.current.id })
  }

  const cancelSearch = () => {
    socket.disconnect()
    setPageState("lobby")
  }

  const handleSkip = () => {
    // Skip must ALWAYS reach the server so the room tears down and both requeue.
    // Never gate it on emotion state (which can momentarily be null after a
    // hot-reload) — fall back so the emit always fires.
    setZegoReady(false)
    setPageState("searching")
    setRoomId(null)
    socket.emit("skip", { emotion: emotion ?? "calm", userId: sessionRef.current?.id })
  }

  const handleReport = async () => {
    if (hasReported || !userId || !partnerId) return
    try {
      await fetch("/api/user/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedId: partnerId
        })
      })
      setHasReported(true)
      setShowReportModal(false)
    } catch {
      console.error("Failed to report")
      setShowReportModal(false)
    }
  }

  const handleLeave = useCallback(() => {
    setZegoReady(false)
    setPageState("searching")
    setRoomId(null)
    socket.disconnect()
    router.push("/dashboard")
  }, [router])

  if (pageState === "lobby") {
    return (
      <div className="min-h-screen bg-bloom-cream text-bloom-ink font-sans flex flex-col">
        <header className="px-6 md:px-10 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-bloom-inkSoft hover:text-bloom-ink transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            Dashboard
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 pb-16">
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <p className="eyebrow text-bloom-inkSoft mb-3">Bloom Talk</p>
              <h1 className="font-display text-3xl md:text-4xl leading-tight tracking-tight">
                Talk to someone who{" "}
                <span className="italic font-light text-bloom-terracotta">gets it.</span>
              </h1>
              <p className="mt-3 text-sm text-bloom-inkSoft max-w-sm mx-auto">
                A 1-on-1 video chat with someone feeling something similar. Anonymous. Skip or leave anytime.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-bloom-line/70 shadow-[0_18px_50px_-30px_rgba(42,47,45,0.2)] overflow-hidden">
              <div className="h-1 bg-bloom-terracotta" />
              <div className="p-7">
                <p className="eyebrow text-bloom-inkSoft mb-4">How are you feeling right now?</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {EMOTIONS.map((e) => (
                    <button
                      key={e.tag}
                      onClick={() => setEmotion(e.tag)}
                      className={`text-left rounded-2xl border px-4 py-3.5 transition-all ${
                        emotion === e.tag
                          ? "bg-bloom-terracotta/10 border-bloom-terracotta"
                          : "bg-bloom-cream border-bloom-line hover:border-bloom-terracotta/50"
                      }`}
                    >
                      <p className="text-sm font-medium text-bloom-ink">{e.label}</p>
                      <p className="text-xs text-bloom-inkSoft mt-0.5">{e.blurb}</p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={startMatching}
                  disabled={!emotion}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium bg-bloom-forest text-bloom-cream hover:bg-bloom-forestSoft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Video size={16} strokeWidth={1.75} />
                  {emotion ? "Find someone" : "Pick how you feel first"}
                </button>
              </div>
            </div>

            <p className="mt-5 inline-flex items-center justify-center gap-2 text-xs text-bloom-inkSoft/70 w-full">
              <Shield size={12} strokeWidth={1.5} className="text-bloom-terracotta" />
              Be kind. You can report anyone who makes you uncomfortable.
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (pageState === "searching") {
    return (
      <div
        className="h-screen flex flex-col items-center justify-center"
        style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
      >
        <div className="text-center space-y-6">
          <div className="relative mx-auto flex items-center justify-center w-24 h-24">
            <div
              className="absolute rounded-full animate-ping border-2"
              style={{ width: "112px", height: "112px", borderColor: "rgba(198,113,86,0.25)" }}
            />
            <div
              className="absolute inset-0 rounded-full border-4"
              style={{ borderColor: "rgba(198,113,86,0.25)" }}
            />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
              style={{ borderTopColor: "#C67156" }}
            />
            <span className="text-3xl">🧡</span>
          </div>
          <div className="space-y-2">
            <h1
              className="text-xl font-semibold"
              style={{ color: "#28312C" }}
            >
              Finding someone who understands...
            </h1>
            <p className="text-sm max-w-xs mx-auto" style={{ color: "#A6B3A8" }}>
              Matching you with someone experiencing similar emotions
            </p>
          </div>
          <button
            onClick={cancelSearch}
            className="text-sm underline underline-offset-2 transition-colors hover:opacity-60"
            style={{ color: "#A6B3A8" }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-screen flex flex-col"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      <div
        className="px-5 py-3 flex items-center justify-between z-10 shrink-0"
        style={{
          background: "rgba(247,244,239,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(40,49,44,0.08)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: "#E3A863",
              color: "#28312C",
              fontFamily: "var(--font-fraunces), Georgia, serif",
            }}
          >
            B
          </div>
          <div>
            <p
              className="text-sm font-semibold leading-tight"
              style={{ color: "#28312C" }}
            >
              Bloom Talk
            </p>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#7C9885" }}
              />
              <p className="text-[10px]" style={{ color: "#5D6862" }}>Connected</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReportModal(true)}
            disabled={hasReported}
            className="px-3 py-1.5 text-[11px] font-medium rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              border: "1px solid rgba(198,113,86,0.3)",
              color: "#C67156",
              background: "rgba(198,113,86,0.06)",
            }}
          >
            {hasReported ? "Reported" : "Report"}
          </button>
          <button
            onClick={handleLeave}
            className="px-3 py-1.5 text-[11px] font-medium rounded-full transition-all hover:opacity-75"
            style={{
              border: "1px solid rgba(40,49,44,0.12)",
              color: "#28312C",
              background: "rgba(40,49,44,0.05)",
            }}
          >
            Leave
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        {!zegoReady && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: "rgba(247,244,239,0.85)" }}
          >
            <div className="text-center space-y-3">
              <div className="relative mx-auto w-12 h-12">
                <div
                  className="absolute inset-0 rounded-full border-4"
                  style={{ borderColor: "rgba(40,49,44,0.08)" }}
                />
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                  style={{ borderTopColor: "#C67156" }}
                />
              </div>
              <p className="text-sm" style={{ color: "#5D6862" }}>Connecting video…</p>
            </div>
          </div>
        )}

        {roomId && (
          <ZegoVideoRoom
            key={roomId}
            roomId={roomId}
            userId={userId}
            userName={userName}
            onReady={() => setZegoReady(true)}
            onLeave={handleLeave}
          />
        )}
      </div>

      {/* Bottom bar — Skip */}
      <div
        className="shrink-0 px-5 py-3 flex items-center justify-center z-10"
        style={{
          background: "rgba(247,244,239,0.92)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(40,49,44,0.08)",
        }}
      >
        <button
          onClick={handleSkip}
          disabled={skipCooldown > 0}
          className="px-8 py-2.5 text-sm font-medium rounded-full transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#28312C", color: "#f7f4ef" }}
        >
          {skipCooldown > 0 ? `Skip (${skipCooldown}s)` : "Skip"}
        </button>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(40,49,44,0.5)", backdropFilter: "blur(4px)" }}>
          <div
            className="rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4"
            style={{
              background: "rgba(255,255,255,0.98)",
              border: "1px solid rgba(40,49,44,0.08)",
              boxShadow: "0 24px 64px rgba(40,49,44,0.2)",
            }}
          >
            <h2
              className="text-lg"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                color: "#28312C",
                letterSpacing: "-0.01em",
              }}
            >
              Report this user?
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5D6862" }}>
              If this person is being inappropriate, you can report them.
              Repeated reports may lead to their account being restricted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-75"
                style={{ border: "1px solid rgba(40,49,44,0.15)", color: "#28312C" }}
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "#C67156", color: "#fff" }}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
