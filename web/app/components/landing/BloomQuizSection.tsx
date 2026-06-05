"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const sampleQuiz = {
  number: 3,
  prompt: "When something hurts, my first instinct is to…",
  options: [
    { label: "Keep it to myself and push through", weight: 2 },
    { label: "Distract myself until it dims", weight: 3 },
    { label: "Write it down or journal", weight: 4 },
    { label: "Talk to someone I trust", weight: 5 },
    { label: "I’m still learning this one", weight: 3 },
  ],
  selected: 3,
};

export default function BloomQuizSection() {
  const score = 42;
  const max = 50;
  const pct = (score / max) * 100;
  const circumference = 2 * Math.PI * 52;

  return (
    <section id="quiz" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#5D6862]">
              <span className="divider-dot" />
              Emotional Score
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.05] tracking-tight mt-4 text-[#28312C]">
              Ten questions.
              <br />
              <span className="italic text-[#C67156]">One honest number.</span>
            </h2>
            <p className="text-lg text-[#5D6862] mt-6 leading-relaxed">
              A five-minute check-in: 10 questions, 5 answers each. Produces an
              Emotional Score out of 50. It&rsquo;s the quiet language Bloom uses to
              match you with someone who&rsquo;s in the same weather as you.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" stroke="#E6E2D6" strokeWidth="10" fill="none" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="#C67156"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset: circumference * (1 - pct / 100) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-display text-4xl text-[#28312C]">{score}</div>
                  <div className="text-xs text-[#5D6862] -mt-1">/ {max}</div>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-[#5D6862]">Your score</div>
                <div className="font-display text-2xl mt-1 text-[#28312C]">Steady &amp; open</div>
                <div className="text-sm text-[#5D6862] mt-1 max-w-xs">
                  You&rsquo;ll match best with people in the 38–46 range today.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="rounded-[2rem] p-8 md:p-10 bg-[#28312C] text-[#F0EBE1] shadow-[0_60px_120px_-60px_rgba(40,49,44,0.6)] relative overflow-hidden">
              <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
                style={{ background: "#C67156", filter: "blur(80px)", opacity: 0.4 }}
              />

              <div className="relative flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[#A6B3A8]">
                <span>Question {sampleQuiz.number} of 10</span>
                <span>Emotional Check-in</span>
              </div>

              <div className="relative mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#C67156]" style={{ width: "30%" }} />
              </div>

              <h3 className="relative font-display text-2xl md:text-[2rem] leading-snug mt-8">
                {sampleQuiz.prompt}
              </h3>

              <div className="relative mt-6 space-y-2.5">
                {sampleQuiz.options.map((o, i) => {
                  const selected = sampleQuiz.selected === i;
                  return (
                    <button
                      key={i}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
                        selected
                          ? "border-[#C67156] bg-[#C67156]/15"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          selected ? "border-[#C67156] bg-[#C67156]" : "border-white/30"
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 text-[#28312C]" strokeWidth={3} />}
                      </span>
                      <span className="text-[15px]">{o.label}</span>
                      <span className="ml-auto text-[11px] text-[#A6B3A8]">+{o.weight}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-8 flex items-center justify-between">
                <div className="text-xs text-[#A6B3A8]">No right answers. Only honest ones.</div>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F9F8F6] text-[#28312C] text-sm font-medium">
                  Continue →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
