export const BRAND = {
  name: "Wokora Foods",
  wordmark: "Wokora Foods",
  domain: "wokorafoods.com",
  tagline: "Good Food. Better Mood.",
  subTagline: "Taste Talks Here",
  phone: "+91 81782 06648",
  email: "wokorafoods@gmail.com",
  address: "Shop No. 23, LGF, Siddharth Vihar, Opus Plot, Yojna, Ghaziabad, UP 201009",
  location: "Siddharth Vihar, Ghaziabad",
  hours: [
    { day: "Monday – Thursday", time: "11:00 AM – 11:00 PM" },
    { day: "Friday – Sunday", time: "11:00 AM – 12:00 AM" },
  ],
  social: {
    instagram: "https://instagram.com/wokorafoods",
    facebook: "https://facebook.com/wokorafoods",
    twitter: "https://x.com/wokorafoods",
  },
};

export function googleMapsEmbed(address: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=en&z=16&output=embed`;
}

export function brandWhatsApp() {
  const digits = BRAND.phone.replace(/\D/g, "");
  return digits.startsWith("91") ? digits : `91${digits}`;
}

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

export function loyaltyFromTotal(total: number) {
  return Math.floor(total / 10);
}
