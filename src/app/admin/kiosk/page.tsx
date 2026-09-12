"use client";

import { useEffect, useRef, useState } from "react";

type Job = { id: string; html: string; orderId: string };

export default function KioskPrintPage() {
  const [last, setLast] = useState<string>("Waiting for orders...");
  const printing = useRef(false);

  useEffect(() => {
    const poll = async () => {
      if (printing.current) return;
      const res = await fetch("/api/print-queue");
      if (!res.ok) return;
      const data = await res.json();
      const job: Job | undefined = data.jobs?.[0];
      if (!job) return;

      printing.current = true;
      setLast(`Printing ${job.orderId.slice(-6).toUpperCase()}`);
      const frame = document.createElement("iframe");
      frame.style.position = "fixed";
      frame.style.right = "0";
      frame.style.bottom = "0";
      frame.style.width = "0";
      frame.style.height = "0";
      frame.srcdoc = job.html;
      document.body.appendChild(frame);
      frame.onload = () => {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
        fetch("/api/print-queue", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: job.id, status: "printed" }),
        }).finally(() => {
          document.body.removeChild(frame);
          printing.current = false;
        });
      };
    };

    poll();
    const timer = setInterval(poll, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-bold neon-red">Counter print kiosk</h1>
      <p className="mt-4 text-brand-cream/70">
        Leave this tab open on the counter PC. Set the thermal printer as the default
        and enable silent/auto print in the browser for this site.
      </p>
      <p className="mt-8 font-mono text-brand-gold">{last}</p>
    </div>
  );
}
