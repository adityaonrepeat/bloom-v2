"use client"

import { useState } from "react"
import { useMessages, useCreateSession, type AasthaSession } from "@/hooks/useAastha"
import { useStreamingChat } from "@/hooks/useStreamingChat"
import { ChatHeader, EmptyState } from "./ChatHeader"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"

interface ChatContainerProps {
  activeSessionId: string | null
  onSessionCreated: (session: AasthaSession) => void
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

function ActiveChat({
  sessionId,
  onToggleSidebar,
  sidebarOpen,
}: {
  sessionId: string
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}) {
  const [input, setInput] = useState("")
  const { data, isLoading, isError } = useMessages(sessionId)
  const { sendMessage, isStreaming, streamingContent } = useStreamingChat({ sessionId })

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
  }

  if (isLoading) {
    return (
      <div
        className="flex flex-1 items-center justify-center"
        style={{ background: "#1C2A25" }}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full"
              style={{ background: "rgba(249,246,240,0.3)", animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div
        className="flex flex-1 items-center justify-center px-6"
        style={{ background: "#1C2A25" }}
      >
        <p className="text-sm" style={{ color: "rgba(249,246,240,0.45)" }}>
          Couldn&apos;t load this session. Try refreshing.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        session={data?.sessionMeta ?? null}
        onToggleSidebar={onToggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <MessageList
          messages={data?.messages ?? []}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
        />

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isStreaming}
        />
      </div>
    </div>
  )
}

export function ChatContainer({ activeSessionId, onSessionCreated, onToggleSidebar, sidebarOpen }: ChatContainerProps) {
  const { mutate: createSession, isPending } = useCreateSession()

  const handleNewSession = () => {
    createSession(undefined, {
      onSuccess: (session) => onSessionCreated(session),
    })
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: "#1C2A25" }}
    >
      {!activeSessionId ? (
        <EmptyState
          onNewSession={handleNewSession}
          isCreating={isPending}
          onToggleSidebar={onToggleSidebar}
          sidebarOpen={sidebarOpen}
        />
      ) : (
        <ActiveChat
          sessionId={activeSessionId}
          onToggleSidebar={onToggleSidebar}
          sidebarOpen={sidebarOpen}
        />
      )}
    </div>
  )
}
