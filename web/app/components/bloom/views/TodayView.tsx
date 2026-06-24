"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Wind, ArrowRight, Sparkles, Heart } from "lucide-react";
import {
    WorkspaceShell,
    WorkspaceHeader,
    Card,
    DarkCard,
    PillButton,
    Eyebrow,
} from "../Workspace";

type EmotionTag = "happy" | "calm" | "stressed" | "anxious";

interface Mood {
    value: number;
    label: string;
    score: number;
    tag: EmotionTag;
}

interface TodayViewProps {
    emotionalScore?: number | null;
    emotionalTag?: EmotionTag | null;
    streak?: number;
    last7Days?: boolean[];
    userName?: string;
}

function getGreeting(): string {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Good morning,";
    if (h >= 12 && h < 17) return "Good afternoon,";
    if (h >= 17 && h < 22) return "Good evening,";
    return "Still up,";
}

const MOODS: Mood[] = [
    { value: 1, label: "Heavy",    score: 10, tag: "anxious" },
    { value: 2, label: "Low",      score: 20, tag: "stressed" },
    { value: 3, label: "Quiet",    score: 30, tag: "stressed" },
    { value: 4, label: "Lifting",  score: 40, tag: "calm" },
    { value: 5, label: "Grounded", score: 50, tag: "happy" },
];

const TAG_LABELS: Record<EmotionTag, string> = {
    happy: "Sunny & open",
    calm: "Steady & grounded",
    stressed: "Under pressure",
    anxious: "On edge",
};

