"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Sidebar } from "@/components/aastha/sidebar/Sidebar"
import { ChatContainer } from "@/components/aastha/chat/ChatContainer"
import TopNav from "@/app/components/bloom/TopNav"
import { useCreateSession, type AasthaSession } from "@/hooks/useAastha"
import { WorkspaceShell, WorkspaceHeader, Card, DarkCard } from "@/app/components/bloom/Workspace"

export default function AasthaPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)

  const { mutate: createSession, isPending: isCreating } = useCreateSession()

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)")
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  const handleSessionCreated = (session: AasthaSession) => {
    setActiveSessionId(session.id)
    if (isMobile) setMobileSidebarOpen(false)
  }

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id || null)
    setMobileSidebarOpen(false)
  }

  const handleNewSession = useCallback(() => {
    createSession(undefined, {
      onSuccess: (session) => handleSessionCreated(session),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSession, isMobile])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile) return
      const dx = e.changedTouches[0].clientX - touchStartXRef.current
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartYRef.current)
      if (dy > 60) return
      if (dx > 60 && touchStartXRef.current < 60 && !mobileSidebarOpen) setMobileSidebarOpen(true)
      if (dx < -60 && mobileSidebarOpen) setMobileSidebarOpen(false)
    },
    [isMobile, mobileSidebarOpen]
  )

  const sidebarOpenForChat = isMobile ? mobileSidebarOpen : true

  return (
    <div
      className="min-h-screen bg-bloom-cream text-bloom-ink"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <TopNav />
      <main className="pt-16">
        <div className="animate-fade-up">
          <WorkspaceShell>
            <WorkspaceHeader
              eyebrow="Aastha · AI Therapist"
              title="Not advice."
              titleAccent="Attention."
              sub="Trained on decades of clinical conversation. She won't rush you to solutions."
              right={
                <button
                  onClick={handleNewSession}
                  disabled={isCreating}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 shrink-0"
                  style={{
                    background: "#28312C",
                    color: "#f7f4ef",
                    boxShadow: "0 4px 16px rgba(40,49,44,0.15)",
                  }}
                >
                  {isCreating ? "Starting…" : "+ New session"}
                </button>
              }
            />

            {/* Two-panel layout */}
            <div className="grid grid-cols-12 gap-5">
              {/* Mobile overlay */}
              {mobileSidebarOpen && (
                <div
                  className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                  style={{ top: "64px" }}
                  onClick={() => setMobileSidebarOpen(false)}
                />
              )}

              {/* Sidebar — slide-in overlay on mobile, inline column on desktop */}
              <aside
                className={`
                  col-span-12 lg:col-span-3
                  fixed top-16 bottom-0 left-0 z-40
                  w-[80vw] max-w-70
                  transition-transform duration-300 ease-in-out
                  lg:static lg:top-auto lg:bottom-auto lg:z-auto
                  lg:w-auto lg:translate-x-0
                  ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
              >
                <Card
                  className="h-full lg:h-[680px] overflow-hidden"
                  testId="sessions-list"
                >
                  <Sidebar
                    activeSessionId={activeSessionId}
                    onSelectSession={handleSelectSession}
                    onSessionCreated={handleSessionCreated}
                    onClose={() => setMobileSidebarOpen(false)}
                  />
                </Card>
              </aside>

              {/* Chat panel */}
              <main className="col-span-12 lg:col-span-9 flex flex-col">
                <DarkCard
                  className="h-[530px] lg:h-[680px] overflow-hidden flex flex-col"
                  testId="aastha-chat"
                >
                  <ChatContainer
                    activeSessionId={activeSessionId}
                    onSessionCreated={handleSessionCreated}
                    onToggleSidebar={() => setMobileSidebarOpen((v) => !v)}
                    sidebarOpen={sidebarOpenForChat}
                  />
                </DarkCard>
              </main>
            </div>
          </WorkspaceShell>
        </div>
      </main>
    </div>
  )
}
