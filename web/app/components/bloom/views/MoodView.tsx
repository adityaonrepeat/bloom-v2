"use client";

import { useState, useEffect } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import {
    WorkspaceShell,
    WorkspaceHeader,
    Card,
    DarkCard,
    Eyebrow,
} from "../Workspace";

interface MoodLogEntry {
    id: string;
    emotionScore: number;
    emotionTag: string;
    note: string | null;
    createdAt: string;
}

interface MoodViewProps {
    logs: MoodLogEntry[];
}

type Range = "7d" | "30d" | "90d";

interface SeriesPoint {
    day: string;
    mood: number;
    label: string;
    hasData: boolean;
}

interface RecentEntry {
    date: string;
    time: string;
    score: number;
    label: string;
    note: string | null;
}

interface TooltipPayload {
    payload: SeriesPoint;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
}

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildSeries(logs: MoodLogEntry[], range: Range): SeriesPoint[] {
    if (range === "7d") {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dayLogs = logs.filter((l) => isSameDay(new Date(l.createdAt), date));
            const avg = dayLogs.length
                ? Math.round(dayLogs.reduce((s, l) => s + l.emotionScore, 0) / dayLogs.length)
                : 0;
            return {
                day: DAY_LABELS[date.getDay()],
                mood: avg,
                label: dayLogs[0]?.emotionTag ?? "—",
                hasData: dayLogs.length > 0,
            };
        });
    }
    if (range === "30d") {
        return Array.from({ length: 30 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const dayLogs = logs.filter((l) => isSameDay(new Date(l.createdAt), date));
            const avg = dayLogs.length
                ? Math.round(dayLogs.reduce((s, l) => s + l.emotionScore, 0) / dayLogs.length)
                : 0;
            return {
                day: `${date.getDate()}`,
                mood: avg,
                label: dayLogs[0]?.emotionTag ?? "—",
                hasData: dayLogs.length > 0,
            };
        });
    }
    return Array.from({ length: 12 }).map((_, i) => {
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - i * 7);
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() - 6);
        const weekLogs = logs.filter((l) => {
            const d = new Date(l.createdAt);
            return d >= weekStart && d <= weekEnd;
        });
        const avg = weekLogs.length
            ? Math.round(weekLogs.reduce((s, l) => s + l.emotionScore, 0) / weekLogs.length)
            : 0;
        return {
            day: `W${12 - i}`,
            mood: avg,
            label: weekLogs[0]?.emotionTag ?? "—",
            hasData: weekLogs.length > 0,
        };
    }).reverse();
}

function getTodayScore(logs: MoodLogEntry[]): number | null {
    const today = new Date();
    const todayLogs = logs.filter((l) => isSameDay(new Date(l.createdAt), today));
    if (!todayLogs.length) return null;
    return todayLogs[todayLogs.length - 1].emotionScore;
}

function get5DayAvg(logs: MoodLogEntry[]): number | null {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 5);
    const recent = logs.filter((l) => new Date(l.createdAt) >= cutoff);
    if (!recent.length) return null;
    return Math.round(recent.reduce((s, l) => s + l.emotionScore, 0) / recent.length);
}

function getStreak(logs: MoodLogEntry[]): number {
    let streak = 0;
    const check = new Date();
    while (true) {
        const hasThat = logs.some((l) => isSameDay(new Date(l.createdAt), check));
        if (!hasThat) break;
        streak++;
        check.setDate(check.getDate() - 1);
    }
    return streak;
}

function getLowestThisWeek(logs: MoodLogEntry[]): { day: string; score: number; label: string } | null {
    const series = buildSeries(logs, "7d").filter((p) => p.hasData);
    if (!series.length) return null;
    const lowest = series.reduce((min, p) => (p.mood < min.mood ? p : min));
    return { day: lowest.day, score: lowest.mood, label: lowest.label };
}