export default function TodayView({ emotionalScore, emotionalTag, streak = 0, last7Days = [], userName }: TodayViewProps) {
    const router = useRouter();
    const firstName = userName?.trim().split(" ")[0] || "there";
    const [mood, setMood] = useState(4);
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [currentScore, setCurrentScore] = useState<number | null>(emotionalScore ?? null);
    const [currentTag, setCurrentTag] = useState<EmotionTag | null>(emotionalTag ?? null);

    const handleSaveCheckIn = async () => {
        const selected = MOODS.find((m) => m.value === mood);
        if (!selected || saving) return;
        setSaving(true);
        try {
            const res = await fetch("/api/mood", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tag: selected.tag, score: selected.score, note: note.trim() || undefined }),
            });
            if (res.ok) {
                localStorage.setItem("emotion-tag", selected.tag);
                setCurrentScore(selected.score);
                setCurrentTag(selected.tag);
                setSaved(true);
                setNote("");
                setTimeout(() => setSaved(false), 3000);
                router.refresh();
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <WorkspaceShell>
            <WorkspaceHeader
                title={getGreeting()}
                titleAccent={`${firstName}.`}
                sub="You haven't written yet. No rush. The page is here when you're ready."
                right={
                    <>
                        <Link href="/journal/new">
                            <PillButton testId="header-new-entry" variant="ghost" icon={Plus}>
                                New entry
                            </PillButton>
                        </Link>
                        <PillButton testId="header-reset" icon={Wind}>
                            60-sec reset
                        </PillButton>
                    </>
                }
            />

            <div className="grid grid-cols-12 gap-5">
                {/* Check-in card */}
                <Card testId="checkin-card" className="col-span-12 lg:col-span-8 p-7">
                    <div className="flex items-start justify-between">
                        <div>
                            <Eyebrow className="mb-2">Tonight&apos;s check-in</Eyebrow>
                            <p className="font-display text-3xl text-bloom-ink leading-tight">
                                How heavy is{" "}
                                <span className="italic text-bloom-terracotta">right now?</span>
                            </p>
                        </div>
                        <span className="text-xs text-bloom-inkSoft">takes 30 seconds</span>
                    </div>

                    <div className="mt-8 grid grid-cols-5 gap-1.5 sm:gap-2">
                        {MOODS.map((m) => (
                            <button
                                key={m.value}
                                data-testid={`mood-${m.value}`}
                                onClick={() => setMood(m.value)}
                                className={`group relative py-3 sm:py-5 rounded-2xl border transition-all ${
                                    mood === m.value
                                        ? "bg-bloom-terracotta/10 border-bloom-terracotta"
                                        : "bg-bloom-cream border-bloom-line hover:border-bloom-terracotta/50"
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all"
                                        style={{
                                            background: `linear-gradient(135deg, #D96A4E ${m.value * 18}%, #E5DCD3 ${m.value * 18}%)`,
                                            opacity: mood === m.value ? 1 : 0.55,
                                        }}
                                    />
                                    <span className={`text-xs ${mood === m.value ? "text-bloom-ink font-medium" : "text-bloom-inkSoft"}`}>
                                        {m.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-7 pt-6 border-t border-bloom-line/70">
                        <Eyebrow className="mb-2">A line for tonight</Eyebrow>
                        <textarea
                            data-testid="quick-note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="One sentence. Whatever&apos;s true."
                            className="w-full bg-transparent text-bloom-ink font-display text-xl placeholder:text-bloom-inkSoft/50 placeholder:italic outline-none resize-none leading-snug"
                            rows={2}
                        />
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-bloom-inkSoft">
                                {saved ? "✓ Check-in saved." : "Your check-ins are private."}
                            </span>
                            <PillButton
                                testId="save-checkin"
                                variant="primary"
                                onClick={handleSaveCheckIn}
                            >
                                {saving ? "Saving…" : saved ? "Saved ✓" : "Save check-in"}
                            </PillButton>
                        </div>
                    </div>
                </Card>

                {/* Score & streak */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
                    <DarkCard testId="score-card" className="p-7">
                        <Eyebrow className="text-bloom-cream/50 mb-3">Emotional Score</Eyebrow>
                        <div className="flex items-baseline gap-3">
                            <span className="font-display text-7xl leading-none">
                                {currentScore ?? "—"}
                            </span>
                            <span className="font-display text-xl italic text-bloom-cream/40">/50</span>
                        </div>
                        <p className="font-display italic text-xl text-bloom-terracotta mt-2">
                            {currentTag ? TAG_LABELS[currentTag] : "Log your first check-in"}
                        </p>
                        <div className="mt-5 h-1 rounded-full bg-bloom-forestBorder overflow-hidden">
                            <div
                                className="h-full bg-bloom-terracotta transition-all duration-500"
                                style={{ width: currentScore ? `${(currentScore / 50) * 100}%` : "0%" }}
                            />
                        </div>
                        <p className="text-xs text-bloom-cream/45 mt-3">
                            {currentTag
                                ? `Matching with people who feel ${currentTag}.`
                                : "Complete a check-in to start matching."}
                        </p>
                    </DarkCard>

                    <Card testId="streak-card" className="p-6">
                        <Eyebrow className="mb-3">Quiet streak</Eyebrow>
                        <div className="flex items-baseline gap-2.5">
                            <p className={`font-display text-5xl leading-none ${streak > 0 ? "text-bloom-ink" : "text-bloom-inkSoft"}`}>
                                {streak > 0 ? streak : "—"}
                            </p>
                            {streak > 0 && (
                                <p className="text-sm text-bloom-inkSoft">
                                    {streak === 1 ? "evening" : "evenings"} in a row
                                </p>
                            )}
                        </div>
                        <p className="mt-2 text-xs text-bloom-inkSoft">
                            {streak > 0
                                ? "keep it going."
                                : "Check in each evening to build your streak."}
                        </p>
                        <div className="mt-4 grid grid-cols-7 gap-1.5">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-6 rounded ${
                                        last7Days[i]
                                            ? "bg-bloom-terracotta/80"
                                            : i === 6
                                              ? "bg-bloom-terracotta/20"
                                              : "bg-bloom-peach"
                                    }`}
                                />
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Invitation card */}
                <Card
                    testId="invitation-card"
                    className="col-span-12 lg:col-span-7 p-7 bg-bloom-peach/60 border-bloom-peachDeep/50"
                >
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <Eyebrow className="mb-3 inline-flex items-center gap-2">
                                <Sparkles size={11} strokeWidth={1.5} />
                                Tonight&apos;s invitation
                            </Eyebrow>
                            <p className="font-display text-2xl md:text-3xl text-bloom-ink leading-snug">
                                Write three lines about{" "}
                                <span className="italic text-bloom-terracotta">a small kindness</span>{" "}
                                you noticed today.
                            </p>
                            <p className="mt-3 text-sm text-bloom-inkSoft max-w-md">
                                Even if it was just the light coming in sideways. Especially then.
                            </p>
                        </div>
                        <Link
                            href="/journal/new"
                            data-testid="invitation-accept"
                            className="shrink-0 w-12 h-12 rounded-full bg-bloom-forest text-bloom-cream flex items-center justify-center hover:bg-bloom-forestSoft transition-colors"
                            aria-label="Accept"
                        >
                            <ArrowRight size={16} strokeWidth={1.75} />
                        </Link>
                    </div>
                </Card>

                {/* Aastha preview */}
                <Card testId="aastha-preview" className="col-span-12 lg:col-span-5 p-7 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full bg-bloom-terracotta/90 flex items-center justify-center font-display text-lg text-bloom-cream">
                                A
                            </div>
                            <div>
                                <p className="font-display text-lg leading-none text-bloom-ink">Aastha</p>
                                <p className="text-[11px] text-bloom-inkSoft mt-1 inline-flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                                    here when you are
                                </p>
                            </div>
                        </div>
                        <p className="font-display italic text-bloom-ink text-lg leading-snug">
                            &ldquo;You don&apos;t have to name it tonight. Let&apos;s sit with it for a minute.&rdquo;
                        </p>
                    </div>
                    <Link
                        href="/aastha"
                        data-testid="open-aastha"
                        className="mt-6 inline-flex items-center justify-between w-full text-sm text-bloom-ink hover:text-bloom-terracotta transition-colors"
                    >
                        <span className="inline-flex items-center gap-2">
                            <Heart size={13} strokeWidth={1.5} />
                            Open session
                        </span>
                        <ArrowRight size={14} strokeWidth={1.5} />
                    </Link>
                </Card>
            </div>
        </WorkspaceShell>
    );
}
