"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
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

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      if (joiningRef.current) return
      if (!containerRef.current) return

      joiningRef.current = true

      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt")
      if (cancelled || !containerRef.current) return

      const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || ""

      const zegoUserID = userId || crypto.randomUUID()

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        zegoUserID,
        userName || "stranger"
      )

      const zp = ZegoUIKitPrebuilt.create(kitToken)
      if (cancelled) {
        try { zp.destroy() } catch {}
        return
      }

      zpRef.current = zp

      let readyCalled = false

      zp.joinRoom({
        container: containerRef.current,
        scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
        showPreJoinView: false,
        showTextChat: true,
        maxUsers: 2,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showLeaveRoomConfirmDialog: false,
        onJoinRoom: () => {
          if (!readyCalled) {
            readyCalled = true
            onReady()
          }
        },
        onLeaveRoom: () => {
          joiningRef.current = false
          onLeave()
        },
      })

      // Fallback in case onJoinRoom never fires
      setTimeout(() => {
        if (!readyCalled) {
          readyCalled = true
          onReady()
        }
      }, 5000)
    }

    start()

    return () => {
      cancelled = true
      const zp = zpRef.current
      zpRef.current = null // null ref first so stale callbacks can't re-use it
      if (zp) {
        // defer destroy so any in-flight SDK async calls finish before teardown
        setTimeout(() => {
          try { zp.destroy() } catch {}
        }, 0)
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


type PageState = "searching" | "connected"

export default function TalkPage() {
  const router = useRouter()

  const [pageState, setPageState] = useState<PageState>("searching")
  const [roomId, setRoomId] = useState<string | null>(null)
  const [hasReported, setHasReported] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [skipCooldown, setSkipCooldown] = useState(0)
  const [userName, setUserName] = useState("")
  const [zegoReady, setZegoReady] = useState(false)

  const hasJoined = useRef(false)
  const sessionRef = useRef<{ id: string } | null>(null)

  // ─── Skip cooldown timer ───
  useEffect(() => {
    if (skipCooldown <= 0) return
    const timer = setInterval(() => {
      setSkipCooldown(prev => prev <= 1 ? 0 : prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [skipCooldown])

  // ─── Initialize session + socket + join queue ───
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

      if (!socket.connected) {
        socket.connect()
      }

      // Join the queue immediately
      const emotion = localStorage.getItem("emotion-tag") || "calm"
      if (!hasJoined.current) {
        hasJoined.current = true
        socket.emit("join-queue", { emotion, userId: session.user.id }) // Added userId here for proper DB reporting!
      }
    }

    init()

    // ─── Socket event handlers ───

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
      // Server requeued us in Redis; re-emit join-queue so this socket actively
      // participates in the match flow (avoids the "stuck searching" state)
      const emotion = localStorage.getItem("emotion-tag") || "calm"
      socket.emit("join-queue", { emotion, userId: sessionRef.current?.id })
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
      hasJoined.current = false
    }
  }, [router])

  // ─── Actions ───

  const handleSkip = () => {
    setZegoReady(false)
    setPageState("searching")
    setRoomId(null)
    const emotion = localStorage.getItem("emotion-tag") || "calm"
    socket.emit("skip", { emotion, userId: sessionRef.current?.id }) // Added userId here for proper DB reporting!
  }

  const handleReport = async () => {
    if (hasReported || !userId || !partnerId) return
    try {
      await fetch("/api/user/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterId: userId,
          reportedId: partnerId // Realtime server now guarantees this is a proper DB user ID!
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

  // ─────────── SEARCHING STATE ───────────
  if (pageState === "searching") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
        <div className="text-center space-y-6">
          {/* Spinner */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">💚</span>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-stone-800">
              Finding someone who understands...
            </h1>
            <p className="text-sm text-stone-400 max-w-xs mx-auto">
              Matching you with someone experiencing similar emotions
            </p>
          </div>
          <button
            onClick={handleLeave}
            className="text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // ─────────── CONNECTED STATE ───────────
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-stone-50 via-white to-emerald-50/30">
      {/* Header — compact, only report + leave */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-200/60 px-5 py-2.5 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 10l-4 4l6 6l4-16l-18 7l4 2l2 6l3-4"/>
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-stone-800 text-sm leading-tight">Bloom Talk</h1>
            <p className="text-[10px] text-stone-400">Connected</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReportModal(true)}
            disabled={hasReported}
            className="px-3 py-1.5 text-[11px] font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {hasReported ? "Reported" : "Report"}
          </button>
          <button
            onClick={handleLeave}
            className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Video container — takes remaining space */}
      <div className="flex-1 relative min-h-0">
        {!zegoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-50/80 z-10">
            <div className="text-center space-y-3">
              <div className="relative mx-auto w-12 h-12">
                <div className="absolute inset-0 rounded-full border-3 border-emerald-200"></div>
                <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-emerald-500 animate-spin"></div>
              </div>
              <p className="text-stone-400 text-sm">Connecting video...</p>
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

      {/* Bottom bar — Skip button */}
      <div className="shrink-0 bg-white/80 backdrop-blur-md border-t border-stone-200/60 px-5 py-3 flex items-center justify-center z-10">
        <button
          onClick={handleSkip}
          disabled={skipCooldown > 0}
          className="px-8 py-2.5 text-sm font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {skipCooldown > 0 ? `Skip (${skipCooldown}s)` : "Skip"}
        </button>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-stone-800">Report this user?</h2>
            <p className="text-sm text-stone-500">
              If this person is being inappropriate, you can report them.
              Repeated reports may lead to their account being restricted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
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
