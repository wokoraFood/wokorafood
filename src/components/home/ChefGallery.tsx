"use client";

import Image from "next/image";
import Link from "next/link";

const SHOTS = [
  { src: "https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Momos" },
  { src: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Noodles" },
  { src: "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Spring rolls" },
  { src: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Chilli potato" },
  { src: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Fried rice" },
  { src: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Burger" },
];

export function ChefGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="heading-underline font-display text-3xl font-bold">From the wok tonight</h2>
        <Link href="/menu" className="text-sm text-brand-gold">Full menu</Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {SHOTS.map((shot) => (
          <Link key={shot.label} href="/menu" className="group relative h-44 overflow-hidden rounded-2xl md:h-56">
            <Image src={shot.src} alt={shot.label} fill className="object-cover transition duration-500 group-hover:scale-110" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 font-display">
              {shot.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
