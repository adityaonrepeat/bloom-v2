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
        toast.success("Profile edited successfully")
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Photo */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-sm shrink-0">
          <span className="text-emerald-700 font-bold text-2xl">
            {name.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="name">
          Full Name
        </label>
        <input 
          type="text" 
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-stone-400"
          placeholder="Your full name"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="email">
          Email Address
        </label>
        <input 
          type="email" 
          id="email"
          disabled
          value={email}
          className="w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 outline-none cursor-not-allowed"
        />
        <p className="text-xs text-stone-500">Your email address cannot be changed right now.</p>
      </div>

      {/* Save Button */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100 mt-8">
        <Link 
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
        >
          Cancel
        </Link>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
