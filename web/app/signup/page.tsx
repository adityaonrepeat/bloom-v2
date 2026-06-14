import Link from "next/link"
import Image from "next/image"
import { SignupForm } from "@/components/signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign up · Bloom",
  description: "Create your free Bloom account and start your mental wellness journey today.",
}

const perks = [
  { dot: "#E3A863", text: "100% free, no credit card needed" },
  { dot: "#A6B3A8", text: "Your journals stay private to you" },
  { dot: "#C67156", text: "Aastha AI therapist, always available" },
  { dot: "#7C9885", text: "Unlimited private journal entries" },
]

export default function SignupPage() {
  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      <div className="flex flex-col px-8 py-10 md:px-12">
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
                Create your account
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#5D6862" }}>
                Free forever. No credit card required.
              </p>
            </div>

            <SignupForm />

            <p className="mt-6 text-center text-sm" style={{ color: "#5D6862" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold transition-colors hover:opacity-80"
                style={{ color: "#C67156" }}
              >
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-xs text-center leading-relaxed" style={{ color: "rgba(93,104,98,0.5)" }}>
              By creating an account you agree to our{" "}
              <Link
                href="/terms"
                className="underline transition-colors hover:opacity-80"
                style={{ color: "#5D6862" }}
              >
                Terms
              </Link>{" "}
              and{" "}
              <span className="underline cursor-pointer" style={{ color: "#5D6862" }}>Privacy Policy</span>.
            </p>
          </div>
        </div>

        <p className="text-xs text-center" style={{ color: "rgba(93,104,98,0.45)" }}>
          &copy; {new Date().getFullYear()} Bloom. Your wellbeing, our priority.
        </p>
      </div>

      <div
        className="relative hidden lg:flex flex-col justify-between overflow-hidden p-16"
        style={{ background: "#28312C" }}
      >
        {/* Atmospheric blobs */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "-10%", left: "-10%",
            width: "500px", height: "500px",
            borderRadius: "50%",
            background: "rgba(166,179,168,0.18)",
            filter: "blur(88px)",
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            bottom: "-8%", right: "-8%",
            width: "420px", height: "420px",
            borderRadius: "50%",
            background: "rgba(198,113,86,0.2)",
            filter: "blur(80px)",
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
              <span>•</span> Start your journey today
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
              Feelings,<br />
              <span style={{ color: "#C67156", fontStyle: "italic" }}>finally</span><br />
              in full bloom.
            </h2>
            <p
              className="mt-6 leading-relaxed"
              style={{ fontSize: "16px", color: "#A6B3A8", maxWidth: "300px" }}
            >
              Join hundreds building healthier minds, one honest moment at a time.
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-4">
            {perks.map((p, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: p.dot }}
                />
                <span style={{ fontSize: "14px", color: "rgba(240,235,225,0.8)" }}>{p.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div
            className="rounded-2xl p-5 grid grid-cols-2 gap-5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {[
              { num: "100+", label: "People supported" },
              { num: "∞", label: "Journal entries" },
              { num: "24/7", label: "Aastha available" },
              { num: "0", label: "Ads, ever" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "28px",
                    letterSpacing: "-0.02em",
                    color: "#F0EBE1",
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </p>
                <p className="mt-1" style={{ fontSize: "12px", color: "#7C9885" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "rgba(166,179,168,0.45)" }}>
          &copy; {new Date().getFullYear()} Bloom. Your data stays private.
        </p>
      </div>
    </div>
  )
}
