import Link from "next/link"
import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in — Bloom",
  description: "Sign in to your Bloom account to continue your mental wellness journey.",
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      {/* ── Left: Decorative dark panel ─────────────────── */}
      <div
        className="relative hidden lg:flex flex-col justify-between overflow-hidden p-16"
        style={{ background: "#28312C" }}
      >
        {/* Atmospheric blobs */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "-10%", right: "-10%",
            width: "520px", height: "520px",
            borderRadius: "50%",
            background: "rgba(198,113,86,0.22)",
            filter: "blur(90px)",
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            bottom: "-8%", left: "-8%",
            width: "380px", height: "380px",
            borderRadius: "50%",
            background: "rgba(166,179,168,0.15)",
            filter: "blur(72px)",
          }}
        />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 w-fit z-10" style={{ marginLeft: "-8px" }}>
          <Image
            src="/logo.png"
            alt=""
            width={72}
            height={52}
            style={{ mixBlendMode: "luminosity", opacity: 0.85, marginRight: "-16px" }}
          />
          <span
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "20px",
              letterSpacing: "-0.03em",
              color: "#F0EBE1",
              lineHeight: 1,
            }}
          >
            bloom
          </span>
        </Link>

        {/* Main content */}
        <div className="relative z-10 space-y-10">
          <div>
            <div
              className="inline-flex items-center gap-2 mb-6"
              style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A6B3A8" }}
            >
              <span>•</span> A soft place for the mind
            </div>
            <h2
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "52px",
                lineHeight: 0.97,
                letterSpacing: "-0.03em",
                color: "#F0EBE1",
              }}
            >
              Welcome<br />back to<br />
              <span style={{ color: "#C67156", fontStyle: "italic" }}>bloom.</span>
            </h2>
            <p
              className="mt-6 leading-relaxed"
              style={{ fontSize: "16px", color: "#A6B3A8", maxWidth: "300px" }}
            >
              Your feelings have been waiting. Let&rsquo;s pick up where you left off.
            </p>
          </div>

          {/* Testimonial */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p style={{ color: "rgba(240,235,225,0.85)", fontSize: "14px", lineHeight: 1.75, fontStyle: "italic" }}>
              &ldquo;Bloom changed how I see my own emotions. It&rsquo;s quiet, calm, and always there.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(198,113,86,0.3)", color: "#F0EBE1" }}
              >
                PK
              </div>
              <span style={{ fontSize: "12px", color: "#7C9885" }}>Priya K. — College student</span>
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["Mood tracking", "Aastha AI", "Private Journal", "Peer Talk"].map((f) => (
              <span
                key={f}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(240,235,225,0.65)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "rgba(166,179,168,0.45)" }}>
          &copy; {new Date().getFullYear()} Bloom. Your data stays private.
        </p>
      </div>

      {/* ── Right: Form ──────────────────────────────── */}
      <div className="flex flex-col px-8 py-10 md:px-12">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-1 w-fit lg:hidden" style={{ marginLeft: "-4px" }}>
          <Image
            src="/logo.png"
            alt=""
            width={56}
            height={41}
            style={{ mixBlendMode: "multiply", marginRight: "-12px" }}
          />
          <span
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "18px",
              letterSpacing: "-0.03em",
              color: "#28312C",
            }}
          >
            bloom
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "32px",
                  letterSpacing: "-0.02em",
                  color: "#28312C",
                  lineHeight: 1.1,
                }}
              >
                Sign in
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#5D6862" }}>
                Continue your wellness journey where you left off.
              </p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-sm" style={{ color: "#5D6862" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold transition-colors hover:opacity-80"
                style={{ color: "#C67156" }}
              >
                Create one free →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-center" style={{ color: "rgba(93,104,98,0.45)" }}>
          Your wellbeing, our priority.
        </p>
      </div>
    </div>
  )
}
