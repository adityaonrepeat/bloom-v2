"use client";

import React from "react";
import Link from "next/link";
import { Users, ArrowRight, ShieldCheck, Shuffle } from "lucide-react";
import { WorkspaceShell, WorkspaceHeader, Card, DarkCard, PillButton, Eyebrow } from "../Workspace";

const FEATURES = [
    { icon: ShieldCheck, label: "Anonymous by default", sub: "No names. No photos unless you choose." },
    { icon: Shuffle,     label: "Emotion-matched",      sub: "Paired with someone feeling the same shade." },
    { icon: Users,       label: "Real humans only",     sub: "No bots. Just two people, being honest." },
];

export default function TalkView() {
    return (
        <WorkspaceShell>
            <WorkspaceHeader
                eyebrow="Talk · human connection"
                title="Someone who"
                titleAccent="gets it."
                sub="Matched with a real person feeling the same way tonight. No performance required."
            />

            <div className="grid grid-cols-12 gap-5">
                <DarkCard testId="talk-cta" className="col-span-12 lg:col-span-7 p-10 flex flex-col justify-between min-h-[320px]">
                    <div>
                        <Eyebrow className="text-bloom-cream/50 mb-4">Ready when you are</Eyebrow>
                        <p className="font-display text-3xl md:text-4xl leading-snug">
                            Take the quiz first so we can match you with someone feeling the same shade of blue.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <Link href="/quiz">
                            <PillButton testId="go-quiz" variant="terracotta" icon={ArrowRight}>
                                Take the quiz
                            </PillButton>
                        </Link>
                        <Link href="/talk">
                            <PillButton testId="go-talk" variant="ghost">
                                Skip — connect now
                            </PillButton>
                        </Link>
                    </div>
                </DarkCard>

                <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                    {FEATURES.map((f) => (
                        <Card key={f.label} className="p-6 flex items-start gap-4">
                            <div className="w-9 h-9 rounded-full bg-bloom-peach flex items-center justify-center shrink-0">
                                <f.icon size={16} strokeWidth={1.5} className="text-bloom-terracotta" />
                            </div>
                            <div>
                                <p className="font-display text-lg text-bloom-ink leading-tight">{f.label}</p>
                                <p className="text-sm text-bloom-inkSoft mt-1">{f.sub}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </WorkspaceShell>
    );
}
