"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition, useState } from "react"

export default function JournalSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(query ? `/journal?q=${encodeURIComponent(query)}` : "/journal")
    })
  }

  return (
    <form onSubmit={handleSearch} className="mb-8 relative max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search entries…"
        className="w-full h-11 pl-11 pr-4 rounded-xl outline-none transition-all placeholder:text-stone-400"
        style={{
          background: "rgba(255,255,255,0.82)",
          border: "1px solid rgba(40,49,44,0.12)",
          color: "#28312C",
          fontSize: "14px",
          boxShadow: "0 2px 8px rgba(40,49,44,0.04)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "1px solid rgba(198,113,86,0.5)"
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(198,113,86,0.1)"
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "1px solid rgba(40,49,44,0.12)"
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(40,49,44,0.04)"
        }}
      />
      <svg
        className={`absolute left-3.5 top-3 w-5 h-5 transition-opacity ${isPending ? "opacity-40" : "opacity-100"}`}
        fill="none"
        stroke="#5D6862"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </form>
  )
}
