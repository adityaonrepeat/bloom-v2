"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { questions } from "@/data/questions"
import ProgressBar from "../components/ProgressBar"

export default function Quiz() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedIndex = localStorage.getItem("quiz-index")
    const savedScore = localStorage.getItem("quiz-score")
    if (savedIndex !== null && savedScore !== null) {
      setIndex(parseInt(savedIndex, 10))
      setScore(parseInt(savedScore, 10))
    }
  }, [])

  function handleAnswer(optionScore: number) {
    if (selected !== null) return
    setSelected(optionScore)

    setTimeout(() => {
      const newScore = score + optionScore
      const newIndex = index + 1

      if (newIndex < questions.length) {
        setScore(newScore)
        setIndex(newIndex)
        setSelected(null)
        localStorage.setItem("quiz-score", newScore.toString())
        localStorage.setItem("quiz-index", newIndex.toString())
      } else {
        localStorage.setItem("emotion-score", newScore.toString())
        localStorage.removeItem("quiz-index")
        localStorage.removeItem("quiz-score")
        router.push("/result")
      }
    }, 350)
  }

  if (!isMounted) return null

  const question = questions[index]

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      <div className="w-full max-w-xl">

        {/* Badge */}
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(198,113,86,0.1)",
              border: "1px solid rgba(198,113,86,0.18)",
              color: "#C67156",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Mental Wellness Check-in
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 md:p-10 space-y-8"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(40,49,44,0.08)",
            boxShadow: "0 8px 40px rgba(40,49,44,0.08)",
          }}
        >
          <ProgressBar current={index + 1} total={questions.length} />

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400" key={index}>
            <h2
              className="leading-relaxed mb-8"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "22px",
                color: "#28312C",
                letterSpacing: "-0.01em",
              }}
            >
              {question.text}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, i) => {
                const isSelected = selected === option.score
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.score)}
                    disabled={selected !== null}
                    className="w-full p-4 text-left rounded-xl text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
                    style={{
                      border: isSelected ? "1.5px solid #C67156" : "1.5px solid rgba(40,49,44,0.1)",
                      background: isSelected ? "rgba(198,113,86,0.08)" : "rgba(255,255,255,0.6)",
                      color: isSelected ? "#C67156" : "#28312C",
                    }}
                    onMouseEnter={(e) => {
                      if (selected === null) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(198,113,86,0.4)"
                        ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(198,113,86,0.04)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selected === null) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(40,49,44,0.1)"
                        ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.6)"
                      }
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          border: isSelected ? "1.5px solid #C67156" : "1.5px solid rgba(40,49,44,0.15)",
                          color: isSelected ? "#C67156" : "#5D6862",
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(93,104,98,0.5)" }}>
          Your responses are private and only used to personalise your experience.
        </p>
      </div>
    </div>
  )
}
