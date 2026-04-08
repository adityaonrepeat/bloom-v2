"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"

export default function Navbar() {

  const path = usePathname()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const nav = [
    { name: "Home", href: "/dashboard" },
    { name: "Journal", href: "/journal" },
    { name: "Talk", href: "/talk" },
    { name: "Quiz", href: "/quiz" },
    { name: "Aastha", href: "/aastha" }
  ]

  return (

    <nav className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-stone-200/60 flex items-center justify-between px-10 sticky top-0 z-40">

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8 6 4 10 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 10 16 6 12 2Z" fill="#059669" opacity="0.15"/>
          <path d="M12 2C8 6 4 10 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 10 16 6 12 2Z" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V10" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          <path d="M8 14C8 14 10 12 12 14" stroke="#059669" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
          <path d="M16 14C16 14 14 12 12 14" stroke="#059669" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        </svg>
        <span className="text-lg font-bold text-stone-800 group-hover:text-emerald-800 transition-colors">
          Bloom
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-1">

        {nav.map((item) => {
          const isActive = path === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-emerald-800 bg-emerald-50"
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
              }`}
            >
              {item.name}
              {isActive && (
                <span className="block h-0.5 bg-emerald-600 rounded-full mt-0.5 mx-auto w-4" />
              )}
            </Link>
          )
        })}

      </div>

      {/* Profile section */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>

        {/* Avatar trigger */}
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center border-2 border-white shadow-sm hover:ring-2 hover:ring-emerald-100 transition-all focus:outline-none"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
            <Link 
              href="/edit-profile" 
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-emerald-700 transition-colors"
            >
              Edit Profile
            </Link>
            <div className="h-px bg-stone-100 my-1" />
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        )}

      </div>

    </nav>

  )
}