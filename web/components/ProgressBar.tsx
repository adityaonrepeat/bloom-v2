type ProgressBarProps = {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full space-y-2">

      <div className="flex justify-between text-sm text-gray-600">
        <span>Question {current}</span>
        <span>{total}</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">

        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>
  )
}