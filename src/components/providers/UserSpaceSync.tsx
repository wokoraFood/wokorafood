"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { applyTheme, type ThemePreference } from "@/lib/theme";
import {
  clearPersistedCart,
  mergeCartLines,
  peekPersistedCart,
  setCartOwner,
  useCartStore,
} from "@/store/cartStore";

export function UserSpaceSync() {
  const { data: session, status } = useSession();
  const items = useCartStore((state) => state.items);
  const hydrateFromServer = useCartStore((state) => state.hydrateFromServer);
  const { setPreference } = useTheme();
  const skipSave = useRef(true);
  const userId = session?.user.id || null;
  const role = session?.user.role;

  useEffect(() => {
    if (status === "loading") return;
    let cancelled = false;

    const boot = async () => {
      skipSave.current = true;
      const guestItems = userId ? peekPersistedCart("guest") : [];
      setCartOwner(userId);
      await useCartStore.persist.rehydrate();
      if (cancelled) return;

      if (!userId) {
        skipSave.current = false;
        return;
      }

      const accountRes = await fetch("/api/account");
      const accountData = await accountRes.json();
      if (cancelled) return;

      const theme = accountData.user?.themePreference as ThemePreference | undefined;
      if (theme) {
        setPreference(theme);
        applyTheme(theme);
      }

      if (role === "admin") {
        hydrateFromServer([]);
        skipSave.current = true;
        return;
      }

      const cartRes = await fetch("/api/cart");
      const cartData = await cartRes.json();
      if (cancelled) return;

      const serverItems = Array.isArray(cartData.items) ? cartData.items : [];
      const local = mergeCartLines(useCartStore.getState().items, guestItems);
      const next = local.length > 0 ? local : serverItems;
      hydrateFromServer(next);
      if (guestItems.length) clearPersistedCart("guest");
      if (next.length > 0) {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: next }),
        });
      }
      skipSave.current = false;
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, [hydrateFromServer, role, setPreference, status, userId]);

  useEffect(() => {
    if (skipSave.current || !userId || role === "admin") return;
    const timer = window.setTimeout(() => {
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }).catch(() => undefined);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [items, role, userId]);

  return null;
}
