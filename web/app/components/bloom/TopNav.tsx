"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, LogOut, Menu, X } from "lucide-react";
import { signOut, authClient } from "@/lib/auth-client";

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

function isTabActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname.startsWith(href);
}

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [initial, setInitial] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authClient.getSession().then((res: any) => {
      const user = res?.data?.user ?? res?.user;
      const name = (user?.name ?? user?.email ?? "").trim();
      if (name) setInitial(name.charAt(0).toUpperCase());
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push("/login");
  };

  return (
    <header
      data-testid="top-nav"
      className="fixed top-0 inset-x-0 z-50 h-16 border-b border-bloom-forest/[0.07] bg-bloom-cream/85 backdrop-blur-xl"
    >
      <div className="max-w-350 mx-auto px-6 md:px-10 h-full flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/dashboard"
          prefetch={false}
          data-testid="logo-link"
          className="flex items-center shrink-0 -ml-4"
        >
          <Image
            src="/logo.png"
            alt=""
            width={89}
            height={65}
            priority
            className="block -mr-5 mix-blend-multiply"
          />
          <span className="font-display text-[22px] leading-none tracking-[-0.03em] text-bloom-ink">
            bloom
          </span>
        </Link>

        {/* Tabs — desktop */}
        <nav className="hidden md:flex items-center gap-0.5 rounded-full p-1 bg-white/60 border border-bloom-ink/[0.09]">
          {TABS.map((tab) => {
            const active = isTabActive(pathname, tab.href);
            return (
              <Link
                key={tab.label}
                href={tab.href}
                prefetch={false}
                data-testid={`tab-${tab.label.toLowerCase()}`}
                className="relative px-4 py-1.5 text-sm font-body rounded-full transition-colors duration-300"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-bloom-forest"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    active ? "text-bloom-cream" : "text-bloom-inkSoft hover:text-bloom-ink"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile menu toggle */}
          <button
            data-testid="mobile-menu-button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-bloom-ink bg-bloom-ink/[0.06] border border-bloom-ink/10 hover:bg-bloom-ink/10 transition-colors"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={16} strokeWidth={1.75} /> : <Menu size={16} strokeWidth={1.75} />}
          </button>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              data-testid="avatar-button"
              onClick={() => setDropdownOpen((v) => !v)}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-display text-[15px] leading-none text-bloom-cream bg-bloom-terracotta transition-shadow ring-offset-2 ring-offset-bloom-cream ${
                dropdownOpen ? "ring-2 ring-bloom-terracotta/40" : "hover:ring-2 hover:ring-bloom-terracotta/25"
              }`}
              aria-label="Account"
              aria-expanded={dropdownOpen}
            >
              <span className="pt-px">{initial || "·"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl p-1.5 bg-white border border-bloom-line/80 shadow-[0_16px_40px_-16px_rgba(42,47,45,0.28)] animate-scale-in origin-top-right">
                <Link
                  href="/edit-profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-body rounded-xl text-bloom-ink hover:bg-bloom-ink/[0.05] transition-colors"
                >
                  <Pencil size={14} strokeWidth={1.75} className="text-bloom-inkSoft" />
                  Edit profile
                </Link>

                <div className="mx-2 my-1 h-px bg-bloom-line" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-body text-left rounded-xl text-bloom-terracotta hover:bg-bloom-terracotta/[0.08] transition-colors"
                >
                  <LogOut size={14} strokeWidth={1.75} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs — mobile sheet */}
      {menuOpen && (
        <nav className="md:hidden border-t border-bloom-line/70 bg-bloom-cream/95 backdrop-blur-xl px-6 py-3 animate-fade-up">
          <div className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const active = isTabActive(pathname, tab.href);
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  prefetch={false}
                  data-testid={`mobile-tab-${tab.label.toLowerCase()}`}
                  className={`px-4 py-2.5 text-sm font-body rounded-xl transition-colors ${
                    active
                      ? "bg-bloom-forest text-bloom-cream"
                      : "text-bloom-inkSoft hover:bg-bloom-ink/[0.05] hover:text-bloom-ink"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
