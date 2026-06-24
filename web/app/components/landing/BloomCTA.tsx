"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BloomCTA() {
  return (
    <section className="relative py-10 md:py-16 px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="mx-auto max-w-[1400px] relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden px-6 sm:px-10 md:px-20 py-10 sm:py-20 md:py-28 text-center"
        style={{
          background: "radial-gradient(ellipse at 60% 40%, #E3A863 0%, #C67156 45%, #B05D44 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/></svg>\")",
            mixBlendMode: "overlay",
          }}
        />

        <div className="relative">
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[5rem] leading-[0.98] tracking-tight text-[#F9F8F6]">
            You don&rsquo;t have to
            <br />
            bloom alone.
          </h2>
          <p className="mt-6 text-lg text-[#F9F8F6]/80 max-w-md mx-auto leading-relaxed">
            One quiet app. A journal that listens. A match who understands.
            Start tonight. It&rsquo;s always free.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#28312C] text-[#F9F8F6] text-[15px] font-medium transition hover:bg-[#1d241f] active:scale-95"
            >
              Start your bloom
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/aastha"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/20 backdrop-blur border border-white/30 text-[#F9F8F6] text-[15px] font-medium transition hover:bg-white/30 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Meet Aastha
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#F9F8F6]/70">
            <span>No credit card</span>
            <span className="w-1 h-1 rounded-full bg-[#F9F8F6]/40" />
            <span>100% private</span>
            <span className="w-1 h-1 rounded-full bg-[#F9F8F6]/40" />
            <span>Free forever</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
