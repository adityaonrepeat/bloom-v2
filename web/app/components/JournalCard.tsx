import Link from "next/link"

export default function JournalCard({ journal }: any) {

  const date = new Date(journal.createdAt)
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  return (

    <Link href="/journal" className="block group">
      <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200 transition-all duration-300 h-full">

        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-stone-800 text-sm leading-tight group-hover:text-emerald-800 transition-colors">
            {journal.title}
          </h3>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <path d="M7 7h10v10"/>
            <path d="M7 17 17 7"/>
          </svg>
        </div>

        <p className="text-stone-500 text-xs leading-relaxed line-clamp-3">
          {journal.content.slice(0, 100)}
          {journal.content.length > 100 && "..."}
        </p>

        <div className="flex items-center gap-1.5 mt-4 text-stone-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
          <span className="text-[11px] font-medium">
            {formattedDate} · {formattedTime}
          </span>
        </div>

      </div>
    </Link>

  )
}