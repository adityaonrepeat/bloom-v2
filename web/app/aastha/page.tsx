"use client"

import { useState } from "react"
import { Sidebar } from "@/components/aastha/sidebar/Sidebar"
import { ChatContainer } from "@/components/aastha/chat/ChatContainer"
import type { AasthaSession } from "@/hooks/useAastha"

export default function AasthaPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const handleSessionCreated = (session: AasthaSession) => {
    setActiveSessionId(session.id)
  }

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id || null)
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* ── Sidebar ────────────────────────────────── */}
      <aside className="w-[260px] flex-shrink-0">
        <Sidebar
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onSessionCreated={handleSessionCreated}
        />
      </aside>

      {/* ── Chat pane ──────────────────────────────── */}
      <main className="min-w-0 flex-1">
        <ChatContainer
          activeSessionId={activeSessionId}
          onSessionCreated={handleSessionCreated}
        />
      </main>
    </div>
  )
}
