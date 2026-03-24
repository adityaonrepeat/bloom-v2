"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getEmotionLevel } from "@/utils/emotion"
import { authClient } from "@/lib/auth-client"

export default function Result() {

  const router = useRouter()

  const [score, setScore] = useState(0)
  const [level, setLevel] = useState("")
  const [uid, setUid] = useState<string | null>(null)

  // load user
  useEffect(() => {
    const loadUser = async () => {
      const res = await authClient.getSession()
      const session = "data" in res ? res.data : null
      setUid(session?.user?.id ?? null)
    }

    loadUser()
  }, [])

  // load score
  useEffect(() => {

    const storedScore = Number(
      localStorage.getItem("emotion-score") || 0
    )

    const tag = getEmotionLevel(storedScore)

    setScore(storedScore)
    setLevel(tag)

    // Store tag for socket matchmaking
    localStorage.setItem("emotion-tag", tag)

  }, [])

  // save result
  useEffect(() => {

    if (!uid || !score || !level) return

    const save = async () => {

      await fetch("/api/user/set-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uid,
          emotionalScore: score,
          emotionalTag: level
        })
      })

    }

    save()

  }, [uid, score, level])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4">

      <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-6 w-full max-w-md">

        <h1 className="text-2xl font-bold">
          Your Result
        </h1>

        <div className="space-y-2">

          <p className="text-lg">
            Score: {score}
          </p>

          <p className="text-xl font-semibold text-emerald-600">
            {level}
          </p>

        </div>

        <div className="space-y-3">

          <button
            onClick={() => router.push("/talk")}
            id="talk-btn"
            className="w-full h-12 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Talk to Someone
          </button>

          <button
            onClick={() => router.push("/aastha")}
            className="w-full h-12 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Talk to Aastha
          </button>

        </div>

      </div>

    </div>
  )
}