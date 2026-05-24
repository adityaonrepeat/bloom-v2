import { useEffect, useRef } from "react"
import { MessageBubble, StreamingBubble } from "./MessageBubble"
import type { AasthaMessage } from "@/hooks/useAastha"

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
        style={{
          background: "#E3A863",
          color: "#28312C",
          fontFamily: "var(--font-fraunces), Georgia, serif",
        }}
      >
        A
      </div>
      <div
        className="rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(40,49,44,0.08)",
        }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full"
              style={{ background: "#A6B3A8", animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const WELCOME_MESSAGE: AasthaMessage = {
  id: "__welcome__",
  role: "assistant",
  content: "Hi, I'm Aastha. I'm here to listen. No judgment, no pressure.\n\nWhat's been on your mind lately?",
  createdAt: new Date().toISOString(),
}

interface MessageListProps {
  messages: AasthaMessage[]
  streamingContent: string
  isStreaming: boolean
}

export function MessageList({ messages, streamingContent, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, streamingContent])

  const displayMessages = messages.length === 0 ? [WELCOME_MESSAGE] : messages

  return (
    <div
      className="flex flex-1 flex-col overflow-y-auto scroll-smooth"
      style={{ background: "#f7f4ef" }}
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-6 space-y-4 sm:px-6">
        {displayMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {isStreaming && !streamingContent && <TypingIndicator />}
        {isStreaming && streamingContent && <StreamingBubble content={streamingContent} />}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
