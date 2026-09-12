"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, QrCode, Smartphone, Sofa } from "lucide-react";
import { WallCrossTicker } from "@/components/home/WallCrossTicker";
import { BRAND } from "@/lib/constants";

const FLOATS = [
  { src: "https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=400", label: "Momos", className: "right-[6%] top-[18%] hidden w-32 lg:block" },
  { src: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400", label: "Burger", className: "bottom-[28%] right-[16%] hidden w-36 lg:block" },
  { src: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400", label: "Noodles", className: "top-[38%] right-[30%] hidden w-28 xl:block" },
];

const SHOTS = [
  { src: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1400", alt: "Night booths", span: "md:col-span-2 md:row-span-2" },
  { src: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1000", alt: "The room" },
  { src: "https://images.pexels.com/photos/2403391/pexels-photo-2403391.jpeg?auto=compress&cs=tinysrgb&w=1000", alt: "Wok fire" },
  { src: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1000", alt: "Neon corner" },
  { src: "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1000", alt: "Table service" },
  { src: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1000", alt: "Shared plates" },
];

const SIGNATURES = [
  { n: "01", name: "Momos", copy: "Steamed, tandoori, kurkure — eight pieces, red chutney, no apology.", src: "https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { n: "02", name: "Noodles", copy: "Hakka toss, schezwan oil, the sound of the wok doing the talking.", src: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { n: "03", name: "Burgers", copy: "Smash, peri peri, cheese burst — built for the booth, not the drive-through.", src: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { n: "04", name: "Dimsum", copy: "Translucent wrappers, steam on the glass, a quieter kind of heat.", src: "https://images.pexels.com/photos/5409022/pexels-photo-5409022.jpeg?auto=compress&cs=tinysrgb&w=800" },
];

const RITUAL = [
  { title: "Scan the booth", copy: "The QR on your table opens the menu with your number already set.", icon: QrCode },
  { title: "Tap the craving", copy: "Momos, noodles, burgers, mocktails — add, pay, done. No counter queue.", icon: Smartphone },
  { title: "Kitchen prints", copy: "The ticket hits the counter. Staff set a wait time. Your phone lights up.", icon: Flame },
  { title: "Stay in the glow", copy: "Red booth, neon wall, plates landing hot. You never left the table.", icon: Sofa },
];

const RULES = [
  "The phone is the waiter.",
  "The wok is louder than the playlist.",
  "Booths are for lingering.",
  "No filler on the list.",
  "Taste talks here.",
];

const STATS = [
  { value: "13", label: "Wok chapters" },
  { value: "20", label: "Booths & tables" },
  { value: "11–12", label: "Hours the room stays open" },
  { value: "0", label: "Queues at the counter" },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <section className="dark-band relative min-h-[88vh]">
        <Image
          src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt="Wokora Foods kitchen fire"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/35" />
        <div className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-brand-red/25 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-brand-gold/15 blur-3xl" />

        {FLOATS.map((card, index) => (
          <motion.div
            key={card.label}
            className={`absolute overflow-hidden rounded-3xl border border-white/20 bg-black/40 shadow-neon backdrop-blur-sm ${card.className}`}
            animate={{ y: [0, -10, 0, 8, 0] }}
            transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={card.src} alt={card.label} width={180} height={160} className="h-36 w-full object-cover" />
            <p className="bg-black/70 px-3 py-2 text-center font-display text-sm">{card.label}</p>
          </motion.div>
        ))}

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 sm:px-6">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-wall text-3xl text-brand-gold sm:text-5xl">
            {BRAND.subTagline}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[0.92] text-white neon-red sm:text-7xl"
          >
            Not a food court.
            <br />A night out that happens to serve momos.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 max-w-xl text-lg text-white/75">
            Koramangala. Red booths. A wok that does not sleep early.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex flex-wrap gap-2">
            {["Momos", "Noodles", "Burgers", "Dimsum", "Table-side order"].map((chip) => (
              <span key={chip} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                {chip}
              </span>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="btn-glow px-7 py-3">Order the table</Link>
            <Link href="/#visit" className="rounded-full border border-white/25 px-7 py-3 font-display font-semibold text-white hover:border-brand-gold">
              Find the booth
            </Link>
          </motion.div>
        </div>
      </section>

      <WallCrossTicker />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-wall text-2xl text-brand-gold">The room</p>
          <h2 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Built for lingering, plated for the booth.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-brand-cream/80">
            Wokora Foods is a fast-food cafe that refuses to feel fast. Timber, neon, plants, and a
            kitchen that moves from smash burgers to hakka noodles without losing the plot.
          </p>
          <p className="mt-4 max-w-xl text-brand-cream/60">
            We started so a table of friends could order from their phones and still feel the room:
            steam off the dimsum, chilli potato crunch, fried rice hitting the wok. The receipt prints
            at the counter. You do not queue. You stay.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((stat) => (
            <article key={stat.label} className="card-surface p-5">
              <p className="font-display text-4xl font-extrabold text-brand-gold">{stat.value}</p>
              <p className="mt-2 text-sm text-brand-cream/60">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid auto-rows-[200px] gap-3 md:grid-cols-3 md:auto-rows-[240px]">
          {SHOTS.map((shot, index) => (
            <motion.div
              key={shot.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className={`relative overflow-hidden rounded-[1.6rem] ${shot.span || ""}`}
            >
              <Image src={shot.src} alt={shot.alt} fill className="object-cover transition duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <p className="absolute bottom-4 left-4 font-wall text-xl text-white">{shot.alt}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="font-wall text-2xl text-brand-gold">The plates</p>
        <h2 className="heading-underline mt-1 font-display text-3xl font-bold">Four reasons the booth fills up</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SIGNATURES.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, x: index % 2 ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-surface group grid overflow-hidden sm:grid-cols-[140px_1fr]"
            >
              <div className="relative h-40 sm:h-auto">
                <Image src={item.src} alt={item.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <p className="font-wall text-2xl text-brand-red">{item.n}</p>
                <h3 className="mt-1 font-display text-2xl font-bold">{item.name}</h3>
                <p className="mt-2 text-sm text-brand-cream/65">{item.copy}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-ink/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="heading-underline font-display text-3xl font-bold">How the room works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {RITUAL.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="card-surface p-6"
              >
                <step.icon className="h-6 w-6 text-brand-gold" />
                <p className="mt-4 font-display text-xl font-semibold">{step.title}</p>
                <p className="mt-2 text-sm text-brand-cream/65">{step.copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-wall text-2xl text-brand-gold">House rules</p>
            <h2 className="mt-2 font-display text-4xl font-bold">Written on the wall. Lived in the booth.</h2>
          </div>
          <ol className="space-y-4">
            {RULES.map((rule, index) => (
              <li key={rule} className="flex items-center gap-4 border-b border-white/10 pb-4">
                <span className="font-wall text-3xl text-brand-red">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-display text-xl">{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="card-surface overflow-hidden lg:grid lg:grid-cols-2">
          <div className="relative min-h-[320px]">
            <iframe title="Wokora Foods map" src={BRAND.mapEmbed} className="absolute inset-0 h-full w-full border-0" loading="lazy" />
          </div>
          <div className="p-8 md:p-12">
            <p className="font-wall text-2xl text-brand-gold">Find the booth</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Koramangala keeps the lights on.</h2>
            <p className="mt-4 text-brand-cream/70">{BRAND.address}</p>
            <div className="mt-4 space-y-1 text-sm text-brand-cream/60">
              {BRAND.hours.map((row) => (
                <p key={row.day}>
                  <span className="text-brand-cream">{row.day}:</span> {row.time}
                </p>
              ))}
            </div>
            <p className="mt-4 text-sm text-brand-gold">{BRAND.phone} · {BRAND.email}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="btn-glow px-6 py-3">Order the table</Link>
              <Link href="/#visit" className="rounded-full border border-white/20 px-6 py-3 font-display font-semibold">
                Visit hours
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
