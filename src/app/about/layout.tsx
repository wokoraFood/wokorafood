import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About ${BRAND.name}`,
  description: `${BRAND.name} is a sit-down cafe in ${BRAND.location}. Nine food types, veg and chicken marked clearly, ordered from your phone and served at the table.`,
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
