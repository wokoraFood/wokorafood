"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import Link from "next/link";

type Note = {
  id: string;
  title: string;
  body: string;
  orderId: string | null;
  read: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [unread, setUnread] = useState(0);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    if (status !== "authenticated") return;
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => undefined);
    }

    const load = async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      const list: Note[] = data.notifications || [];
      setNotes(list);
      setUnread(data.unread || 0);

      list
        .filter((note) => !note.read && !seen.current.has(note.id))
        .forEach((note) => {
          seen.current.add(note.id);
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification(note.title, { body: note.body });
          }
        });
    };

    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [status]);

  if (status !== "authenticated") return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={async () => {
          setOpen((value) => !value);
          if (!open && unread) {
            await fetch("/api/notifications", { method: "PATCH" });
            setUnread(0);
          }
        }}
        className="relative rounded-full p-2 text-brand-cream hover:text-brand-red"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-red px-1 text-[10px] font-bold">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-ink p-3 shadow-neon">
          <p className="px-1 pb-2 text-xs uppercase tracking-wide text-brand-cream/50">Notifications</p>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {notes.length === 0 && <p className="p-3 text-sm text-brand-cream/50">No updates yet.</p>}
            {notes.map((note) => (
              <Link
                key={note.id}
                href={note.orderId ? `/order/${note.orderId}` : "/account"}
                onClick={() => setOpen(false)}
                className="block rounded-xl bg-white/5 p-3 text-left text-sm hover:bg-white/10"
              >
                <p className="font-semibold text-brand-cream">{note.title}</p>
                <p className="mt-1 text-brand-cream/70">{note.body}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
