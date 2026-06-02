"use client";

import React, { useState } from "react";
import { Send, Plus, Sparkles, ShieldCheck, Moon, Heart } from "lucide-react";
import { LucideProps } from "lucide-react";
import {
    WorkspaceShell,
    WorkspaceHeader,
    Card,
    DarkCard,
    PillButton,
    Eyebrow,
} from "../Workspace";

interface Session {
    id: number;
    title: string;
    date: string;
    preview: string;
}

interface Message {
    from: "ai" | "me";
    t: string;
    text: string;
}

interface Trait {
    icon: React.ComponentType<LucideProps>;
    label: string;
}

interface DotProps {
    delay: string;
}

const SESSIONS: Session[] = [
    { id: 0, title: "Performing at work", date: "Tonight", preview: "I caught myself again…" },
    { id: 1, title: "About my mother",    date: "Sunday",  preview: "She called and I…" },
    { id: 2, title: "The slow afternoon", date: "Apr 12",  preview: "Nothing big, just…" },
    { id: 3, title: "Sleep is uneven",    date: "Apr 09",  preview: "Three nights in a row…" },
];

const MESSAGES: Message[] = [
    { from: "ai", t: "9:38pm", text: "You wrote that Wednesday felt heavy. Want to unpack what made it so?" },
    { from: "me", t: "9:39pm", text: "I don't even know where it started. I just felt kind of… performing." },
    { from: "ai", t: "9:39pm", text: "Performing is exhausting because it asks you to abandon yourself. What would resting feel like tonight?" },
    { from: "me", t: "9:40pm", text: "Probably not scrolling my phone. Maybe sitting by the window." },
    { from: "ai", t: "9:41pm", text: "That sounds gentle. Notice if the window helps your shoulders drop. I'll be here when you're back." },
];

const TRAITS: Trait[] = [
    { icon: Sparkles,    label: "Trauma-informed" },
    { icon: ShieldCheck, label: "Zero data training" },
    { icon: Moon,        label: "24/7, never tired" },
    { icon: Heart,       label: "Freedom gently" },
];

function Dot({ delay }: DotProps) {
    return (
        <span
            className="w-1.5 h-1.5 rounded-full bg-bloom-cream/60"
            style={{ animation: `pulse-soft 1.2s ease-in-out infinite ${delay}` }}
        />
    );
}

export default function AasthaView() {
    const [active, setActive] = useState(0);

    return (
        <WorkspaceShell>
            <WorkspaceHeader
                eyebrow="Aastha · AI therapist"
                title="Not advice."
                titleAccent="Attention."
                sub="Trained on decades of clinical conversation. She won't rush you to solutions."
                right={
                    <PillButton testId="new-session" icon={Plus}>
                        New session
                    </PillButton>
                }
            />

            <div className="grid grid-cols-12 gap-5">
                {/* Sessions sidebar */}
                <Card testId="sessions-list" className="col-span-12 lg:col-span-3 p-4">
                    <Eyebrow className="px-2 mb-3">Sessions</Eyebrow>
                    <div className="space-y-1">
                        {SESSIONS.map((s) => (
                            <button
                                key={s.id}
                                data-testid={`session-${s.id}`}
                                onClick={() => setActive(s.id)}
                                className={`w-full text-left px-3 py-3 rounded-2xl transition-all ${
                                    active === s.id ? "bg-bloom-peach/70" : "hover:bg-bloom-cream"
                                }`}
                            >
                                <p className="text-sm text-bloom-ink font-medium leading-snug">{s.title}</p>
                                <p className="text-xs text-bloom-inkSoft italic mt-0.5 line-clamp-1">{s.preview}</p>
                                <p className="eyebrow text-bloom-inkSoft/70 mt-1.5">{s.date}</p>
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-bloom-line/70 px-2">
                        <Eyebrow className="mb-3">Aastha is</Eyebrow>
                        <div className="space-y-2">
                            {TRAITS.map((t) => (
                                <div key={t.label} className="flex items-center gap-2 text-xs text-bloom-inkSoft">
                                    <t.icon size={12} strokeWidth={1.5} className="text-bloom-terracotta" />
                                    {t.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Chat */}
                <DarkCard testId="aastha-chat" className="col-span-12 lg:col-span-9 flex flex-col">
                    <div className="px-6 py-4 border-b border-bloom-forestBorder flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-bloom-terracotta/90 flex items-center justify-center font-display text-xl text-bloom-cream">
                                A
                            </div>
                            <div>
                                <p className="font-display text-lg leading-none">Aastha</p>
                                <p className="text-[11px] text-bloom-cream/50 mt-1 inline-flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                                    here when you are · session {active + 1}
                                </p>
                            </div>
                        </div>
                        <Eyebrow className="text-bloom-cream/40">Private · encrypted</Eyebrow>
                    </div>

                    <div className="px-6 py-6 space-y-4 min-h-[420px] max-h-[520px] overflow-y-auto">
                        {MESSAGES.map((m, i) => (
                            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                                <div className="max-w-[72%]">
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                            m.from === "me"
                                                ? "bg-bloom-terracotta text-bloom-cream rounded-tr-sm"
                                                : "bg-bloom-cream/10 text-bloom-cream/95 rounded-tl-sm border border-bloom-forestBorder/60"
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                    <p className={`text-[10px] text-bloom-cream/35 mt-1.5 ${m.from === "me" ? "text-right" : ""}`}>
                                        {m.t}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-start">
                            <div className="bg-bloom-cream/10 border border-bloom-forestBorder/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                <Dot delay="0ms" />
                                <Dot delay="150ms" />
                                <Dot delay="300ms" />
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-4 border-t border-bloom-forestBorder flex items-center gap-3">
                        <input
                            data-testid="aastha-input"
                            type="text"
                            placeholder="Tell Aastha what's on your chest…"
                            className="flex-1 bg-bloom-forestSoft/60 border border-bloom-forestBorder rounded-full px-5 py-3 text-sm placeholder:text-bloom-cream/40 text-bloom-cream outline-none focus:border-bloom-terracotta/60 transition-colors"
                        />
                        <button
                            data-testid="aastha-send"
                            className="w-11 h-11 rounded-full bg-bloom-terracotta flex items-center justify-center hover:bg-bloom-terracottaHover transition-colors"
                        >
                            <Send size={16} strokeWidth={1.75} className="text-bloom-cream" />
                        </button>
                    </div>
                </DarkCard>
            </div>
        </WorkspaceShell>
    );
}
