"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MoodDataPoint {
  day: string;
  mood: number;
  label: string;
}

const data: MoodDataPoint[] = [
  { day: "Mon", mood: 4.2, label: "Flat" },
  { day: "Tue", mood: 5.4, label: "Okay" },
  { day: "Wed", mood: 3.1, label: "Low" },
  { day: "Thu", mood: 6.8, label: "Lifting" },
  { day: "Fri", mood: 7.6, label: "Grounded" },
];

export default function BloomMoodSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="mood" className="relative py-24 md:py-32 bg-[#F0EBE1]/60">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="col-span-12 lg:col-span-5"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#5D6862]">
            <span className="divider-dot" />
            Mood Tracking
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.05] tracking-tight mt-4 text-[#28312C]">
            Five days.{" "}
            <span className="italic text-[#C67156]">One honest line.</span>
          </h2>
          <p className="text-lg text-[#5D6862] mt-6 leading-relaxed">
            A single tap each night. Over five days a quiet shape emerges. The weather of you. Not to fix you, just to show you what&rsquo;s been true.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: "5-day avg", value: "5.4" },
              { label: "Lowest", value: "Wed" },
              { label: "Trend", value: "↗︎ up", colored: true },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/80 backdrop-blur px-4 py-5 border border-black/5"
              >
                <div className="text-xs uppercase tracking-widest text-[#5D6862]">{stat.label}</div>
                <div
                  className="font-display text-3xl mt-1"
                  style={stat.colored ? { color: "#7C9885" } : undefined}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="col-span-12 lg:col-span-7"
        >
          <div className="relative rounded-[2rem] p-6 md:p-10 bg-[#F9F8F6] border border-black/5 shadow-[0_40px_80px_-50px_rgba(40,49,44,0.4)]">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#5D6862]">Mood, past 5 days</div>
                <div className="font-display text-2xl md:text-3xl mt-1 text-[#28312C]">
                  A slow return to ground.
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-4xl md:text-5xl text-[#28312C]">7.6</div>
                <div className="text-xs text-[#7C9885]">best in 5 days</div>
              </div>
            </div>

            <div className="h-[280px] md:h-[340px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 20, right: 10, bottom: 0, left: -25 }}>
                    <defs>
                      <linearGradient id="bloomMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C67156" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#C67156" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#5D6862", fontSize: 12, fontFamily: "var(--font-figtree)" }}
                      dy={8}
                    />
                    <YAxis domain={[0, 10]} hide />
                    <Tooltip
                      cursor={{ stroke: "#C67156", strokeDasharray: "3 3", opacity: 0.4 } as React.SVGProps<SVGLineElement>}
                      contentStyle={{
                        background: "#28312C",
                        border: "none",
                        borderRadius: 12,
                        color: "#F9F8F6",
                        fontFamily: "var(--font-figtree)",
                        fontSize: 12,
                        padding: "8px 12px",
                      }}
                      labelStyle={{ color: "#A6B3A8", marginBottom: 4 }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any, _name: any, item: any) => [
                        `${value} · ${item.payload.label}`,
                        "Mood",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#C67156"
                      strokeWidth={2.5}
                      fill="url(#bloomMood)"
                      dot={{ r: 4, stroke: "#C67156", strokeWidth: 2, fill: "#F9F8F6" }}
                      activeDot={{ r: 6, stroke: "#C67156", strokeWidth: 2, fill: "#F9F8F6" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#5D6862]">
              <span>Flat · Low · Okay · Lifting · Grounded</span>
              <span className="italic font-display">bloom.journal · v.24</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
