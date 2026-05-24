"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type MoodEntry = { emotionScore: number; emotionTag: string; createdAt: Date }

export default function MoodChart({ data }: { data: MoodEntry[] }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const trendData = last7Days.map((date, index) => {
    const match = data.find((d) => {
      const e = new Date(d.createdAt)
      return (
        e.getDate() === date.getDate() &&
        e.getMonth() === date.getMonth() &&
        e.getFullYear() === date.getFullYear()
      )
    })
    const dow = date.getDay()
    const dayIdx = dow === 0 ? 6 : dow - 1
    return {
      name: DAY_LABELS[dayIdx],
      score: match ? match.emotionScore : 8 + index * 5,
      tag: match ? match.emotionTag : null,
      hasData: !!match,
    }
  })

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: { payload: (typeof trendData)[0] }[]
  }) => {
    if (active && payload?.length && payload[0].payload.hasData) {
      const p = payload[0].payload
      return (
        <div
          className="text-xs px-3 py-2 rounded-xl shadow-xl"
          style={{ background: "#F0EBE1", color: "#28312C", border: "1px solid rgba(40,49,44,0.12)" }}
        >
          <p className="font-medium capitalize">{p.tag}</p>
          <p className="mt-0.5" style={{ color: "#5D6862" }}>Score {p.score}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ background: "#28312C", minHeight: 280 }}
    >
      <div className="px-5 pt-5 pb-0">
        <p
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "15px",
            color: "rgba(240,235,225,0.9)",
            letterSpacing: "-0.01em",
          }}
        >
          Mood Trend
        </p>
        <p style={{ fontSize: "11px", color: "rgba(166,179,168,0.7)", marginTop: "2px" }}>Last 7 days</p>
      </div>

      <div className="flex-1 w-full pt-2 pb-3 pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 8, left: -24, bottom: 4 }}>
            <XAxis
              dataKey="name"
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
              tick={{ fill: "rgba(240,235,225,0.45)", fontSize: 10 }}
              dy={8}
            />
            <YAxis
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
              tick={{ fill: "rgba(240,235,225,0.45)", fontSize: 10 }}
              domain={[0, 45]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#C67156"
              strokeWidth={2}
              dot={{ r: 3, fill: "#C67156", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#E3A863", stroke: "#28312C", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
