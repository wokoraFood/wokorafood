"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    const data = await res.json();
    setMessage("If that account exists, a reset link is ready.");
    setResetUrl(data.demoResetUrl || "");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="heading-underline font-display text-3xl font-bold">Reset password</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="Phone or email"
          className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
        />
        <button className="btn-glow w-full py-3">Send reset link</button>
      </form>
      {message && <p className="mt-4 text-sm text-brand-gold">{message}</p>}
      {resetUrl && (
        <p className="mt-2 text-sm">
          Demo link: <Link href={resetUrl} className="text-brand-red underline">{resetUrl}</Link>
        </p>
      )}
    </div>
  );
}
