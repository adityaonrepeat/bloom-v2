"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { questions } from "@/data/questions"
import ProgressBar from "../components/ProgressBar"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function Quiz() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [readyToFinish, setReadyToFinish] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedIndex = localStorage.getItem("quiz-index")
    const savedScore = localStorage.getItem("quiz-score")
    if (savedIndex !== null && savedScore !== null) {
      setIndex(parseInt(savedIndex, 10))
      setScore(parseInt(savedScore, 10))
    }
  }, [])

  const isLastQuestion = index === questions.length - 1

  function handleAnswer(optionScore: number) {
    if (selected !== null) return
    setSelected(optionScore)

    const newScore = score + optionScore

    if (isLastQuestion) {
      localStorage.setItem("emotion-score", newScore.toString())
      localStorage.removeItem("quiz-index")
      localStorage.removeItem("quiz-score")
      setScore(newScore)
      setReadyToFinish(true)
    } else {
      setTimeout(() => {
        setScore(newScore)
        setIndex(index + 1)
        setSelected(null)
        localStorage.setItem("quiz-score", newScore.toString())
        localStorage.setItem("quiz-index", (index + 1).toString())
      }, 350)
    }
  }

  function handleFinish() {
    router.push("/result")
  }

  if (!isMounted) return null

  const question = questions[index]

  return (
    <div className="min-h-screen bg-bloom-cream font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">

        {/* Header: back link + eyebrow */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-bloom-inkSoft hover:text-bloom-ink transition-colors"
          >
            <ArrowLeft size={12} strokeWidth={1.75} />
            Dashboard
          </Link>
          <p className="eyebrow text-bloom-inkSoft">Wellness Check-in</p>
          <span className="text-xs text-bloom-inkSoft w-20 text-right">
            {index + 1} / {questions.length}
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-bloom-line/70 shadow-[0_18px_50px_-30px_rgba(42,47,45,0.18)] p-8 md:p-10 space-y-8">
          <ProgressBar current={index + 1} total={questions.length} />

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400" key={index}>
            <h2 className="font-display text-2xl text-bloom-ink leading-snug tracking-tight mb-8">
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
                    className={`w-full p-4 text-left rounded-xl text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed border ${
                      isSelected
                        ? "border-bloom-terracotta bg-bloom-terracotta/8 text-bloom-terracotta"
                        : "border-bloom-line bg-white/60 text-bloom-ink hover:border-bloom-terracotta/40 hover:bg-bloom-terracotta/4"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                          isSelected
                            ? "border-bloom-terracotta text-bloom-terracotta"
                            : "border-bloom-line/60 text-bloom-inkSoft"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Finish button — only on last question after selection */}
            {isLastQuestion && readyToFinish && (
              <button
                onClick={handleFinish}
                className="mt-6 w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2 bg-bloom-forest text-bloom-cream hover:bg-bloom-forestSoft transition-colors active:scale-[0.99]"
              >
                See your result
                <ArrowRight size={15} strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6 text-bloom-inkSoft/50">
          Your responses are private and only used to personalise your experience.
        </p>
      </div>
    </div>
  )
}
