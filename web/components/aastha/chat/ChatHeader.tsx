import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmotionBadge } from "../shared/EmotionBadge"
import type { AasthaSession } from "@/hooks/useAastha"

// ─── Empty state ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  onNewSession: () => void
  isCreating?: boolean
}

export function EmptyState({ onNewSession, isCreating }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-950">
        🌸
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">
          Hi, I&apos;m Aastha
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          A safe space to talk about whatever&apos;s on your mind. I&apos;m here to listen — without judgment.
        </p>
      </div>
      <Button
        onClick={onNewSession}
        disabled={isCreating}
        className="gap-2 rounded-xl bg-emerald-700 px-6 hover:bg-emerald-800"
      >
        <Sparkles className="h-4 w-4" />
        {isCreating ? "Starting…" : "Start a new session"}
      </Button>
    </div>
  )
}

// ─── Chat header ──────────────────────────────────────────────────────────────

interface ChatHeaderProps {
  session: AasthaSession | null
}

export function ChatHeader({ session }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
        A
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Aastha</p>
        <p className="text-[11px] text-muted-foreground">
          {session?.title && session.title !== "New Session"
            ? session.title
            : "Bloom Wellness · Confidential"}
        </p>
      </div>
      {session && <EmotionBadge tag={session.emotionTag} score={session.emotionScore} />}
    </div>
  )
}
