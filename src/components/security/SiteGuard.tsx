"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

export function SiteGuard() {
  const pathname = usePathname() || "";
  const onPay = pathname.startsWith("/pay");

  useEffect(() => {
    const onMenu = (event: MouseEvent) => {
      if (isEditable(event.target)) return;
      event.preventDefault();
    };
    const onDrag = (event: DragEvent) => {
      event.preventDefault();
    };
    const onCopy = (event: ClipboardEvent) => {
      if (!onPay || isEditable(event.target)) return;
      event.preventDefault();
    };
    const onKey = (event: KeyboardEvent) => {
      if (!onPay) return;
      const key = event.key.toLowerCase();
      if (event.key === "F12") {
        event.preventDefault();
        return;
      }
      if (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) {
        event.preventDefault();
        return;
      }
      if (event.ctrlKey && key === "u") {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onMenu);
    document.addEventListener("dragstart", onDrag);
    document.addEventListener("copy", onCopy);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", onMenu);
      document.removeEventListener("dragstart", onDrag);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("keydown", onKey);
    };
  }, [onPay]);

  return null;
}
