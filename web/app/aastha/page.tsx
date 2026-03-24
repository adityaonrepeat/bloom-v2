"use client"

import { useRouter } from "next/navigation"

export default function AasthaPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">

        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
          <span className="text-4xl">🤖</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Aastha — AI Therapist
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your AI companion for mental wellness support.
            This feature is coming soon.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
