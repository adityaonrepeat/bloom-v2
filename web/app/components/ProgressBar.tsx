export default function ProgressBar({ current, total }: { current: number, total: number }) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium mb-2">
        <span style={{ color: "#5D6862" }}>Question {current} of {total}</span>
        <span style={{ color: "#C67156" }}>{Math.round(percentage)}%</span>
      </div>
      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: "rgba(40,49,44,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%`, background: "#C67156" }}
        />
      </div>
    </div>
  )
}
