import { useEffect, useRef } from "react"
import { MessageBubble, StreamingBubble } from "./MessageBubble"
import type { AasthaMessage } from "@/hooks/useAastha"

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(d, now)) return "Today"
  if (isSameDay(d, yesterday)) return "Yesterday"
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2 px-1">
      <div className="flex-1 h-px" style={{ background: "rgba(54,74,65,0.5)" }} />
      <span
        className="text-[10px] font-semibold tracking-widest"
        style={{ color: "rgba(249,246,240,0.35)" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(54,74,65,0.5)" }} />
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
        style={{
          background: "rgba(37,54,48,0.85)",
          border: "1px solid rgba(54,74,65,0.6)",
        }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full"
              style={{ background: "rgba(249,246,240,0.4)", animationDelay: `${i * 150}ms` }}
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
      className="aastha-messages flex flex-1 min-h-0 flex-col overflow-y-auto scroll-smooth"
      style={{ background: "#1C2A25" }}
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-6 space-y-4 sm:px-6">
        {displayMessages.map((msg, i) => {
          const isWelcome = msg.id === "__welcome__"
          const prev = displayMessages[i - 1]
          const showSeparator =
            !isWelcome &&
            (!prev || !isSameDay(new Date(msg.createdAt), new Date(prev.createdAt)))
          return (
            <div key={msg.id}>
              {showSeparator && <DateSeparator label={formatDateLabel(msg.createdAt)} />}
              <MessageBubble msg={msg} hideTimestamp={isWelcome} />
            </div>
          )
        })}

        {isStreaming && !streamingContent && <TypingIndicator />}
        {isStreaming && streamingContent && <StreamingBubble content={streamingContent} />}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
