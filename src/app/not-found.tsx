import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-sm text-brand-cream/60">This page is not on the Wokora Foods site.</p>
      <Link href="/" className="btn-glow mt-8 inline-block px-6 py-3">
        Go home
      </Link>
    </div>
  );
}
