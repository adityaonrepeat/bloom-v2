"use client"

import { useState } from "react"
import { useMessages, useCreateSession, type AasthaSession } from "@/hooks/useAastha"
import { useStreamingChat } from "@/hooks/useStreamingChat"
import { ChatHeader, EmptyState } from "./ChatHeader"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"
import { X } from "lucide-react"

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
  const { sendMessage, isStreaming, streamingContent, error, clearError } = useStreamingChat({ sessionId })

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
  }

  if (isLoading) {
    return (
      <div
        className="flex flex-1 items-center justify-center"
        style={{ background: "#f7f4ef" }}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full"
              style={{ background: "#A6B3A8", animationDelay: `${i * 150}ms` }}
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
        style={{ background: "#f7f4ef" }}
      >
        <p className="text-sm" style={{ color: "#5D6862" }}>
          Couldn&apos;t load this session. Try refreshing.
        </p>
      </div>
    )
  }

  return (
    <>
      <ChatHeader
        session={data?.sessionMeta ?? null}
        onToggleSidebar={onToggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <MessageList
          messages={data?.messages ?? []}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
        />

        {error && (
          <div className="mx-auto w-full max-w-3xl px-4 mb-2">
            <div
              className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm"
              style={{
                background: "rgba(198,113,86,0.1)",
                border: "1px solid rgba(198,113,86,0.2)",
                color: "#C67156",
              }}
            >
              {error}
              <button onClick={clearError} className="ml-2 opacity-70 hover:opacity-100">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isStreaming}
        />
      </div>
    </>
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
      style={{ background: "#f7f4ef" }}
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
