"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", otp: "" });
  const [otpHint, setOtpHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: form.phone }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not send OTP");
      return;
    }
    setOtpHint(data.demoOtp ? `Demo OTP: ${data.demoOtp}` : "OTP sent.");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(typeof data.error === "string" ? data.error : "Check the form and try again.");
      return;
    }
    await signIn("credentials", {
      identifier: form.phone,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center lg:block">
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="wall-art text-5xl">Good Food Good Vibes</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-8 font-display text-3xl font-bold">Join Wokora Foods</h1>
          <p className="mt-2 text-sm text-brand-cream/60">
            Create your account with a phone number. Add an email if you would like order updates.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Full name"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
            />
            <input
              required
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="10-digit phone number"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
            />
            <div className="flex gap-2">
              <input
                value={form.otp}
                onChange={(event) => setForm({ ...form, otp: event.target.value })}
                placeholder="OTP (optional)"
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
              />
              <button type="button" onClick={sendOtp} className="rounded-full border border-white/15 px-4 text-sm">
                Send OTP
              </button>
            </div>
            {otpHint && <p className="text-xs text-brand-gold">{otpHint}</p>}
            <input
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="Email (optional)"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
            />
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Password"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
            />
            {error && <p className="text-sm text-brand-red">{error}</p>}
            <button disabled={loading} className="btn-glow w-full py-3">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="mt-4 text-sm text-brand-cream/70">
            Already have an account? <Link href="/login" className="text-brand-gold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
