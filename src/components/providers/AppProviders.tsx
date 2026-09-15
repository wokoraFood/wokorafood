"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { UserSpaceSync } from "@/components/providers/UserSpaceSync";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const festive = localStorage.getItem("wokora-festive") === "1";
    document.documentElement.classList.toggle("festive", festive);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider>
        <UserSpaceSync />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
