import Link from "next/link"
import { MailCheck } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-bloom-cream text-bloom-ink font-sans flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-bloom-line/70 shadow-[0_18px_50px_-30px_rgba(42,47,45,0.2)] overflow-hidden">
          <div className="h-1 bg-bloom-terracotta" />
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-bloom-terracotta/10 flex items-center justify-center">
              <MailCheck size={28} strokeWidth={1.75} className="text-bloom-terracotta" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl tracking-tight">Check your inbox</h1>
              <p className="text-sm text-bloom-inkSoft leading-relaxed">
                We&apos;ve sent you a verification link. Click it to activate your
                account, then come back and sign in.
              </p>
            </div>

            <p className="text-xs text-bloom-inkSoft/70">
              Didn&apos;t get it? Check your spam folder, or wait a moment and try again.
            </p>

            <Link
              href="/login"
              className="inline-block text-sm font-medium text-bloom-terracotta hover:text-bloom-terracottaHover transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
