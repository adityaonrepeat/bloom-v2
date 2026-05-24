import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Navbar from "../components/Navbar"
import JournalCard from "../components/JournalCard"
import JournalSearch from "../components/JournalSearch"
import Link from "next/link"
import { PenLine } from "lucide-react"

export default async function Journal({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")

  const userId = session.user.id
  const { q } = await searchParams
  const searchQuery = typeof q === "string" ? q : ""

  const journals = await prisma.journal.findMany({
    where: {
      userId,
      ...(searchQuery ? {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { content: { contains: searchQuery, mode: "insensitive" } },
        ],
      } : {}),
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "38px",
                letterSpacing: "-0.02em",
                color: "#28312C",
                lineHeight: 1.0,
              }}
            >
              My Journal
            </h1>
            <p className="mt-2" style={{ fontSize: "14px", color: "#5D6862" }}>
              {journals.length > 0
                ? `${journals.length} ${journals.length === 1 ? "entry" : "entries"}`
                : "Capturing moments of growth and stillness."}
            </p>
          </div>

          <Link
            href="/journal/new"
            className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "#28312C",
              color: "#f7f4ef",
              boxShadow: "0 4px 16px rgba(40,49,44,0.18)",
            }}
          >
            <PenLine size={14} />
            New Entry
          </Link>
        </div>

        <JournalSearch />

        {journals.length > 0 ? (
          <div className="space-y-3">
            {journals.map((j) => (
              <JournalCard key={j.id} journal={j} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-24 rounded-3xl space-y-5"
            style={{
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(40,49,44,0.08)",
            }}
          >
            <div
              className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(40,49,44,0.06)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#28312C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="m15 5 4 4"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "#28312C" }}>
                {searchQuery ? "No entries match your search." : "No journal entries yet."}
              </p>
              <p className="mt-1" style={{ fontSize: "13px", color: "#5D6862" }}>
                {searchQuery ? "Try a different keyword." : "Write your first entry — it only takes a moment."}
              </p>
            </div>
            {!searchQuery && (
              <Link
                href="/journal/new"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:opacity-90"
                style={{ background: "#28312C", color: "#f7f4ef" }}
              >
                <PenLine size={14} />
                Start writing
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
