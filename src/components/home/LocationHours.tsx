"use client";

import { Clock, MapPin, Phone } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useCafeAddress } from "@/hooks/useCafeAddress";

export function LocationHours() {
  const { address, mapSrc } = useCafeAddress();

  return (
    <section id="visit" className="dark-band bg-[#0d0d0d] py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="heading-underline font-display text-3xl font-bold">Find us</h2>
          <div className="mt-8 space-y-5 text-brand-cream/80">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-red" />
              {address}
            </p>
            <p className="flex gap-3">
              <Phone className="mt-1 h-5 w-5 text-brand-red" />
              {BRAND.phone}
            </p>
            <div className="flex gap-3">
              <Clock className="mt-1 h-5 w-5 text-brand-red" />
              <div>
                {BRAND.hours.map((row) => (
                  <p key={row.day}>
                    <span className="text-white">{row.day}:</span> {row.time}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <iframe
            key={mapSrc}
            title="Wokora Foods map"
            src={mapSrc}
            className="h-56 w-full grayscale contrast-125 sm:h-80"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
