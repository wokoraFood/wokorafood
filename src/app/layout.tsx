import type { Metadata } from "next";
import { Bebas_Neue, Inter, Poppins } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/lib/constants";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
});
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: `${BRAND.name} | ${BRAND.tagline}`,
  description: `${BRAND.subTagline}. Momos, noodles, burgers, and cafe classics in a neon booth setting.`,
};

const themeBootScript = `
(function () {
  try {
    var stored = localStorage.getItem("wokora-theme") || "dark";
    var resolved = stored === "system"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : stored;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
    document.documentElement.style.colorScheme = resolved;
    document.documentElement.dataset.theme = stored;
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${bebas.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen bg-ink font-body text-brand-cream antialiased">
        <AppProviders>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <MobileBottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
