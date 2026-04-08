"use client"

import { useState } from "react"
import { useMessages, useCreateSession, type AasthaSession } from "@/hooks/useAastha"
import { useStreamingChat } from "@/hooks/useStreamingChat"
import { ChatHeader, EmptyState } from "./ChatHeader"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X } from "lucide-react"

interface ChatContainerProps {
  activeSessionId: string | null
  onSessionCreated: (session: AasthaSession) => void
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

// ─── Active chat ──────────────────────────────────────────────────────────────

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
  const { sendMessage, isStreaming, streamingContent, error, clearError } = useStreamingChat({
    sessionId,
  })

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-emerald-300"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">
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

      {/* Centered conversation area like ChatGPT */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <MessageList
          messages={data?.messages ?? []}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
        />

        {error && (
          <div className="mx-auto w-full max-w-3xl px-4">
            <Alert variant="destructive" className="mb-2 py-2">
              <AlertDescription className="flex items-center justify-between text-sm">
                {error}
                <button onClick={clearError} className="ml-2 opacity-70 hover:opacity-100">
                  <X className="h-3.5 w-3.5" />
                </button>
              </AlertDescription>
            </Alert>
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

// ─── ChatContainer ────────────────────────────────────────────────────────────

export function ChatContainer({ activeSessionId, onSessionCreated, onToggleSidebar, sidebarOpen }: ChatContainerProps) {
  const { mutate: createSession, isPending } = useCreateSession()

  const handleNewSession = () => {
    createSession(undefined, {
      onSuccess: (session) => onSessionCreated(session),
    })
  }

  return (
    <div className="flex h-full flex-col bg-background">
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
