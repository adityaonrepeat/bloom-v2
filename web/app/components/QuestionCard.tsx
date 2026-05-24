import { Question } from "@/data/questions"

interface Props {
  question: Question
  onAnswer: (score: number) => void
}

export default function QuestionCard({ question, onAnswer }: Props) {
  return (
    <div className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-2xl font-bold text-stone-800 mb-8 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => onAnswer(option.score)}
            className="w-full p-4 text-left border-2 border-stone-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all font-medium text-stone-700 hover:text-emerald-800 group"
          >
            <span className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full border-2 border-stone-200 group-hover:border-emerald-500 flex items-center justify-center text-xs font-bold shrink-0 text-stone-400 group-hover:text-emerald-700 transition-all">
                {String.fromCharCode(65 + i)}
              </span>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
