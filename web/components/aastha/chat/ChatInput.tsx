"use client"

import { useRef, type KeyboardEvent } from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = "Share what's on your mind…",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div
      className="px-4 pb-4 pt-3"
      style={{
        background: "rgba(247,244,239,0.92)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(40,49,44,0.08)",
        fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif",
      }}
    >
      <div className="mx-auto max-w-3xl">
        <div
          className="flex items-end gap-2 rounded-2xl px-4 py-2.5 transition-all"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(40,49,44,0.12)",
            boxShadow: "0 2px 8px rgba(40,49,44,0.06)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none",
              "min-h-6 max-h-40 overflow-y-auto",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            style={{ color: "#28312C" }}
          />
          <button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className="h-8 w-8 shrink-0 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
            style={{ background: "#28312C", color: "#f7f4ef" }}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px]" style={{ color: "rgba(93,104,98,0.45)" }}>
          Not a substitute for professional care. In crisis? Call iCall:{" "}
          <a
            href="tel:9152987821"
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "#5D6862" }}
          >
            9152987821
          </a>
        </p>
      </div>
    </div>
  )
}
