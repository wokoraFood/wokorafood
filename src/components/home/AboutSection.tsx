"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WALL_ART } from "@/lib/constants";

const PHOTOS = [
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=900",
];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <Image
            src={PHOTOS[0]}
            alt="Wokora booth seating"
            width={480}
            height={640}
            className="h-72 w-full rounded-2xl object-cover md:h-[28rem]"
          />
          <div className="grid gap-3">
            <Image src={PHOTOS[1]} alt="Cafe dining room" width={360} height={260} className="h-36 w-full rounded-2xl object-cover md:h-52" />
            <Image src={PHOTOS[2]} alt="Shared plates on the table" width={360} height={260} className="h-36 w-full rounded-2xl object-cover md:h-52" />
          </div>
        </div>
        <div>
          <h2 className="heading-underline font-display text-3xl font-bold">A cafe that tastes like a night out</h2>
          <p className="mt-6 text-brand-cream/75">
            Wokora Foods is a fast-food cafe built for lingering — red booths, warm timber,
            neon wall art and a kitchen that moves from smash burgers to hakka noodles without
            losing the plot. Order from your phone at the table. We print the ticket at the counter.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {WALL_ART.slice(0, 4).map((phrase, index) => (
              <motion.p
                key={phrase}
                initial={{ opacity: 0, rotate: -2 }}
                whileInView={{ opacity: 1, rotate: index % 2 ? 2 : -2 }}
                viewport={{ once: true }}
                className="wall-art rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-5 text-2xl"
              >
                {phrase}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
