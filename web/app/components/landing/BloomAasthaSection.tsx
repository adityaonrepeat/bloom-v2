"use client";

import { motion } from "framer-motion";

const messages = [
  { from: "aastha", text: "You wrote that Wednesday felt heavy. Want to unpack what made it so?" },
  { from: "user", text: "I don’t even know where it started. I just felt tired of performing." },
  { from: "aastha", text: "Performing is exhausting because it asks you to abandon yourself. What would resting look like tonight?" },
  { from: "user", text: "Probably not checking my phone. Maybe tea." },
  { from: "aastha", text: "That sounds gentle. I’ll be here when you’re back." },
];

export default function BloomAasthaSection() {
  return (
    <section id="aastha" className="relative py-24 md:py-32 overflow-hidden">
      <div className="blob" style={{ background: "#A6B3A8", width: 420, height: 420, top: 80, left: -120, opacity: 0.35 }} />
      <div className="blob" style={{ background: "#E3A863", width: 340, height: 340, bottom: -100, right: -80, opacity: 0.3 }} />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-12 gap-10 items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="col-span-12 lg:col-span-6"
        >
          <div className="mx-auto max-w-md rounded-[2rem] p-5 bg-[#F9F8F6] border border-black/5 shadow-[0_40px_80px_-40px_rgba(40,49,44,0.45)]">
            <div className="flex items-center gap-3 pb-4 border-b border-black/5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg text-[#28312C]"
                style={{ background: "linear-gradient(135deg,#E3A863,#C67156)" }}
              >
                A
              </div>
              <div>
                <div className="font-display text-lg leading-none text-[#28312C]">Aastha</div>
                <div className="text-xs text-[#7C9885] mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C9885] animate-pulse" />
                  listening · private
                </div>
              </div>
              <div className="ml-auto text-[10px] uppercase tracking-widest text-[#5D6862]">03:12</div>
            </div>

            <div className="py-4 space-y-3 max-h-[380px] overflow-hidden">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] text-[14px] leading-relaxed px-4 py-2.5 rounded-2xl ${
                      m.from === "user"
                        ? "bg-[#C67156] text-[#F9F8F6] rounded-br-sm"
                        : "bg-[#F0EBE1] text-[#28312C] rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-2 flex items-center gap-2 pt-3 border-t border-black/5">
              <div className="flex-1 px-3 py-2 rounded-full bg-[#F0EBE1] text-sm text-[#5D6862]">
                Tell Aastha what&rsquo;s on your chest&hellip;
              </div>
              <button className="w-9 h-9 rounded-full bg-[#28312C] text-[#F9F8F6] flex items-center justify-center">
                ↑
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="col-span-12 lg:col-span-5 lg:col-start-8"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#5D6862]">
            <span className="divider-dot" />
            Aastha · AI Therapist
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.05] tracking-tight mt-4 text-[#28312C]">
            Not advice.{" "}
            <span className="italic text-[#C67156]">Attention.</span>
          </h2>
          <p className="text-lg text-[#5D6862] mt-6 leading-relaxed">
            Aastha is trained on decades of clinical conversation theory —
            trauma-informed, non-pathologising, and refreshingly slow. She
            won&rsquo;t rush you to solutions. She&rsquo;ll sit with you until
            something honest surfaces.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              ["Trauma-informed", "ACT, IFS, CBT-blended"],
              ["Zero data training", "Your words stay yours"],
              ["24/7, never tired", "3AM? She’s here."],
              ["Escalates gently", "Hands off to humans when needed"],
            ].map(([title, sub], i) => (
              <div key={i} className="rounded-2xl border border-black/5 bg-white/60 backdrop-blur-sm p-4">
                <div className="font-display text-[17px] text-[#28312C]">{title}</div>
                <div className="text-xs text-[#5D6862] mt-1">{sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
