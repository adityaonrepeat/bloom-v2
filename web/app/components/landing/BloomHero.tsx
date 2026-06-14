"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BloomHero() {
  return (
    <section
      className="relative min-h-screen md:h-screen overflow-hidden"
      style={{
        background: [
          "radial-gradient(ellipse 58% 58% at -5% 108%, rgba(148,163,155,0.82) 0%, transparent 56%)",
          "#f7f4ef",
        ].join(", "),
      }}
    >
      <div className="hero-atmosphere" aria-hidden />
      <div className="flower-glow" aria-hidden />

      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-8%",
          right: "-6%",
          width: "55%",
          height: "72%",
          background: "rgba(214,142,92,0.50)",
          borderRadius: "50%",
          filter: "blur(88px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 md:h-full flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 pt-[68px] pb-10 md:pb-0">
        <div className="max-w-[680px]">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5D6862] mb-8"
            >
              <span>•</span>
              A soft place for the mind
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-display text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[5.6rem] leading-[0.98] tracking-tight text-[#28312C]"
            >
              Feelings,{" "}
              <span className="italic font-light text-[#C67156]">finally</span>
              <br />
              in full bloom.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="mt-8 max-w-xl text-lg md:text-xl text-[#5D6862] leading-relaxed"
            >
              Journal in private. Watch your moods form a pattern. Talk to{" "}
              <span className="text-[#28312C] font-medium">Aastha</span>, our quiet AI
              therapist, and when the weight is too much, match with a real human
              who&rsquo;s feeling the same shade of blue.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/signup"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px]"
              >
                Start your first entry
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/aastha"
                className="btn-ghost inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px]"
              >
                <Sparkles className="w-4 h-4" />
                Meet Aastha
              </Link>
              <div className="flex items-center gap-2 text-sm text-[#5D6862] ml-1">
                <div className="flex -space-x-2">
                  {["#C67156", "#A6B3A8", "#E3A863"].map((bg, i) => (
                    <span
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-[var(--bloom-bg)]"
                      style={{ background: bg }}
                    />
                  ))}
                </div>
                <span>12,800+ quiet hearts</span>
              </div>
            </motion.div>
        </div>
      </div>

      <motion.div
        className="hero-flower-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Flower-bloom.png"
          alt=""
          className="hero-flower"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35 }}
        className="bloom-float hidden lg:block absolute z-20"
        style={{ top: "132px", right: "28%" }}
      >
        <div className="w-[260px] rounded-[1.5rem] p-5 bg-white/72 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_-20px_rgba(40,49,44,0.22)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-[#5D6862]">Today</span>
            <span className="text-xs text-[#C67156]">+2 vs. yesterday</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl text-[#28312C]">7.2</span>
            <span className="text-sm text-[#5D6862]">/ 10 · Grounded</span>
          </div>
          <div className="mt-3 flex items-end gap-1 h-10">
            {[4, 5, 3, 6, 7.2].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${(v / 10) * 100}%`,
                  background: i === 4 ? "#C67156" : "rgba(198,113,86,0.22)",
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-[#5D6862]">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55 }}
        className="bloom-float-slow hidden lg:block absolute z-20"
        style={{ top: "600px", right: "5%" }}
      >
        <div className="w-[290px] rounded-[1.5rem] p-4 bg-[#28312C] text-[#F0EBE1] shadow-[0_30px_60px_-20px_rgba(40,49,44,0.42)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#E3A863] flex items-center justify-center font-display text-[#28312C] text-sm shrink-0">
              A
            </div>
            <div className="text-xs">
              <div className="font-medium">Aastha</div>
              <div className="text-[#A6B3A8] text-[10px]">listening quietly</div>
            </div>
            <span className="ml-auto w-2 h-2 rounded-full bg-[#7C9885] animate-pulse shrink-0" />
          </div>
          <p className="text-[13px] leading-relaxed italic text-[#F0EBE1]/90">
            &ldquo;You don&rsquo;t have to name it tonight. Let&rsquo;s sit with it for a minute.&rdquo;
          </p>
        </div>
      </motion.div>
    </section>
  );
}
