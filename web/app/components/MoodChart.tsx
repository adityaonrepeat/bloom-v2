"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
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

  // Trend chart data with "day" labels
  const trendData = data.map((d, i) => ({
    day: `Day ${i + 1}`,
    score: d.emotionScore,
    tag: d.emotionTag
  }))

  // Distribution data for pie chart
  const distribution = data.reduce((acc, d) => {
    acc[d.emotionTag] = (acc[d.emotionTag] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(distribution).map(([tag, count]) => ({
    name: tag,
    value: count,
    color: EMOTION_COLORS[tag] || "#94a3b8"
  }))

  return (
    <div className="space-y-6">

      {/* Mood Trend */}
      <div className="bg-emerald-900 p-6 rounded-xl text-white">
        <h3 className="text-sm font-medium mb-4 text-emerald-200">
          Mood Trend
        </h3>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              stroke="#ffffff50"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#ffffff50"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 50]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#fff"
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#fff"
              strokeWidth={2}
              fill="url(#moodGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mood Distribution */}
      {pieData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium mb-4 text-gray-600">
            Mood Distribution
          </h3>

          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={4}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col gap-2">
              {pieData.map(entry => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="capitalize text-gray-700">
                    {entry.name}
                  </span>
                  <span className="text-gray-400">
                    ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}