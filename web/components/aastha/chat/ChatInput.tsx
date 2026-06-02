"use client"

import { useRef, useEffect, type KeyboardEvent } from "react"
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
  placeholder = "Tell Aastha what's on your chest…",
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

  // Reset height when value is cleared externally (e.g. after send)
  useEffect(() => {
    if (!value && textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [value])

  return (
    <div
      className="px-4 pb-4 pt-3"
      style={{
        background: "rgba(28,42,37,0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(54,74,65,0.5)",
        fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif",
      }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-3">
          <div
            className="flex-1 flex items-end rounded-2xl px-4 py-2.5 transition-all"
            style={{
              background: "rgba(37,54,48,0.7)",
              border: "1px solid #364A41",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
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
                "aastha-textarea",
                "flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none",
                "min-h-6 max-h-40",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "placeholder:text-[rgba(249,246,240,0.35)]"
              )}
              style={{ color: "#F9F6F0" }}
            />
          </div>
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center bg-bloom-terracotta hover:bg-bloom-terracottaHover text-bloom-cream transition-all shadow-[0_4px_12px_rgba(217,106,78,0.3)] hover:shadow-[0_4px_16px_rgba(217,106,78,0.45)] active:scale-95 disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p
          className="mt-2 text-center text-[10px]"
          style={{ color: "rgba(249,246,240,0.3)" }}
        >
          Not a substitute for professional care. In crisis? Call iCall:{" "}
          <a
            href="tel:9152987821"
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "rgba(249,246,240,0.5)" }}
          >
            9152987821
          </a>
        </p>
      </div>
    </div>
  )
}
