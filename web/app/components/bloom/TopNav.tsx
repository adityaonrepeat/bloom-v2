"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { signOut } from "@/lib/auth-client";

interface NavTab {
  label: string;
  href: string;
}

const TABS: NavTab[] = [
  { label: "Today", href: "/dashboard" },
  { label: "Mood", href: "/mood" },
  { label: "Journal", href: "/journal" },
  { label: "Talk", href: "/talk" },
  { label: "Aastha", href: "/aastha" },
];

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push("/login");
  };

  return (
    <header
      data-testid="top-nav"
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(249,246,240,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(28,42,37,0.07)",
        height: "64px",
      }}
    >
      <div className="max-w-350 mx-auto px-6 md:px-10 h-full flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/dashboard"
          prefetch={false}
          data-testid="logo-link"
          className="flex items-center shrink-0"
          style={{ marginLeft: "-8px" }}
        >
          <Image
            src="/logo.png"
            alt=""
            width={56}
            height={41}
            priority
            style={{ mixBlendMode: "multiply", marginRight: "-10px", display: "block" }}
          />
          <span
            className="font-display"
            style={{
              fontSize: "20px",
              letterSpacing: "-0.03em",
              color: "#28312C",
              lineHeight: 1,
            }}
          >
            bloom
          </span>
        </Link>

        {/* Tabs */}
        <nav
          className="flex items-center gap-0.5 rounded-full p-1"
          style={{
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(40,49,44,0.09)",
          }}
        >
          {TABS.map((tab) => {
            const isActive =
              tab.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.label}
                href={tab.href}
                prefetch={false}
                data-testid={`tab-${tab.label.toLowerCase()}`}
                className="relative px-4 py-1.5 text-sm rounded-full transition-all duration-300"
                style={{
                  background: isActive ? "#28312C" : "transparent",
                  color: isActive ? "#f7f4ef" : "#5D6862",
                  fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif",
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Avatar + Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            data-testid="avatar-button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
            style={{
              background: dropdownOpen ? "rgba(40,49,44,0.12)" : "rgba(40,49,44,0.07)",
              border: "1px solid rgba(40,49,44,0.1)",
            }}
            aria-label="Account"
            aria-expanded={dropdownOpen}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#28312C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-2xl py-1.5 z-50"
              style={{
                background: "#fff",
                border: "1px solid rgba(40,49,44,0.09)",
                boxShadow: "0 8px 24px rgba(40,49,44,0.12)",
              }}
            >
              <Link
                href="/edit-profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors rounded-xl mx-1"
                style={{
                  color: "#28312C",
                  fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(40,49,44,0.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </Link>

              <div className="mx-3 my-1 h-px" style={{ background: "rgba(40,49,44,0.07)" }} />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left transition-colors rounded-xl mx-1"
                style={{
                  color: "#D96A4E",
                  width: "calc(100% - 8px)",
                  fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(217,106,78,0.07)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
