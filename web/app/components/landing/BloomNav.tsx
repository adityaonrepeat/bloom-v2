"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function BloomNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Talk", "Mood", "Aastha", "Journal", "Safety"];

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          height: "68px",
          background: scrolled || mobileOpen ? "rgba(247, 244, 239, 0.95)" : "transparent",
          backdropFilter: scrolled || mobileOpen ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled || mobileOpen ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled || mobileOpen ? "rgba(0,0,0,0.05)" : "transparent"}`,
        }}
      >
        <div className="mx-auto max-w-[1400px] h-full flex items-center justify-between px-6 sm:px-10 lg:px-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" style={{ marginLeft: "-16px" }}>
            <Image
              src="/logo.png"
              alt=""
              width={89}
              height={65}
              style={{ mixBlendMode: "multiply", display: "block", flexShrink: 0, marginRight: "-20px" }}
            />
            <span
              className="font-display"
              style={{ fontSize: "22px", letterSpacing: "-0.03em", color: "#28312C", lineHeight: 1 }}
            >
              bloom
            </span>
          </Link>

          {/* Navigation — desktop */}
          <nav className="hidden md:flex items-center" style={{ gap: "42px" }}>
            {navLinks.map((label) => (
              <a key={label} href={`#${label.toLowerCase()}`} className="bloom-nav-link">
                {label}
              </a>
            ))}
          </nav>

          {/* CTA group */}
          <div className="flex items-center" style={{ gap: "16px" }}>
            <Link href="/login" className="bloom-nav-link hidden sm:inline-flex">
              Sign in
            </Link>
            <Link href="/signup" className="bloom-begin-btn hidden md:inline-flex">
              Begin free
            </Link>
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#28312C]"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div
          className="fixed inset-x-0 top-[68px] z-40 md:hidden flex flex-col"
          style={{
            background: "rgba(247, 244, 239, 0.97)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <nav className="flex flex-col px-6 pt-4 pb-2">
            {navLinks.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="py-4 font-display text-xl text-[#28312C] border-b border-black/5 last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 px-6 py-5 border-t border-black/5">
            <Link
              href="/login"
              className="text-center py-3.5 rounded-full border border-black/15 text-[#28312C] text-[15px] font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bloom-begin-btn text-center"
              onClick={() => setMobileOpen(false)}
            >
              Begin free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
