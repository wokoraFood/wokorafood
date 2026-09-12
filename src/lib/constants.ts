export const BRAND = {
  name: "Wokora Foods",
  wordmark: "Wokora Foods",
  domain: "wokorafoods.com",
  tagline: "Good Food. Better Mood.",
  subTagline: "Taste Talks Here",
  phone: "+91 98765 43210",
  email: "hello@wokorafoods.com",
  address: "12, Food Street, Koramangala 4th Block, Bengaluru 560034",
  hours: [
    { day: "Monday – Thursday", time: "11:00 AM – 11:00 PM" },
    { day: "Friday – Sunday", time: "11:00 AM – 12:00 AM" },
  ],
  mapEmbed:
    "https://maps.google.com/maps?q=koramangala%20bangalore%20food%20street&t=&z=15&ie=UTF8&iwloc=&output=embed",
  social: {
    instagram: "https://instagram.com/wokorafoods",
    facebook: "https://facebook.com/wokorafoods",
    twitter: "https://x.com/wokorafoods",
  },
};

export const WALL_ART = [
  "Good Food Better Mood",
  "Eat Drink Chill Repeat",
  "Good Food Good Vibes",
  "Momos Noodles Mood",
  "Burger Fries Friends Happiness",
];

export const GST_RATE = 0.05;

export const TABLE_COUNT = 20;

export { MENU_CATEGORIES as CATEGORY_META } from "@/data/menu";

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function displayOrderId(id: string) {
  return `WF-${id.slice(-6).toUpperCase()}`;
}

export function displayOrderNumber(serial?: number | null) {
  if (!serial) return "—";
  return `#${String(serial).padStart(3, "0")}`;
}

export function localMenuImage(slug: string, fallback: string) {
  return fallback;
}

export function loyaltyFromTotal(total: number) {
  return Math.floor(total / 10);
}
