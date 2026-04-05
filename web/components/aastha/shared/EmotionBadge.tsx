import { cn } from "@/lib/utils"

interface EmotionBadgeProps {
  tag?: string | null
  score?: number | null
  className?: string
}

export function EmotionBadge({ tag, score, className }: EmotionBadgeProps) {
  if (!tag) return null

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-200",
        "bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700",
        "dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
        className
      )}
    >
      {tag}
      {score != null && (
        <span className="rounded-full bg-emerald-200 px-1.5 py-px text-[10px] font-semibold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200">
          {score}
        </span>
      )}
    </span>
  )
}
