import Link from "next/link"
import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in · Bloom",
  description: "Sign in to your Bloom account to continue your mental wellness journey.",
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      <div
        className="relative hidden lg:flex flex-col overflow-hidden p-16 pl-38"
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

        {/* Logo — top */}
        <Link href="/" className="relative z-10 flex items-center gap-1 w-fit" style={{ marginLeft: "-8px" }}>
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

        {/* Main content + pills — sits right below logo */}
        <div className="relative z-10 mt-11.5">
          <div
            className="inline-flex items-center gap-2 mb-8"
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A6B3A8" }}
          >
            <span>•</span> A soft place for the mind
          </div>
          <h2
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "56px",
              lineHeight: 0.97,
              letterSpacing: "-0.03em",
              color: "#F0EBE1",
            }}
          >
            Welcome<br />back to<br />
            <span style={{ color: "#C67156", fontStyle: "italic" }}>bloom.</span>
          </h2>
          <p
            className="mt-8 leading-relaxed"
            style={{ fontSize: "16px", color: "#A6B3A8", maxWidth: "300px" }}
          >
            Your feelings have been waiting. Let&rsquo;s pick up where you left off.
          </p>

          {/* Pills — immediately below description */}
          <div className="flex flex-wrap gap-2 mt-8">
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

          <p className="mt-9 text-xs" style={{ color: "rgba(166,179,168,0.45)" }}>
            &copy; {new Date().getFullYear()} Bloom. Your wellbeing, our priority.
          </p>
        </div>
      </div>

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
      </div>
    </div>
  )
}
