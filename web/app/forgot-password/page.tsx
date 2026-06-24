import Link from "next/link";
import Image from "next/image";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password · Bloom",
  description: "Reset your Bloom account password and get back to your wellness journey.",
};

export default function ForgotPasswordPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-12"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      {/* Atmospheric blobs */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "-12%", left: "-8%",
          width: "460px", height: "460px",
          borderRadius: "50%",
          background: "rgba(198,113,86,0.12)",
          filter: "blur(90px)",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%", right: "-8%",
          width: "420px", height: "420px",
          borderRadius: "50%",
          background: "rgba(166,179,168,0.16)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-1 w-fit mx-auto mb-8">
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
              fontSize: "20px",
              letterSpacing: "-0.03em",
              color: "#28312C",
            }}
          >
            bloom
          </span>
        </Link>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
