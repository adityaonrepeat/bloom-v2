import Link from "next/link"

interface Journal {
  id: string
  title: string
  content: string
  createdAt: Date | string
}

export default function JournalCard({ journal }: { journal: Journal }) {
  const date = new Date(journal.createdAt)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const isToday = date.toDateString() === today.toDateString()
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const dateText = isToday
    ? "Today"
    : isYesterday
    ? "Yesterday"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  return (
    <Link href={`/journal/${journal.id}`} className="block group h-full">
      <div
        className="h-full flex flex-col justify-between rounded-xl px-5 py-4 min-h-35 relative overflow-hidden transition-all duration-200 cursor-pointer"
        style={{
          background: "rgba(40,49,44,0.04)",
          border: "1px solid rgba(40,49,44,0.08)",
        }}
      >
        {/* Leaf decoration */}
        <div
          aria-hidden
          className="absolute -bottom-2 -right-4 w-24 h-24 opacity-[0.12] pointer-events-none transition-transform group-hover:scale-110"
        >
          <svg viewBox="0 0 100 100" fill="#28312C">
            <path d="M70 10C70 10 30 20 20 50C10 80 15 95 15 95C15 95 30 90 50 70C70 50 80 20 70 10Z" />
          </svg>
        </div>

        <div className="relative z-10 space-y-1 mb-3">
          <h3
            className="line-clamp-1 group-hover:opacity-80 transition-opacity"
            style={{ fontSize: "14px", fontWeight: 500, color: "#28312C", lineHeight: 1.3 }}
          >
            {journal.title}
          </h3>
          <p style={{ fontSize: "11px", color: "#5D6862" }}>
            {dateText} · {time}
          </p>
        </div>

        <div className="relative z-10">
          <p
            className="line-clamp-3 leading-relaxed"
            style={{ fontSize: "12px", color: "#5D6862" }}
          >
            {journal.content}
          </p>
        </div>
      </div>
    </Link>
  )
}
