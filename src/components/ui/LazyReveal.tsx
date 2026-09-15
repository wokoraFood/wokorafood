"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function LazyReveal({
  children,
  minHeight = 280,
  className = "",
}: {
  children: React.ReactNode;
  minHeight?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: "0px 0px -18% 0px", threshold: 0.12 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={show ? undefined : { minHeight }}>
      {show ? (
        reduceMotion.current ? (
          children
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        )
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14" aria-hidden>
          <div className="h-3 w-28 animate-pulse rounded-full bg-brand-gold/20" />
          <div className="mt-3 h-8 w-52 animate-pulse rounded-full bg-white/10" />
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="h-36 animate-pulse rounded-2xl bg-white/[0.07] sm:h-48" />
            <div className="h-36 animate-pulse rounded-2xl bg-white/[0.07] sm:h-48" />
            <div className="hidden h-48 animate-pulse rounded-2xl bg-white/[0.07] md:block" />
          </div>
        </div>
      )}
    </div>
  );
}
