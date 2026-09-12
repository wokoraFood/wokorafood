import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="dark-band overflow-hidden rounded-[2rem] border border-brand-red/40 bg-[linear-gradient(120deg,#1a0a0c_0%,#0d0d0d_46%,#1a1408_100%)] px-8 py-14 text-center shadow-neon">
        <p className="font-wall text-3xl text-brand-gold">Taste Talks Here</p>
        <h2 className="mt-2 font-display text-4xl font-bold text-white">Table ready. Menu open. Mood better.</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/65">
          Scan the booth, tap the plate, stay in the glow.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/menu" className="btn-glow px-7 py-3">Order now</Link>
          <Link href="/about" className="rounded-full border border-white/40 px-7 py-3 font-display font-semibold text-white hover:border-brand-gold">
            About the cafe
          </Link>
        </div>
      </div>
    </section>
  );
}
