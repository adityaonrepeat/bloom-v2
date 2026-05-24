"use client"

import { useState } from "react"
import axios from "axios"

const moods = [
  {
    tag: "happy", score: 40, label: "Happy",
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="8" fill="#F5C842" stroke="#D4A030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx="24" cy="10" rx="4" ry="6" fill="#F5C842" stroke="#D4A030" strokeWidth="1.2" transform="rotate(0 24 10)" opacity="0.85"/>
        <ellipse cx="34" cy="14" rx="4" ry="6" fill="#F5C842" stroke="#D4A030" strokeWidth="1.2" transform="rotate(45 34 14)" opacity="0.85"/>
        <ellipse cx="38" cy="24" rx="4" ry="6" fill="#F5C842" stroke="#D4A030" strokeWidth="1.2" transform="rotate(90 38 24)" opacity="0.85"/>
        <ellipse cx="34" cy="34" rx="4" ry="6" fill="#F5C842" stroke="#D4A030" strokeWidth="1.2" transform="rotate(135 34 34)" opacity="0.85"/>
        <ellipse cx="24" cy="38" rx="4" ry="6" fill="#F5C842" stroke="#D4A030" strokeWidth="1.2" transform="rotate(180 24 38)" opacity="0.85"/>
        <ellipse cx="14" cy="34" rx="4" ry="6" fill="#F5C842" stroke="#D4A030" strokeWidth="1.2" transform="rotate(225 14 34)" opacity="0.85"/>
        <ellipse cx="10" cy="24" rx="4" ry="6" fill="#F5C842" stroke="#D4A030" strokeWidth="1.2" transform="rotate(270 10 24)" opacity="0.85"/>
        <ellipse cx="14" cy="14" rx="4" ry="6" fill="#F5C842" stroke="#D4A030" strokeWidth="1.2" transform="rotate(315 14 14)" opacity="0.85"/>
        <circle cx="21.5" cy="22.5" r="1.2" fill="#8B6914"/>
        <circle cx="26.5" cy="22.5" r="1.2" fill="#8B6914"/>
        <path d="M21 26.5C21.8 27.8 22.8 28.5 24 28.5C25.2 28.5 26.2 27.8 27 26.5" stroke="#8B6914" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    tag: "calm", score: 30, label: "Calm",
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 38C14 38 12 18 24 8C36 18 34 38 34 38" fill="#8FBC8F" stroke="#5B8C5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 8C24 8 24 24 24 38" stroke="#5B8C5A" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <path d="M18 20C18 20 21 22 24 20" stroke="#5B8C5A" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <path d="M30 20C30 20 27 22 24 20" stroke="#5B8C5A" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <path d="M17 28C17 28 20.5 30 24 28" stroke="#5B8C5A" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <path d="M31 28C31 28 27.5 30 24 28" stroke="#5B8C5A" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <path d="M20 19C20.5 18 21.5 18 22 19" stroke="#3D5C3D" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M26 19C26.5 18 27.5 18 28 19" stroke="#3D5C3D" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M22 23C22.5 23.8 23.5 24 24 24C24.5 24 25.5 23.8 26 23" stroke="#3D5C3D" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    tag: "stressed", score: 20, label: "Stressed",
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 26C12 26 10 22 14 19C14 15 18 12 22 12C24 10 28 10 30 12C33 11 37 13 37 17C40 18 41 22 38 26Z" fill="#C4B5A0" stroke="#8B7355" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="18" y1="30" x2="17" y2="35" stroke="#8B9EB0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <line x1="24" y1="30" x2="23" y2="37" stroke="#8B9EB0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <line x1="30" y1="30" x2="29" y2="35" stroke="#8B9EB0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <circle cx="21" cy="20" r="1.2" fill="#6B5B45"/>
        <circle cx="29" cy="20" r="1.2" fill="#6B5B45"/>
        <path d="M22 24C23 23.2 25 23.2 26 24" stroke="#6B5B45" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    tag: "anxious", score: 10, label: "Anxious",
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 20C10 16 14 24 18 20C22 16 26 24 30 20C34 16 38 24 42 20" stroke="#7BA3BF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M6 28C10 24 14 32 18 28C22 24 26 32 30 28C34 24 38 32 42 28" stroke="#7BA3BF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
        <path d="M6 36C10 32 14 40 18 36C22 32 26 40 30 36C34 32 38 40 42 36" stroke="#7BA3BF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
        <ellipse cx="24" cy="16" rx="6" ry="7" fill="#B8D4E8" stroke="#6887A0" strokeWidth="1.3"/>
        <circle cx="22" cy="14.5" r="1" fill="#4A6B82"/>
        <circle cx="26" cy="14.5" r="1" fill="#4A6B82"/>
        <path d="M22 19C22.5 17.8 23.5 17.2 24 17.2C24.5 17.2 25.5 17.8 26 19" stroke="#4A6B82" strokeWidth="1" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
]

export default function MoodBanner({ name }: { name: string }) {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  const submit = async (mood: { tag: string; score: number }) => {
    setFading(true)
    try { await axios.post("/api/mood", mood) } catch { /* silent */ }
    setTimeout(() => setVisible(false), 400)
  }

  if (!visible) return null

  return (
    <div
      className={`transition-all duration-400 ease-out ${
        fading ? "opacity-0 -translate-y-4 max-h-0 overflow-hidden mb-0" : "opacity-100 translate-y-0"
      }`}
    >
      <div
        className="rounded-2xl px-6 py-5"
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 4px 24px rgba(40,49,44,0.06)",
        }}
      >
        <p
          className="mb-1"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "22px",
            letterSpacing: "-0.02em",
            color: "#28312C",
          }}
        >
          Good to see you, {name}.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p style={{ fontSize: "15px", color: "#5D6862" }}>How are you feeling today?</p>
          <div className="flex items-center gap-2.5">
            {moods.map((m) => (
              <button
                key={m.tag}
                onClick={() => submit(m)}
                title={m.label}
                className="group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(40,49,44,0.1)",
                  boxShadow: "0 2px 8px rgba(40,49,44,0.06)",
                }}
              >
                <div className="scale-75 group-hover:scale-[0.82] transition-transform">
                  {m.svg}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
