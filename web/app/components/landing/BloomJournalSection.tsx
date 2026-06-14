"use client";

import { motion } from "framer-motion";
import { PenLine, Lock, Wind } from "lucide-react";

export default function BloomJournalSection() {
  return (
    <section id="journal" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="col-span-12 lg:col-span-6 relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-[5/6] shadow-[0_40px_80px_-40px_rgba(40,49,44,0.4)]">
            <img
              src="https://images.unsplash.com/photo-1626970271207-9f9d50757069?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
              alt="Journaling"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#28312C]/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-[#F9F8F6]">
              <div className="text-xs uppercase tracking-[0.22em] opacity-80">Tuesday, 11:42 PM</div>
              <p className="font-display italic text-2xl md:text-3xl leading-snug mt-2">
                &ldquo;Today was heavier than I let on. I&rsquo;m trying to be kinder about that.&rdquo;
              </p>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 right-0 md:-right-10 w-[220px] rounded-[1.25rem] p-4 bg-white shadow-[0_20px_50px_-15px_rgba(40,49,44,0.25)] border border-black/5"
          >
            <div className="flex items-center gap-2 text-xs text-[#5D6862] uppercase tracking-widest">
              <Lock className="w-3 h-3" /> End-to-end private
            </div>
            <div className="mt-2 font-display text-lg leading-tight">Only you hold the key.</div>
          </motion.div>
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
            Journal
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.05] tracking-tight mt-4 text-[#28312C]">
            A page that{" "}
            <span className="italic text-[#C67156]">doesn&rsquo;t judge</span> you back.
          </h2>
          <p className="text-lg text-[#5D6862] mt-6 leading-relaxed">
            Bloom journaling is intentionally slow. No likes. Just you, a
            cursor, and a prompt that meets you where you are, whether that&rsquo;s one line or a thousand.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { icon: PenLine, text: "Guided prompts from Aastha when words won’t come" },
              { icon: Wind, text: "60-second breathing reset before you begin" },
              { icon: Lock, text: "Your thoughts, your space. A personal journal built for reflection." },
            ].map((it, i) => (
              <li key={i} className="flex items-start gap-3">
                <it.icon className="w-4 h-4 mt-1 text-[#C67156]" strokeWidth={1.6} />
                <span className="text-[15px] text-[#28312C]">{it.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
