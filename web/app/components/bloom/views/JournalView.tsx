"use client";

import React, { useState } from "react";
import { Plus, Search, KeyRound, Bold, Italic, List } from "lucide-react";
import { LucideProps } from "lucide-react";
import {
    WorkspaceShell,
    WorkspaceHeader,
    Card,
    PillButton,
    Eyebrow,
} from "../Workspace";

interface JournalEntry {
    id: number;
    date: string;
    time: string;
    title: string;
    body: string;
    words: number;
    tag: string;
}

interface ToolBtnProps {
    icon: React.ComponentType<LucideProps>;
    testId: string;
}

const ENTRIES: JournalEntry[] = [
    {
        id: 0,
        date: "Tue",
        time: "11:08 pm",
        title: "Today was heavier than I let on.",
        body: "I'm trying to be kinder about that. I caught myself performing again at work and the second I noticed, the whole afternoon got harder to carry.\n\nMaybe slow is the point. Maybe the point is letting the heaviness be a fact instead of a problem.",
        words: 184,
        tag: "Tender",
    },
    {
        id: 1,
        date: "Mon",
        time: "10:12 pm",
        title: "A small relief at 4pm.",
        body: "The light came in sideways and I noticed it.",
        words: 92,
        tag: "Soft",
    },
    {
        id: 2,
        date: "Sun",
        time: "11:48 pm",
        title: "Nothing dramatic. Just a long quiet.",
        body: "I think I'm allowed to call that rest.",
        words: 211,
        tag: "Rest",
    },
    {
        id: 3,
        date: "Sat",
        time: "10:30 pm",
        title: "Walked to the river without my phone.",
        body: "Two ducks. One heron. I needed the heron.",
        words: 76,
        tag: "Outside",
    },
    {
        id: 4,
        date: "Fri",
        time: "9:05 pm",
        title: "Trying not to apologise for being tired.",
        body: "It's a small revolution.",
        words: 142,
        tag: "Tender",
    },
];

function ToolBtn({ icon: Icon, testId }: ToolBtnProps) {
    return (
        <button
            data-testid={testId}
            className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-bloom-inkSoft hover:text-bloom-ink transition-colors"
        >
            <Icon size={13} strokeWidth={1.75} />
        </button>
    );
}

export default function JournalView() {
    const [active, setActive] = useState(0);
    const entry = ENTRIES[active];

    return (
        <WorkspaceShell>
            <WorkspaceHeader
                eyebrow="Journal · private by design"
                title="A page that"
                titleAccent="doesn't judge."
                sub="Encrypted locally. Only you hold the key."
                right={
                    <>
                        <PillButton testId="search-entries" variant="ghost" icon={Search}>
                            Search
                        </PillButton>
                        <PillButton testId="new-entry" icon={Plus}>
                            New entry
                        </PillButton>
                    </>
                }
            />

            <div className="grid grid-cols-12 gap-5">
                <Card testId="journal-list" className="col-span-12 lg:col-span-4 p-4">
                    <div className="px-2 py-2 flex items-center justify-between">
                        <Eyebrow>Recent · 5</Eyebrow>
                        <span className="text-xs text-bloom-inkSoft">705 words</span>
                    </div>
                    <div className="mt-2 space-y-1">
                        {ENTRIES.map((e, i) => (
                            <button
                                key={e.id}
                                data-testid={`list-entry-${i}`}
                                onClick={() => setActive(i)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                    active === i
                                        ? "bg-bloom-peach/70 border-bloom-terracotta/40"
                                        : "border-transparent hover:bg-bloom-cream"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <Eyebrow>{e.date} · {e.time}</Eyebrow>
                                    <span className="text-[10px] uppercase tracking-wider text-bloom-terracotta">
                                        {e.tag}
                                    </span>
                                </div>
                                <p className="font-display text-lg text-bloom-ink leading-snug line-clamp-2">
                                    {e.title}
                                </p>
                                <p className="text-xs text-bloom-inkSoft mt-1.5 line-clamp-1 italic">
                                    {e.body.split("\n")[0]}
                                </p>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card testId="journal-editor" className="col-span-12 lg:col-span-8 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Eyebrow>{entry.date} · {entry.time}</Eyebrow>
                            <p className="text-xs text-bloom-inkSoft mt-1 inline-flex items-center gap-1.5">
                                <KeyRound size={11} strokeWidth={1.5} />
                                End-to-end encrypted
                            </p>
                        </div>
                        <div className="flex items-center gap-1 bg-bloom-cream border border-bloom-line rounded-full p-1">
                            <ToolBtn icon={Bold}   testId="tool-bold" />
                            <ToolBtn icon={Italic} testId="tool-italic" />
                            <ToolBtn icon={List}   testId="tool-list" />
                        </div>
                    </div>

                    <input
                        data-testid="editor-title"
                        defaultValue={entry.title}
                        key={`t-${entry.id}`}
                        className="w-full bg-transparent font-display text-4xl text-bloom-ink leading-tight outline-none placeholder:text-bloom-inkSoft/40"
                    />
                    <textarea
                        data-testid="editor-body"
                        defaultValue={entry.body}
                        key={`b-${entry.id}`}
                        rows={12}
                        className="w-full mt-5 bg-transparent text-bloom-ink text-base leading-relaxed outline-none resize-none placeholder:text-bloom-inkSoft/40"
                        style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.25rem" }}
                    />

                    <div className="mt-6 pt-5 border-t border-bloom-line/70 flex items-center justify-between">
                        <p className="text-xs text-bloom-inkSoft">
                            <span className="font-medium text-bloom-ink">{entry.words}</span>{" "}
                            words · autosaved 2 min ago
                        </p>
                        <div className="flex items-center gap-2">
                            <PillButton testId="delete-entry" variant="ghost">Delete</PillButton>
                            <PillButton testId="save-entry">Save</PillButton>
                        </div>
                    </div>
                </Card>
            </div>
        </WorkspaceShell>
    );
}
