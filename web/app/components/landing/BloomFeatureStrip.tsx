import { BookOpen, LineChart, Sparkles, Video, HeartHandshake } from "lucide-react";

const items = [
  { icon: BookOpen, label: "Private Journal" },
  { icon: LineChart, label: "5-Day Mood Graph" },
  { icon: Sparkles, label: "Aastha, AI Therapist" },
  { icon: HeartHandshake, label: "Emotional Score Quiz" },
  { icon: Video, label: "Live 1:1 Talk" },
];

export default function BloomFeatureStrip() {
  return (
    <section className="relative border-y border-black/5 bg-[#F0EBE1]/50 py-5 overflow-hidden">
      <div className="bloom-marquee flex gap-16 whitespace-nowrap w-[200%]">
        {[...items, ...items, ...items, ...items].map((it, i) => (
          <div key={i} className="flex items-center gap-3 text-[#28312C]/80">
            <it.icon className="w-4 h-4 text-[#C67156]" strokeWidth={1.6} />
            <span className="font-display italic text-lg">{it.label}</span>
            <span className="divider-dot opacity-50" />
          </div>
        ))}
      </div>
    </section>
  );
}
