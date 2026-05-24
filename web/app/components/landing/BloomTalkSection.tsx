"use client";

import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, SkipForward, Flag, MessageCircle } from "lucide-react";

function CtrlBtn({
  icon,
  label,
  danger,
}: {
  icon: React.ReactNode;
  label?: string;
  danger?: boolean;
}) {
  return (
    <button
      className={`inline-flex items-center gap-2 px-3.5 h-10 rounded-full text-xs transition-colors ${
        danger
          ? "bg-[#D05B43] hover:bg-[#B8462F] text-white"
          : "bg-white/10 hover:bg-white/20 text-white"
      }`}
    >
      {icon}
      {label && <span className="pr-0.5">{label}</span>}
    </button>
  );
}

export default function BloomTalkSection() {
  return (
    <section id="talk" className="relative py-24 md:py-32 bg-[#28312C] text-[#F0EBE1] overflow-hidden">
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
        style={{ background: "#C67156", filter: "blur(120px)", opacity: 0.25 }}
      />
      <div
        className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full"
        style={{ background: "#7C9885", filter: "blur(140px)", opacity: 0.25 }}
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 relative">
        <div className="grid grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#A6B3A8]">
              <span className="w-1 h-1 rounded-full bg-[#C67156]" />
              Talk · Live matching
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[4rem] leading-[1.02] tracking-tight mt-4">
              A stranger,
              <br />
              <span className="italic text-[#E3A863]">in the same weather.</span>
            </h2>
            <p className="text-lg text-[#A6B3A8] mt-6 leading-relaxed max-w-md">
              When the ache is too specific for a journal, we match you — by Emotional
              Score, not by looks — with one real person online right now. Talk, video,
              voice. Skip anytime. Report anytime. Leave feeling less alone.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 max-w-md">
              {[
                ["Mic off by default", "You choose when to be heard"],
                ["Blur-first video", "Ease into being seen"],
                ["Skip instantly", "One tap, new match in 4s"],
                ["Report & block", "One strike — gone forever"],
              ].map(([title, sub], i) => (
                <div key={i} className="rounded-2xl p-4 bg-white/[0.04] border border-white/10">
                  <div className="font-display text-[16px]">{title}</div>
                  <div className="text-[12px] text-[#A6B3A8] mt-1">{sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="relative rounded-[2rem] overflow-hidden aspect-[16/11] shadow-[0_60px_140px_-40px_rgba(0,0,0,0.6)] border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1758525865627-afc184e0e2c2?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600"
                alt="Video call"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

              <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D05B43] animate-pulse" />
                  LIVE · 02:14
                </div>
                <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white">
                  Matched · Score 41/50
                </div>
              </div>

              <div className="absolute bottom-24 right-5 w-[140px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 bg-[#1a1f1b] shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-[#3a4a3f] to-[#1a1f1b] flex items-end p-2">
                  <div className="w-full text-[10px] text-white/80 flex items-center justify-between">
                    <span>You</span>
                    <span className="flex items-center gap-1">
                      <Mic className="w-2.5 h-2.5" /> on
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-24 left-5 max-w-xs text-white">
                <div className="text-xs text-white/70 uppercase tracking-widest">speaking with</div>
                <div className="font-display text-2xl md:text-3xl mt-1">Someone kind.</div>
                <div className="text-sm text-white/70 mt-1 italic">
                  &ldquo;&hellip;yeah, Wednesdays are weirdly the hardest for me too.&rdquo;
                </div>
              </div>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10">
                <CtrlBtn icon={<Mic className="w-4 h-4" />} />
                <CtrlBtn icon={<Video className="w-4 h-4" />} />
                <CtrlBtn icon={<MessageCircle className="w-4 h-4" />} />
                <div className="w-px h-6 bg-white/10" />
                <CtrlBtn icon={<SkipForward className="w-4 h-4" />} label="Skip" danger />
                <CtrlBtn icon={<Flag className="w-4 h-4" />} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#A6B3A8]">
              <span>End-to-end encrypted · No recordings · No identity</span>
              <span className="flex items-center gap-1">
                <MicOff className="w-3 h-3" /> <VideoOff className="w-3 h-3" /> One tap, one exit.
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
