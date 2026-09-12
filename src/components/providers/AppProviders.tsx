"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const festive = localStorage.getItem("wokora-festive") === "1";
    document.documentElement.classList.toggle("festive", festive);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
