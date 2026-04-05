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

// ─── Markdown renderer config ─────────────────────────────────────────────────

const markdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="my-2 space-y-1 pl-4">{children}</ul>,
  li: ({ children }) => (
    <li className="relative pl-2 before:absolute before:left-[-8px] before:content-['·'] before:font-bold">
      {children}
    </li>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/10 px-1 py-0.5 text-[12px] font-mono">{children}</code>
  ),
}

// ─── User bubble ──────────────────────────────────────────────────────────────

function UserBubble({ msg }: { msg: AasthaMessage }) {
  return (
    <div className="flex items-end justify-end gap-2">
      <div className="max-w-[72%]">
        <div className="rounded-2xl rounded-br-sm bg-emerald-700 px-4 py-2.5 text-sm text-white shadow-sm">
          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        </div>
        <p className="mt-1 pr-1 text-right text-[10px] text-muted-foreground">
          {timeAgo(msg.createdAt)}
        </p>
      </div>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-stone-200 text-[12px] font-semibold text-stone-600 dark:bg-stone-700 dark:text-stone-300">
        U
      </div>
    </div>
  )
}

// ─── Aastha bubble ────────────────────────────────────────────────────────────

function AasthaBubble({
  msg,
  isStreaming,
}: {
  msg: AasthaMessage
  isStreaming?: boolean
}) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[12px] font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
        A
      </div>
      <div className="max-w-[72%]">
        <div
          className={cn(
            "rounded-2xl rounded-bl-sm border bg-card px-4 py-2.5 text-sm shadow-sm",
            "border-border/60",
            isStreaming && "animate-pulse-subtle"
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {msg.content}
          </ReactMarkdown>
          {isStreaming && (
            <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-blink bg-emerald-600" />
          )}
        </div>
        {!isStreaming && (
          <p className="mt-1 pl-1 text-[10px] text-muted-foreground">{timeAgo(msg.createdAt)}</p>
        )}
      </div>
    </div>
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

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