function getRecentEntries(logs: MoodLogEntry[]): RecentEntry[] {
    return logs.slice(0, 5).map((l) => {
        const d = new Date(l.createdAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        let dateLabel = d.toLocaleDateString("en-US", { weekday: "short" });
        if (isSameDay(d, today)) dateLabel = "Tonight";
        else if (isSameDay(d, yesterday)) dateLabel = "Yesterday";
        return {
            date: dateLabel,
            time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            score: l.emotionScore,
            label: l.emotionTag,
            note: l.note,
        };
    });
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload?.length || !payload[0].payload.hasData) return null;
    const p = payload[0].payload;
    return (
        <div className="bg-white border border-bloom-line rounded-xl px-3 py-2 shadow-sm">
            <p className="eyebrow text-bloom-inkSoft">{p.day}</p>
            <p className="font-display text-2xl text-bloom-ink leading-none mt-1">{p.mood}</p>
            <p className="text-xs italic text-bloom-terracotta mt-1">{p.label}</p>
        </div>
    );
}

const RANGES: Range[] = ["7d", "30d", "90d"];

export default function MoodView({ logs }: MoodViewProps) {
    const [range, setRange] = useState<Range>("7d");
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const data = buildSeries(logs, range);
    const todayScore = getTodayScore(logs);
    const avgScore = get5DayAvg(logs);
    const streak = getStreak(logs);
    const lowest = getLowestThisWeek(logs);
    const recentEntries = getRecentEntries(logs);

    return (
        <WorkspaceShell>
            <WorkspaceHeader
                eyebrow="Mood · the weather of you"
                title="One honest"
                titleAccent="line."
                sub="A single tap each night. Over time a quiet shape emerges. Not to fix you, just to show what's been true."
                right={
                    <div className="inline-flex bg-white border border-bloom-line rounded-full p-1">
                        {RANGES.map((r) => (
                            <button
                                key={r}
                                data-testid={`range-${r}`}
                                onClick={() => setRange(r)}
                                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                                    range === r
                                        ? "bg-bloom-forest text-bloom-cream"
                                        : "text-bloom-inkSoft hover:text-bloom-ink"
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                }
            />

            <div className="grid grid-cols-12 gap-5 mb-5">
                <Card testId="kpi-today" className="col-span-6 md:col-span-3 p-6">
                    <Eyebrow className="mb-2">Tonight</Eyebrow>
                    <p className="font-display text-4xl text-bloom-ink leading-none">
                        {todayScore ?? "—"}
                    </p>
                    {todayScore !== null && (
                        <p className="text-xs text-bloom-terracotta mt-2 inline-flex items-center gap-1">
                            <TrendingUp size={12} strokeWidth={1.5} />
                            /50
                        </p>
                    )}
                </Card>
                <Card testId="kpi-avg" className="col-span-6 md:col-span-3 p-6">
                    <Eyebrow className="mb-2">5-day avg</Eyebrow>
                    <p className="font-display text-4xl text-bloom-ink leading-none">
                        {avgScore ?? "—"}
                    </p>
                    {avgScore !== null && (
                        <p className="text-xs text-bloom-inkSoft mt-2">out of 50</p>
                    )}
                </Card>
                <Card testId="kpi-streak" className="col-span-6 md:col-span-3 p-6">
                    <Eyebrow className="mb-2">Quiet streak</Eyebrow>
                    <p className="font-display text-4xl text-bloom-ink leading-none">
                        {streak} <span className="text-xl text-bloom-inkSoft italic">nights</span>
                    </p>
                </Card>
                <Card testId="kpi-low" className="col-span-6 md:col-span-3 p-6">
                    <Eyebrow className="mb-2">Lowest this week</Eyebrow>
                    {lowest ? (
                        <>
                            <p className="font-display text-4xl text-bloom-ink leading-none">{lowest.day}</p>
                            <p className="text-xs italic text-bloom-terracotta mt-2">
                                {lowest.score} · {lowest.label}
                            </p>
                        </>
                    ) : (
                        <p className="font-display text-4xl text-bloom-ink leading-none">—</p>
                    )}
                </Card>
            </div>

            <Card testId="mood-chart-card" className="p-7 mb-5">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <Eyebrow>Mood over time</Eyebrow>
                        <p className="font-display text-2xl text-bloom-ink mt-1">Past {range}</p>
                    </div>
                </div>
                <div className="h-72 -mx-2">
                    {mounted && (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#D96A4E" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#D96A4E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke="#E5DCD3" vertical={false} opacity={0.7} />
                                <XAxis
                                    dataKey="day"
                                    stroke="#5C6B64"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontFamily: "DM Sans", letterSpacing: "0.12em" }}
                                    tickFormatter={(v: string) => v.toUpperCase()}
                                    interval={range === "30d" ? 4 : 0}
                                />
                                <YAxis
                                    stroke="#5C6B64"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontFamily: "DM Sans" }}
                                    domain={[0, 50]}
                                    ticks={[0, 25, 50]}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ stroke: "#D96A4E", strokeDasharray: "3 3", strokeOpacity: 0.5 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="#D96A4E"
                                    strokeWidth={2.2}
                                    fill="url(#mg)"
                                    dot={{ r: 3, fill: "#fff", stroke: "#D96A4E", strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: "#D96A4E", stroke: "#fff", strokeWidth: 2 }}
                                    connectNulls={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            <DarkCard testId="quiz-cta" className="p-8 mb-5 relative overflow-hidden">
                {/* decorative concentric rings */}
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-bloom-cream/10 pointer-events-none" />
                <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full border border-bloom-cream/10 pointer-events-none" />

                <div className="relative flex items-center justify-between gap-8">
                    <div className="max-w-md">
                        <Eyebrow className="text-bloom-cream/50 mb-3 inline-flex items-center gap-2">
                            <Sparkles size={11} strokeWidth={1.5} />
                            Wellness check-in
                        </Eyebrow>
                        <p className="font-display text-3xl text-bloom-cream leading-snug">
                            Know yourself{" "}
                            <span className="italic text-bloom-terracotta">a little better.</span>
                        </p>
                        <p className="mt-3 text-sm text-bloom-cream/60 max-w-sm">
                            Ten quiet questions. Updates your emotional score and helps us match you with the right people.
                        </p>
                        <Link
                            href="/quiz"
                            data-testid="quiz-cta-link"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-bloom-terracotta text-bloom-cream pl-5 pr-4 py-2.5 text-sm hover:bg-bloom-terracottaHover transition-colors"
                        >
                            Take the check-in
                            <ArrowRight size={15} strokeWidth={1.75} />
                        </Link>
                    </div>

                    <div className="hidden md:flex shrink-0 flex-col items-center justify-center w-28 h-28 rounded-full bg-bloom-cream/6 border border-bloom-cream/10">
                        <span className="font-display text-5xl text-bloom-cream leading-none">10</span>
                        <span className="text-[10px] tracking-[0.18em] uppercase text-bloom-cream/45 mt-1.5">
                            questions
                        </span>
                    </div>
                </div>
            </DarkCard>

            <Card testId="recent-entries" className="p-7">
                <div className="flex items-center justify-between mb-5">
                    <Eyebrow>Recent check-ins</Eyebrow>
                </div>
                {recentEntries.length === 0 ? (
                    <p className="text-sm text-bloom-inkSoft italic py-4">
                        No check-ins yet. Log your first mood on the Today page.
                    </p>
                ) : (
                    <div>
                        {recentEntries.map((e, i) => (
                            <div
                                key={i}
                                data-testid={`entry-${i}`}
                                className="grid grid-cols-12 gap-4 py-4 border-t border-bloom-line/70 items-center first:border-t-0"
                            >
                                <div className="col-span-3">
                                    <p className="text-sm text-bloom-ink font-medium">{e.date}</p>
                                    <p className="text-xs text-bloom-inkSoft">{e.time}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="font-display text-2xl text-bloom-ink">{e.score}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs italic text-bloom-terracotta">{e.label}</span>
                                </div>
                                <div className="col-span-5">
                                    {e.note && (
                                        <p className="text-sm text-bloom-inkSoft italic truncate">{e.note}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </WorkspaceShell>
    );
}
