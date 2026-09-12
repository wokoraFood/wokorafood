"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function AboutTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative h-80 overflow-hidden rounded-[2rem]">
          <Image
            src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Wokora kitchen"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-wall text-2xl text-brand-gold">The room has a plot</p>
          <h2 className="mt-2 font-display text-4xl font-bold">A cafe that tastes like a night out</h2>
          <p className="mt-5 text-brand-cream/70">
            Neon, timber, red booths, and a wok that does not do half measures. Read the story —
            then sit down and order momos like you live here.
          </p>
          <motion.div whileHover={{ x: 4 }}>
            <Link href="/about" className="btn-glow mt-6 inline-block px-6 py-3">
              About Wokora Foods
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
