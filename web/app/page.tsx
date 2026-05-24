import type { Metadata } from "next";
import BloomNav from "./components/landing/BloomNav";
import BloomHero from "./components/landing/BloomHero";
import BloomFeatureStrip from "./components/landing/BloomFeatureStrip";
import BloomJournalSection from "./components/landing/BloomJournalSection";
import BloomMoodSection from "./components/landing/BloomMoodSection";
import BloomAasthaSection from "./components/landing/BloomAasthaSection";
import BloomQuizSection from "./components/landing/BloomQuizSection";
import BloomTalkSection from "./components/landing/BloomTalkSection";
import BloomSafetySection from "./components/landing/BloomSafetySection";
import BloomTestimonials from "./components/landing/BloomTestimonials";
import BloomCTA from "./components/landing/BloomCTA";
import BloomFooter from "./components/landing/BloomFooter";

export const metadata: Metadata = {
  title: "Bloom — Feelings, finally in full bloom.",
  description:
    "Journal in private. Watch your moods form a pattern. Talk to Aastha, our quiet AI therapist — and when the weight is too much, match with a real human who's feeling the same shade of blue.",
};

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: "var(--bloom-bg)",
        color: "var(--bloom-ink)",
        fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif",
      }}
    >
      <div className="bloom-noise" aria-hidden />
      <BloomNav />
      <BloomHero />
      <BloomFeatureStrip />
      <BloomTalkSection />
      <BloomMoodSection />
      <BloomAasthaSection />
      <BloomQuizSection />
      <BloomJournalSection />
      <BloomSafetySection />
      <BloomTestimonials />
      <BloomCTA />
      <BloomFooter />
    </main>
  );
}
