import { useEffect, useRef } from "react"
import { MessageBubble, StreamingBubble } from "./MessageBubble"
import type { AasthaMessage } from "@/hooks/useAastha"

// ─── Typing indicator ─────────────────────────────────────────────────────────

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[12px] font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
        A
      </div>
      <div className="rounded-2xl rounded-bl-sm border border-border/60 bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

// ─── Message list ─────────────────────────────────────────────────────────────

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

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6 scroll-smooth">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}

      {isStreaming && !streamingContent && <TypingIndicator />}
      {isStreaming && streamingContent && <StreamingBubble content={streamingContent} />}

      <div ref={bottomRef} />
    </div>
  )
}
