"use client";

import { motion } from "framer-motion";
import { ShieldCheck, EyeOff, Ear, Hand } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Nothing trains an algorithm",
    sub: "Your words are never used for model training. Ever.",
  },
  {
    icon: EyeOff,
    title: "Pseudonymous by default",
    sub: "No real names, no contacts, no profile photos unless you choose.",
  },
  {
    icon: Ear,
    title: "Trained moderators, not bots",
    sub: "Reports reach a human within 90 seconds. Average response: 38s.",
  },
  {
    icon: Hand,
    title: "Crisis hand-off, worldwide",
    sub: "If it gets too heavy, we quietly connect you to a real clinician.",
  },
];

export default function BloomSafetySection() {
  return (
    <section id="safety" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#5D6862]">
            <span className="divider-dot" />
            Safety &amp; Care
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.05] tracking-tight mt-4 text-[#28312C]">
            Softness,{" "}
            <span className="italic text-[#C67156]">with scaffolding.</span>
          </h2>
          <p className="text-lg text-[#5D6862] mt-6 leading-relaxed">
            Bloom is built the way a therapist&rsquo;s office is designed — quiet,
            confidential, and protected. Here&rsquo;s what&rsquo;s always on, in the
            background, so you don&rsquo;t have to think about it.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="col-span-12 md:col-span-6 lg:col-span-3 rounded-[1.75rem] p-7 bg-[#F0EBE1]/70 border border-black/5"
            >
              <p.icon className="w-5 h-5 text-[#C67156]" strokeWidth={1.6} />
              <div className="font-display text-xl mt-6 leading-snug text-[#28312C]">{p.title}</div>
              <div className="text-sm text-[#5D6862] mt-2 leading-relaxed">{p.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
