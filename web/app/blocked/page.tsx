import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-bloom-cream text-bloom-ink font-sans flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-bloom-line/70 shadow-[0_18px_50px_-30px_rgba(42,47,45,0.2)] overflow-hidden">
          <div className="h-1 bg-bloom-terracotta" />
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-bloom-terracotta/10 flex items-center justify-center">
              <ShieldAlert size={28} strokeWidth={1.75} className="text-bloom-terracotta" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl tracking-tight">Account restricted</h1>
              <p className="text-sm text-bloom-inkSoft leading-relaxed">
                Your account has been restricted following multiple reports from
                other members. You can&apos;t use Bloom Talk right now.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="block w-full rounded-full px-6 py-3 text-sm font-medium bg-bloom-forest text-bloom-cream hover:bg-bloom-forestSoft transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-bloom-inkSoft/70">
          If you believe this is a mistake, please contact support and we&apos;ll review it.
        </p>
      </div>
    </div>
  )
}
