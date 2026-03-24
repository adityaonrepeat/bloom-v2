import { useState } from "react"
import { questions } from "../data/questions"
import QuestionCard from "./QuestionCard"
import ProgressBar from "./ProgressBar"
import { useRouter } from "next/navigation";

export default function Quiz() {
  const router = useRouter();

  const [index, setIndex] = useState<number>(0)
  const [score, setScore] = useState<number>(0)

  function handleAnswer(value: number) {
    const newScore = score + value
    setScore(newScore)

    if (index + 1 < questions.length) {
      setIndex(index + 1)
    } else {
      localStorage.setItem("emotion-score", newScore.toString())
      router.push("/result")
    }
  }

  return (
    <div className="h-screen flex items-baseline py-5 justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <ProgressBar current={index + 1} total={questions.length} />

        <QuestionCard
          question={questions[index]}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  )
}