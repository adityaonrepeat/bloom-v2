"use client"

import { useRef, type KeyboardEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    <div className="border-t bg-background px-4 pb-4 pt-3">
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border bg-card px-4 py-2.5 shadow-sm",
          "transition-colors focus-within:border-emerald-500/70 focus-within:ring-1 focus-within:ring-emerald-500/20"
        )}
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
            "placeholder:text-muted-foreground/60",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "min-h-[24px] max-h-[160px] overflow-y-auto"
          )}
        />
        <Button
          size="icon"
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className={cn(
            "h-8 w-8 flex-shrink-0 rounded-xl",
            "bg-emerald-700 hover:bg-emerald-800 text-white",
            "transition-all active:scale-95",
            "disabled:opacity-30"
          )}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
        Not a substitute for professional care. In crisis? Call iCall:{" "}
        <a
          href="tel:9152987821"
          className="underline underline-offset-2 hover:text-muted-foreground"
        >
          9152987821
        </a>
      </p>
    </div>
  )
}
