"use client"

import { useState, useCallback, useEffect } from "react"
import { Sidebar } from "@/components/aastha/sidebar/Sidebar"
import { ChatContainer } from "@/components/aastha/chat/ChatContainer"
import type { AasthaSession } from "@/hooks/useAastha"

export default function AasthaPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Close sidebar by default on mobile
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    if (mql.matches) setSidebarOpen(false)

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  const handleSessionCreated = (session: AasthaSession) => {
    setActiveSessionId(session.id)
  }

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id || null)
    // Auto-close sidebar on mobile after selecting
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  return (
    <div className="relative flex h-dvh overflow-hidden bg-background">
      {/* ── Mobile overlay ─────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-[280px] transform transition-transform duration-300 ease-in-out
          md:relative md:z-auto md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-full md:hidden"}
        `}
      >
        <Sidebar
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onSessionCreated={handleSessionCreated}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* ── Chat pane ──────────────────────────────── */}
      <main className="min-w-0 flex-1">
        <ChatContainer
          activeSessionId={activeSessionId}
          onSessionCreated={handleSessionCreated}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
      </main>
    </div>
  )
}
