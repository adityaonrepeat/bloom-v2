"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "I didn’t know I needed a quiet app until I found one.",
    name: "Priya, 24",
    tag: "journal · 41 entries",
    size: "normal",
  },
  {
    quote: "Aastha noticed a pattern in three weeks my therapist missed in six months.",
    name: "Devansh, 29",
    tag: "mood · steady climb",
    size: "normal",
  },
  {
    quote: "Skipped five times, then stayed an hour. The person I matched with just got it.",
    name: "Anonymous",
    tag: "talk · 1:1 matched",
    size: "large",
  },
  {
    quote: "We use it as a couple. The mood charts are oddly romantic — seeing each other’s waves.",
    name: "Riya &amp; Kabir",
    tag: "mood · 12 weeks",
    size: "normal",
  },
  {
    quote: "3am, couldn’t sleep. Opened Aastha. By 3:40 I felt like I could breathe again.",
    name: "Tanvir, 31",
    tag: "aastha · late nights",
    size: "normal",
  },
];

export default function BloomTestimonials() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 mb-16 items-end">
          <div className="col-span-12 lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#5D6862]">
              <span className="divider-dot" />
              Testimonials
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.05] tracking-tight mt-4 text-[#28312C]">
              Written quietly,
              <br />
              <span className="italic text-[#C67156]">by the people who stayed.</span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <p className="text-lg text-[#5D6862] leading-relaxed">
              No incentives. No review prompts. Just people who opened the app one
              ordinary night and kept coming back.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className={`rounded-[1.75rem] p-7 border border-black/5 flex flex-col gap-4 ${
                t.size === "large"
                  ? "bg-[#28312C] text-[#F0EBE1] md:row-span-2"
                  : "bg-white"
              }`}
            >
              <p
                className={`font-display text-xl md:text-2xl leading-snug italic ${
                  t.size === "large" ? "text-[#F0EBE1]" : "text-[#28312C]"
                }`}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-auto">
                <div
                  className={`text-sm font-medium ${
                    t.size === "large" ? "text-[#F0EBE1]" : "text-[#28312C]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: t.name }}
                />
                <div
                  className={`text-xs mt-1 ${
                    t.size === "large" ? "text-[#A6B3A8]" : "text-[#5D6862]"
                  }`}
                >
                  {t.tag}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
