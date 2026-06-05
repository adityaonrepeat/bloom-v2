"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Sidebar } from "@/components/aastha/sidebar/Sidebar"
import { ChatContainer } from "@/components/aastha/chat/ChatContainer"
import TopNav from "@/app/components/bloom/TopNav"
import { type AasthaSession } from "@/hooks/useAastha"
import { Card, DarkCard } from "@/app/components/bloom/Workspace"

export default function AasthaPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)

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
      className="h-dvh overflow-hidden bg-bloom-cream text-bloom-ink"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <TopNav />

      {/* Full-height workspace: fills the viewport below the nav, never scrolls the page */}
      <main className="h-full pt-16">
        <div className="mx-auto flex h-full max-w-310 gap-4 overflow-hidden px-4 py-4 md:gap-5 md:px-6">
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
              fixed top-16 bottom-0 left-0 z-40 p-4
              w-[80vw] max-w-72
              transition-transform duration-300 ease-in-out
              lg:static lg:top-auto lg:bottom-auto lg:z-auto lg:p-0
              lg:w-72 lg:shrink-0 lg:translate-x-0
              ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <Card className="h-full overflow-hidden" testId="sessions-list">
              <Sidebar
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
                onSessionCreated={handleSessionCreated}
                onClose={() => setMobileSidebarOpen(false)}
              />
            </Card>
          </aside>

          {/* Chat panel — fills remaining height; only the message list scrolls */}
          <DarkCard
            className="flex min-w-0 flex-1 flex-col overflow-hidden"
            testId="aastha-chat"
          >
            <ChatContainer
              activeSessionId={activeSessionId}
              onSessionCreated={handleSessionCreated}
              onToggleSidebar={() => setMobileSidebarOpen((v) => !v)}
              sidebarOpen={sidebarOpenForChat}
            />
          </DarkCard>
        </div>
      </main>
    </div>
  )
}
