"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

const EMOTION_COLORS: Record<string, string> = {
  happy: "#22c55e",
  calm: "#3b82f6",
  stressed: "#f59e0b",
  anxious: "#ef4444"
}

type MoodEntry = {
  emotionScore: number
  emotionTag: string
  createdAt: Date
}

export default function MoodChart({ data }: { data: MoodEntry[] }) {

  // Generate an array of the last 7 days up to today
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  // Trend chart data mapped over the last 7 days
  const trendData = last7Days.map((date, index) => {
    const match = data.find(d => {
      const entryDate = new Date(d.createdAt)
      return entryDate.getDate() === date.getDate() &&
             entryDate.getMonth() === date.getMonth() &&
             entryDate.getFullYear() === date.getFullYear()
    })

    const daysAgo = 6 - index
    let label = `${daysAgo} days ago`
    if (daysAgo === 0) label = "Today"
    if (daysAgo === 1) label = "Yesterday"

    return {
      name: label,
      score: match ? match.emotionScore : null,
      tag: match ? match.emotionTag : undefined,
    }
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload
      if (!point.tag) return null
      
      return (
        <div className="bg-[#1f2937] text-white border-none rounded-lg text-xs p-2 shadow-xl">
          <p className="font-medium whitespace-nowrap">
            {point.name}: <span className="capitalize opacity-80">{point.tag}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">

      {/* Mood Trend */}
      <div className="bg-emerald-900 p-6 rounded-xl text-white">
        <h3 className="text-sm font-medium mb-4 text-emerald-200">
          Mood Trend
        </h3>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={trendData}>
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[0, 50]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#ffffff10' }}
            />
            <Bar
              dataKey="score"
              radius={[4, 4, 0, 0]}
            >
              {trendData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.tag ? EMOTION_COLORS[entry.tag] || "#34d399" : "#34d399"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}