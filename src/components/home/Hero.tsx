"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/constants";
import { MENU_CATEGORIES } from "@/data/menu";

const DISHES = MENU_CATEGORIES.slice(0, 8).map((category) => ({
  src: category.image,
  label: category.name,
}));

const SLOTS = [
  { className: "top-[16%] right-[6%] hidden w-36 lg:block", start: 1, duration: 7.6, fadeDelay: 0.35, interval: 4600 },
  { className: "bottom-[20%] right-[16%] hidden w-44 lg:block", start: 0, duration: 8.8, fadeDelay: 0.55, interval: 5400 },
  { className: "top-[38%] right-[28%] hidden w-32 xl:block", start: 4, duration: 9.4, fadeDelay: 0.75, interval: 6200 },
];

function FloatingDish({
  className,
  start,
  duration,
  fadeDelay,
  interval,
}: (typeof SLOTS)[number]) {
  const [index, setIndex] = useState(start);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % DISHES.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval]);

  const dish = DISHES[index];
  const upcoming = DISHES[(index + 1) % DISHES.length];

  return (
    <motion.div
      className={`absolute will-change-transform ${className}`}
      animate={{ y: [0, -12, 0, 10, 0], x: [0, 6, 0, -5, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: fadeDelay }}
        className="overflow-hidden rounded-3xl border border-white/15 bg-black/50 shadow-neon backdrop-blur-sm"
      >
        <div className="relative h-40 w-full">
          <Image src={upcoming.src} alt="" fill className="invisible" aria-hidden sizes="176px" />
          <AnimatePresence initial={false}>
            <motion.div
              key={dish.label}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image src={dish.src} alt={dish.label} fill className="object-cover" sizes="176px" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative h-9 overflow-hidden bg-black/75">
          <AnimatePresence initial={false} mode="wait">
            <motion.p
              key={dish.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-x-0 px-3 py-2 text-center font-display text-sm"
            >
              {dish.label}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="dark-band relative isolate min-h-[92vh] overflow-hidden">
      <Image
        src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=2000"
        alt="Wokora Foods cafe night"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-red/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-gold/20 blur-3xl" />

      {SLOTS.map((slot) => (
        <FloatingDish key={slot.className} {...slot} />
      ))}

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-wall text-2xl text-brand-gold sm:text-4xl">
          {BRAND.subTagline}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] text-white neon-red sm:text-7xl"
        >
          {BRAND.tagline}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 max-w-xl text-lg text-white/80">
          Momos, dimsum, spring rolls, noodles, chilli potato, fried rice, manchurian and burgers —
          ordered from the booth. Kitchen prints the ticket.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-wrap gap-3">
          <Link href="/menu" className="btn-glow px-7 py-3">Order Now</Link>
          <Link href="/about" className="rounded-full border border-white/40 px-7 py-3 font-display font-semibold text-white hover:border-brand-gold">
            Our story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
