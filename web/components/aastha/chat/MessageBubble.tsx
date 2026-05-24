import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import type { AasthaMessage } from "@/hooks/useAastha"

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
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
    <code className="rounded px-1 py-0.5 text-[12px] font-mono" style={{ background: "rgba(40,49,44,0.08)" }}>
      {children}
    </code>
  ),
}

function UserBubble({ msg }: { msg: AasthaMessage }) {
  return (
    <div className="flex items-end justify-end gap-2">
      <div className="max-w-[72%]">
        <div
          className="rounded-2xl rounded-br-sm px-4 py-2.5 text-sm shadow-sm"
          style={{ background: "#28312C", color: "#F0EBE1" }}
        >
          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        </div>
        <p className="mt-1 pr-1 text-right text-[10px]" style={{ color: "rgba(93,104,98,0.5)" }}>
          {timeAgo(msg.createdAt)}
        </p>
      </div>
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
        style={{ background: "rgba(40,49,44,0.08)", color: "#28312C" }}
      >
        U
      </div>
    </div>
  )
}

function AasthaBubble({ msg, isStreaming }: { msg: AasthaMessage; isStreaming?: boolean }) {
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
      <div className="max-w-[72%]">
        <div
          className={cn(
            "rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm shadow-sm",
            isStreaming && "animate-pulse-subtle"
          )}
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(40,49,44,0.08)",
            color: "#28312C",
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {msg.content}
          </ReactMarkdown>
          {isStreaming && (
            <span
              className="ml-0.5 inline-block h-3.5 w-0.5 animate-blink"
              style={{ background: "#C67156" }}
            />
          )}
        </div>
        {!isStreaming && (
          <p className="mt-1 pl-1 text-[10px]" style={{ color: "rgba(93,104,98,0.5)" }}>
            {timeAgo(msg.createdAt)}
          </p>
        )}
      </div>
    </div>
  )
}

export function MessageBubble({ msg }: { msg: AasthaMessage }) {
  if (msg.role === "user") return <UserBubble msg={msg} />
  return <AasthaBubble msg={msg} />
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
