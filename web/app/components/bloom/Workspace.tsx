import React from "react";
import { LucideProps } from "lucide-react";

interface WorkspaceShellProps {
    children: React.ReactNode;
}

interface WorkspaceHeaderProps {
    eyebrow?: string;
    title: string;
    titleAccent?: string;
    sub?: string;
    right?: React.ReactNode;
}

interface CardProps {
    className?: string;
    children: React.ReactNode;
    testId?: string;
}

type PillVariant = "primary" | "terracotta" | "ghost" | "light";

interface PillButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: PillVariant;
    testId?: string;
    icon?: React.ComponentType<LucideProps>;
}

interface EyebrowProps {
    children: React.ReactNode;
    className?: string;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
    return (
        <div className="max-w-[1240px] mx-auto px-6 md:px-10 pt-10 pb-24">
            {children}
        </div>
    );
}

export function WorkspaceHeader({ eyebrow, title, titleAccent, sub, right }: WorkspaceHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
                {eyebrow && (
                    <p className="eyebrow text-bloom-inkSoft mb-3">{eyebrow}</p>
                )}
                <h1 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight text-bloom-ink">
                    {title}
                    {titleAccent && (
                        <>
                            {" "}
                            <span className="italic font-light text-bloom-terracotta">
                                {titleAccent}
                            </span>
                        </>
                    )}
                </h1>
                {sub && (
                    <p className="mt-3 text-bloom-inkSoft text-sm md:text-base max-w-3xl">
                        {sub}
                    </p>
                )}
            </div>
            {right && <div className="flex items-center gap-2">{right}</div>}
        </div>
    );
}

export function Card({ className = "", children, testId }: CardProps) {
    return (
        <div
            data-testid={testId}
            className={`bg-white rounded-3xl border border-bloom-line/70 shadow-[0_18px_50px_-30px_rgba(42,47,45,0.18)] ${className}`}
        >
            {children}
        </div>
    );
}

export function DarkCard({ className = "", children, testId }: CardProps) {
    return (
        <div
            data-testid={testId}
            className={`bg-bloom-forest text-bloom-cream rounded-3xl border border-bloom-forestBorder shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] ${className}`}
        >
            {children}
        </div>
    );
}

export function PillButton({ children, onClick, variant = "primary", testId, icon: Icon }: PillButtonProps) {
    const base = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors";
    const styles: Record<PillVariant, string> = {
        primary: "bg-bloom-forest text-bloom-cream hover:bg-bloom-forestSoft",
        terracotta: "bg-bloom-terracotta text-bloom-cream hover:bg-bloom-terracottaHover",
        ghost: "text-bloom-ink hover:bg-bloom-peach/70 border border-bloom-line",
        light: "bg-white text-bloom-ink hover:bg-bloom-peach border border-bloom-line",
    };
    return (
        <button
            data-testid={testId}
            onClick={onClick}
            className={`${base} ${styles[variant]}`}
        >
            {Icon && <Icon size={14} strokeWidth={1.75} />}
            {children}
        </button>
    );
}

export function Eyebrow({ children, className = "" }: EyebrowProps) {
    return (
        <p className={`eyebrow text-bloom-inkSoft ${className}`}>{children}</p>
    );
}
