import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import type { AasthaMessage } from "@/hooks/useAastha"

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const h = d.getHours() % 12 || 12
  const mins = d.getMinutes().toString().padStart(2, "0")
  const ampm = d.getHours() >= 12 ? "pm" : "am"
  return `${h}:${mins}${ampm}`
}

const markdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="my-2 space-y-1 pl-4">{children}</ul>,
  li: ({ children }) => (
    <li className="relative pl-2 before:absolute before:-left-2 before:content-['·'] before:font-bold">
      {children}
    </li>
  ),
  code: ({ children }) => (
    <code
      className="rounded px-1 py-0.5 text-[12px] font-mono"
      style={{ background: "rgba(249,246,240,0.15)" }}
    >
      {children}
    </code>
  ),
}

function UserBubble({ msg }: { msg: AasthaMessage }) {
  return (
    <div className="flex items-end justify-end">
      <div className="max-w-[72%]">
        <div
          className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm shadow-sm"
          style={{ background: "#D96A4E", color: "#F9F6F0" }}
        >
          <p className="leading-relaxed whitespace-pre-wrap wrap-break-word">{msg.content}</p>
        </div>
        <p
          className="mt-1 pr-1 text-right text-[10px]"
          style={{ color: "rgba(249,246,240,0.4)" }}
        >
          {formatTime(msg.createdAt)}
        </p>
      </div>
    </div>
  )
}

function AasthaBubble({ msg, isStreaming, hideTimestamp }: { msg: AasthaMessage; isStreaming?: boolean; hideTimestamp?: boolean }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[72%]">
        <div
          className={cn(
            "rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm shadow-sm",
            isStreaming && "animate-pulse-subtle"
          )}
          style={{
            background: "rgba(37,54,48,0.85)",
            border: "1px solid rgba(54,74,65,0.6)",
            color: "#F9F6F0",
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {msg.content}
          </ReactMarkdown>
          {isStreaming && (
            <span
              className="ml-0.5 inline-block h-3.5 w-0.5 animate-blink"
              style={{ background: "#D96A4E" }}
            />
          )}
        </div>
        {!isStreaming && !hideTimestamp && (
          <p
            className="mt-1 pl-1 text-[10px]"
            style={{ color: "rgba(249,246,240,0.4)" }}
          >
            {formatTime(msg.createdAt)}
          </p>
        )}
      </div>
    </div>
  )
}

export function MessageBubble({ msg, hideTimestamp }: { msg: AasthaMessage; hideTimestamp?: boolean }) {
  if (msg.role === "user") return <UserBubble msg={msg} />
  return <AasthaBubble msg={msg} hideTimestamp={hideTimestamp} />
}

export function StreamingBubble({ content }: { content: string }) {
  const fakeMsg: AasthaMessage = {
    id: "streaming",
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
  }
  return <AasthaBubble msg={fakeMsg} isStreaming />
}
