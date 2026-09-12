"use client";

import { useEffect, useState } from "react";
import { TABLE_COUNT } from "@/lib/constants";

export default function TableQrPage() {
  const [table, setTable] = useState("1");
  const [qr, setQr] = useState<{ url: string; dataUrl: string } | null>(null);

  useEffect(() => {
    fetch(`/api/qr?table=${table}`)
      .then((res) => res.json())
      .then(setQr);
  }, [table]);

  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <h1 className="heading-underline font-display text-3xl font-bold">Table QR codes</h1>
      <select
        value={table}
        onChange={(event) => setTable(event.target.value)}
        className="mt-8 rounded-full border border-white/10 bg-ink px-4 py-2"
      >
        {Array.from({ length: TABLE_COUNT }, (_, index) => String(index + 1)).map((value) => (
          <option key={value} value={value}>
            Table {value}
          </option>
        ))}
      </select>
      {qr && (
        <div className="card-surface mx-auto mt-8 w-fit p-6">
          {/* QR is a generated data URL — next/image is not needed */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr.dataUrl} alt={`QR for table ${table}`} className="h-56 w-56" />
          <p className="mt-3 text-xs text-brand-cream/60">{qr.url}</p>
        </div>
      )}
    </div>
  );
}
