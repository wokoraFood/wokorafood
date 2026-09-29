"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { getSession, signIn } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { userFacingError } from "@/lib/publicError";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [otpHint, setOtpHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setError("");
    setOtpHint("");
    const email = identifier.trim();
    if (!email.includes("@")) {
      setError("Enter your email to receive an OTP.");
      return;
    }
    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose: "login" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(userFacingError(data.error || "Server Error"));
      return;
    }
    setOtpHint("OTP sent to your email.");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload: Record<string, string> = {
      identifier: identifier.trim(),
      callbackUrl,
    };
    if (useOtp) payload.otp = otp;
    else payload.password = password;
    const result = await signIn("credentials", {
      ...payload,
      redirect: false,
    });
    setLoading(false);
    if (!result || result.error) {
      setError(
        useOtp
          ? "Incorrect email or OTP. Request a new code if it expired."
          : "Incorrect phone, email, or password. Create an account if you are new here."
      );
      return;
    }
    const session = await getSession();
    if (session?.user.role === "admin") {
      router.push("/admin");
    } else if (callbackUrl.startsWith("http")) {
      router.push("/account");
    } else {
      router.push(callbackUrl);
    }
    router.refresh();
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="dark-band relative hidden overflow-hidden bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center lg:block">
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="wall-art text-5xl">Eat Drink Chill Repeat</p>
          <p className="mt-4 text-brand-gold">Wokora Foods · Good Food. Better Mood.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-8 font-display text-3xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-brand-cream/60">
            Sign in with Google, your password, or an OTP sent to your email.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <input
              required
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={useOtp ? "Email" : "Phone number or email"}
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
            />
            {useOtp ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="Email OTP"
                  className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
                />
                <button type="button" onClick={sendOtp} className="rounded-full border border-white/15 px-4 py-3 text-sm sm:py-0">
                  Send OTP
                </button>
              </div>
            ) : (
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
              />
            )}
            {otpHint && <p className="text-xs text-brand-gold">{otpHint}</p>}
            {error && <p className="text-sm text-brand-red">{error}</p>}
            <button disabled={loading} className="btn-glow w-full py-3">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setUseOtp((value) => !value);
              setError("");
              setOtpHint("");
            }}
            className="mt-3 w-full text-sm text-brand-gold"
          >
            {useOtp ? "Use password instead" : "Use email OTP instead"}
          </button>
          <GoogleAuthButton callbackUrl={callbackUrl} />
          <div className="mt-4 flex flex-col gap-2 text-sm text-brand-cream/70 sm:flex-row sm:justify-between">
            <Link href="/forgot-password">Forgot password</Link>
            <Link href="/signup" className="text-brand-gold">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
