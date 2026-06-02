import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import TopNav from "../components/bloom/TopNav"
import JournalSearch from "../components/JournalSearch"
import Link from "next/link"
import { Plus, ArrowRight, KeyRound } from "lucide-react"
import { Suspense } from "react"

function formatEntryDate(date: Date): string {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase()
    return `Today · ${time}`
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  }
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}


export default async function Journal({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")

  const userId = session.user.id
  const { q } = await searchParams
  const searchQuery = typeof q === "string" ? q : ""

  const journals = await prisma.journal.findMany({
    where: {
      userId,
      ...(searchQuery
        ? {
            OR: [
              { title: { contains: searchQuery, mode: "insensitive" } },
              { content: { contains: searchQuery, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  })

  const latest = journals[0]

  return (
    <div className="min-h-screen bg-bloom-cream text-bloom-ink">
      <TopNav />
      <main className="pt-16">
        <div className="max-w-350 mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">

            {/* Left — image card */}
            <div className="col-span-12 md:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden aspect-4/5 bg-bloom-forest">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=70"
                  alt="Pen on paper"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-linear-to-t from-bloom-forest/85 via-bloom-forest/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="eyebrow text-bloom-cream/60 mb-3">
                    {latest ? formatEntryDate(new Date(latest.createdAt)) : "Your journal"}
                  </p>
                  <p className="font-display text-2xl italic text-bloom-cream leading-snug">
                    &ldquo;
                    {latest
                      ? `${latest.content.slice(0, 80)}${latest.content.length > 80 ? "…" : ""}`
                      : "The page is here when you’re ready."}
                    &rdquo;
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 right-4 md:right-8 bg-white border border-bloom-line rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_20px_50px_-20px_rgba(42,47,45,0.25)]">
                <KeyRound size={16} strokeWidth={1.5} className="text-bloom-terracotta" />
                <div>
                  <p className="eyebrow text-bloom-inkSoft">End-to-end private</p>
                  <p className="text-sm font-medium text-bloom-ink">Only you hold the key.</p>
                </div>
              </div>
            </div>

            {/* Right — entries list */}
            <div className="col-span-12 md:col-span-7 md:pl-6">
              <p className="eyebrow text-bloom-inkSoft mb-5">Journal · recent</p>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
                A page that{" "}
                <span className="italic font-light text-bloom-terracotta">doesn&apos;t judge</span>{" "}
                you back.
              </h2>

              <div className="mt-8 flex items-center gap-3">
                <Suspense>
                  <JournalSearch />
                </Suspense>
                <Link
                  href="/journal/new"
                  data-testid="new-journal-entry"
                  className="shrink-0 inline-flex items-center gap-2 bg-bloom-forest text-bloom-cream rounded-full pl-5 pr-6 py-3 text-sm hover:bg-bloom-forestSoft transition-colors"
                >
                  <Plus size={15} strokeWidth={1.75} />
                  New entry
                </Link>
              </div>

              {journals.length > 0 ? (
                <div className="mt-2">
                  {journals.map((entry, i) => (
                    <Link
                      key={entry.id}
                      href={`/journal/${entry.id}`}
                      data-testid={`journal-entry-${i}`}
                      className="group flex items-baseline justify-between gap-6 py-5 border-b border-bloom-line hover:border-bloom-terracotta/60 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4">
                          <span className="eyebrow text-bloom-inkSoft w-28 shrink-0">
                            {formatEntryDate(new Date(entry.createdAt))}
                          </span>
                          <p className="font-display text-xl md:text-2xl text-bloom-ink leading-tight group-hover:text-bloom-terracotta transition-colors truncate">
                            {entry.title}
                          </p>
                        </div>
                        <p className="mt-2 ml-32 text-sm text-bloom-inkSoft italic truncate">
                          {entry.content.slice(0, 100)}
                          {entry.content.length > 100 ? "…" : ""}
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        strokeWidth={1.5}
                        className="shrink-0 text-bloom-inkSoft group-hover:text-bloom-terracotta group-hover:translate-x-0.5 transition-all"
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-10">
                  <p className="font-display text-xl text-bloom-inkSoft italic">
                    {searchQuery
                      ? "No entries match your search."
                      : "Your story begins with the first line."}
                  </p>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
