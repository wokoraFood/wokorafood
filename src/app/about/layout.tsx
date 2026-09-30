import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About ${BRAND.name}`,
  description: `${BRAND.name} is the night cafe in ${BRAND.location} — nine plates, neon booths, green-dot veg and red-mark heat. Order from the table. We serve the wok to you.`,
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
