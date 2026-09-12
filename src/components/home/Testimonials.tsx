"use client";

import { useEffect, useState } from "react";

const REVIEWS = [
  { name: "Diya S.", quote: "The peri peri burger and that neon wall? Instant mood lift.", rating: 5 },
  { name: "Rohan K.", quote: "Ordered from the table QR. Receipt printed before our mocktails arrived.", rating: 5 },
  { name: "Meera P.", quote: "Best paneer tikka pizza in the neighbourhood. Cozy booths too.", rating: 4 },
  { name: "Kabir A.", quote: "Hakkaa noodles + cold coffee is my weekday ritual.", rating: 5 },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % REVIEWS.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const review = REVIEWS[index];

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
      <h2 className="heading-underline font-display text-3xl font-bold">Taste talks here</h2>
      <blockquote className="card-surface mt-8 px-8 py-10">
        <p className="font-display text-2xl text-white">“{review.quote}”</p>
        <p className="mt-4 text-brand-gold">{review.name} · {"★".repeat(review.rating)}</p>
      </blockquote>
    </section>
  );
}
