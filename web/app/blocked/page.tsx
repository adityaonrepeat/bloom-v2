"use client"

import { useRouter } from "next/navigation"

export default function BlockedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">

        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-4xl">🚫</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Account Restricted
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your account has been restricted due to multiple reports from other users.
            You are unable to use the Talk feature at this time.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-900 transition text-sm"
          >
            Go to Dashboard
          </button>
          <p className="text-xs text-gray-400">
            If you believe this is a mistake, please contact support.
          </p>
        </div>

      </div>
    </div>
  )
}
