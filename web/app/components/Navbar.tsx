"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"

const nav = [
  { name: "Home", href: "/dashboard" },
  { name: "Journal", href: "/journal" },
  { name: "Talk", href: "/talk" },
  { name: "Quiz", href: "/quiz" },
  { name: "Aastha", href: "/aastha" },
]

export default function Navbar() {
  const path = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <nav
      className="w-full sticky top-0 z-40"
      style={{
        background: "rgba(247,244,239,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(40,49,44,0.08)",
        fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-10 h-[58px]">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center w-fit" style={{ marginLeft: "-6px" }}>
          <Image
            src="/logo.png"
            alt="Bloom"
            width={52}
            height={38}
            style={{ mixBlendMode: "multiply", marginRight: "-10px" }}
          />
          <span
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "18px",
              letterSpacing: "-0.03em",
              color: "#28312C",
              lineHeight: 1,
            }}
          >
            bloom
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {nav.map((item) => {
            const isActive =
              path === item.href ||
              (item.href !== "/dashboard" && path.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-3.5 py-1.5 text-[13.5px] font-medium transition-colors duration-150 rounded-lg"
                style={{ color: isActive ? "#28312C" : "#A6B3A8" }}
              >
                {item.name}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3.5 right-3.5 h-[1.5px] rounded-full"
                    style={{ background: "#C67156" }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right — Profile dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 transition-opacity hover:opacity-75"
              title="Account"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(40,49,44,0.08)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#28312C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A6B3A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {open && (
              <div
                className="absolute right-0 top-[calc(100%+8px)] w-44 rounded-xl overflow-hidden z-50"
                style={{
                  background: "rgba(255,255,255,0.98)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(40,49,44,0.1)",
                  boxShadow: "0 8px 32px rgba(40,49,44,0.12)",
                }}
              >
                <div className="p-1">
                  <Link
                    href="/edit-profile"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-[13px] font-medium rounded-lg transition-colors"
                    style={{ color: "#28312C" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(40,49,44,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Edit profile
                  </Link>
                  <div className="h-px mx-1 my-1" style={{ background: "rgba(40,49,44,0.06)" }} />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors"
                    style={{ color: "#C67156" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(198,113,86,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  )
}
