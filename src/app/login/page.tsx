"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { getSession, signIn } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";

const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_AUTH);

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      identifier: identifier.trim(),
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (!result || result.error) {
      setError("Incorrect phone, email, or password. Create an account if you are new here.");
      return;
    }
    const session = await getSession();
    if (session?.user.role === "admin") {
      router.push("/admin");
    } else if (callbackUrl.startsWith("http") || callbackUrl === "/menu") {
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
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-8 font-display text-3xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-brand-cream/60">
            Sign in with your phone number and password. An account is required to place an order.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <input
              required
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Phone number or email"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
            />
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-brand-red"
            />
            {error && <p className="text-sm text-brand-red">{error}</p>}
            <button disabled={loading} className="btn-glow w-full py-3">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          {googleEnabled && (
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="mt-3 w-full rounded-full border border-white/15 py-3 text-sm"
            >
              Continue with Google
            </button>
          )}
          <div className="mt-4 flex justify-between text-sm text-brand-cream/70">
            <Link href="/forgot-password">Forgot password</Link>
            <Link href="/signup" className="text-brand-gold">
              Create New Account
            </Link>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-brand-cream/70">
            <p className="mb-2 font-semibold text-brand-cream">Demo login — one tap</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-white/15 px-3 py-1.5"
                onClick={() => {
                  setIdentifier("9876543210");
                  setPassword("Taste@1234");
                }}
              >
                Customer
              </button>
              <button
                type="button"
                className="rounded-full border border-white/15 px-3 py-1.5"
                onClick={() => {
                  setIdentifier("9999999999");
                  setPassword("Admin@1234");
                }}
              >
                Kitchen / Admin
              </button>
            </div>
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
