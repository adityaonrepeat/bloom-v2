"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateProfile } from "@/server/user-actions"

interface Props {
  initialName: string
  email: string
}

export function EditProfileForm({ initialName, email }: Props) {
  const [name, setName] = useState(initialName)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateProfile(name)
      if (result.success) {
        toast.success("Profile updated")
        router.refresh()
        router.push("/dashboard")
      } else {
        toast.error(result.error || "Failed to update profile")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const initial = name.charAt(0).toUpperCase() || "U"

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}>
      {/* Avatar initial */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(40,49,44,0.08)", border: "2px solid rgba(40,49,44,0.1)" }}
        >
          <span
            className="font-display"
            style={{ fontSize: "22px", color: "#28312C", letterSpacing: "-0.02em" }}
          >
            {initial}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "#28312C" }}>{name || "Your name"}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(40,49,44,0.45)" }}>{email}</p>
        </div>
      </div>

      {/* Name field */}
      <div className="space-y-1.5">
        <label
          className="text-sm font-medium"
          htmlFor="name"
          style={{ color: "#28312C" }}
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          required
          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "rgba(40,49,44,0.04)",
            border: "1px solid rgba(40,49,44,0.12)",
            color: "#28312C",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid rgba(40,49,44,0.35)"
            e.currentTarget.style.background = "#fff"
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid rgba(40,49,44,0.12)"
            e.currentTarget.style.background = "rgba(40,49,44,0.04)"
          }}
        />
      </div>

      {/* Email field — read-only */}
      <div className="space-y-1.5">
        <label
          className="text-sm font-medium"
          htmlFor="email"
          style={{ color: "#28312C" }}
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          disabled
          value={email}
          className="w-full h-11 px-4 rounded-xl text-sm cursor-not-allowed"
          style={{
            background: "rgba(40,49,44,0.03)",
            border: "1px solid rgba(40,49,44,0.08)",
            color: "rgba(40,49,44,0.4)",
          }}
        />
        <p className="text-xs" style={{ color: "rgba(40,49,44,0.4)" }}>
          Email cannot be changed right now.
        </p>
      </div>

      {/* Actions */}
      <div
        className="pt-5 flex items-center justify-end gap-3"
        style={{ borderTop: "1px solid rgba(40,49,44,0.07)", marginTop: "8px" }}
      >
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
          style={{ color: "rgba(40,49,44,0.6)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(40,49,44,0.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50"
          style={{
            background: "#28312C",
            color: "#f7f4ef",
            boxShadow: "0 4px 16px rgba(40,49,44,0.15)",
          }}
        >
          {isSubmitting ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
