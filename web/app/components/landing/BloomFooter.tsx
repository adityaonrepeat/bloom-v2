import Link from "next/link";

export default function BloomFooter() {
  return (
    <footer className="border-t border-black/5" style={{ background: "var(--bloom-bg)" }}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-14">
        <div className="grid grid-cols-12 gap-y-8 lg:gap-8">
          <div className="col-span-12 md:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--bloom-clay)" }}
              />
              <span className="font-display text-[22px] tracking-tight text-[#28312C]">bloom</span>
            </Link>
            <p className="text-sm text-[#5D6862] leading-relaxed max-w-xs">
              A quiet space to feel. Journal, track your mood, talk to Aastha,
              and find someone who gets it.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2 md:col-start-6">
            <div className="text-xs uppercase tracking-[0.18em] text-[#5D6862] mb-4">Product</div>
            <ul className="space-y-2.5">
              {[
                { label: "Journal", href: "#journal" },
                { label: "Mood", href: "#mood" },
                { label: "Aastha", href: "/aastha" },
                { label: "Talk", href: "#talk" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#28312C]/70 hover:text-[#28312C] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="text-xs uppercase tracking-[0.18em] text-[#5D6862] mb-4">Account</div>
            <ul className="space-y-2.5">
              {[
                { label: "Sign in", href: "/login" },
                { label: "Sign up", href: "/signup" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#28312C]/70 hover:text-[#28312C] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <div className="text-xs uppercase tracking-[0.18em] text-[#5D6862] mb-4">Safety</div>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy", href: "#safety" },
                { label: "Our values", href: "#safety" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#28312C]/70 hover:text-[#28312C] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-black/5 text-center">
          <p className="text-xs text-[#5D6862]">
            &copy; 2026 Bloom. Your wellbeing, our priority.
          </p>
        </div>
      </div>
    </footer>
  );
}
