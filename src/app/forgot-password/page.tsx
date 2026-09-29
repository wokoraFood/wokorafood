"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userFacingError } from "@/lib/publicError";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(userFacingError(data.error || "Server Error"));
      return;
    }
    setSent(true);
    setMessage("If that email is registered, an OTP is on its way.");
  };

  const resetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(userFacingError(data.error || "Server Error"));
      return;
    }
    router.push("/login");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="heading-underline font-display text-3xl font-bold">Reset password</h1>
      <p className="mt-3 text-sm text-brand-cream/60">We will send a one-time code to your email.</p>
      {!sent ? (
        <form onSubmit={sendOtp} className="mt-8 space-y-4">
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Account email"
            className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
          />
          {error && <p className="text-sm text-brand-red">{error}</p>}
          <button className="btn-glow w-full py-3">Send email OTP</button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="mt-8 space-y-4">
          <input
            required
            inputMode="numeric"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="Email OTP"
            className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
          />
          {error && <p className="text-sm text-brand-red">{error}</p>}
          <button className="btn-glow w-full py-3">Update password</button>
        </form>
      )}
      {message && <p className="mt-4 text-sm text-brand-gold">{message}</p>}
      <p className="mt-6 text-sm text-brand-cream/70">
        <Link href="/login" className="text-brand-gold">Back to login</Link>
      </p>
    </div>
  );
}
