import { Question } from "../data/questions"

type QuestionCardProps = {
  question: Question
  onAnswer: (value: number) => void
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <div className="space-y-6">

      <h2 className="text-lg font-semibold text-gray-800">
        {question.text}
      </h2>

      <div className="space-y-3">

        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.score)}
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-400 transition"
          >
            {option.label}
          </button>
        ))}

      </div>

    </div>
  )
}