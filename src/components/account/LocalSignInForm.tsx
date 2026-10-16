"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Info, Loader2, LogIn } from "lucide-react";

/** Placeholder sign-in: name + email, no password. Replace with real auth later. */
export default function LocalSignInForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only allow redirects back into this site.
  const raw = params.get("redirect_url") ?? "/dashboard";
  const redirectTo = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (res.ok) {
      window.location.href = redirectTo;
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Could not sign in");
    setLoading(false);
  }

  const input = "w-full text-sm px-3 py-2.5 rounded-xl border border-[var(--hairline-strong)] bg-transparent focus:outline-none focus:border-[var(--accent)]";

  return (
    <form onSubmit={submit} className="glass-card p-6 w-full max-w-sm space-y-4">
      {mode === "sign-up" && (
        <label className="block">
          <span className="text-xs font-semibold opacity-60">Full name</span>
          <input className={`${input} mt-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Dela Cruz" maxLength={80} autoComplete="name" />
        </label>
      )}
      <label className="block">
        <span className="text-xs font-semibold opacity-60">Email</span>
        <input className={`${input} mt-1`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
      </label>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full text-sm py-2.5 inline-flex items-center justify-center gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
        {mode === "sign-up" ? "Create personal account" : "Sign in"}
      </button>
      <p className="text-[11px] opacity-50 text-center">
        {mode === "sign-up" ? (
          <>Already have an account? <a href={`/sign-in?redirect_url=${encodeURIComponent(redirectTo)}`} className="underline">Sign in</a></>
        ) : (
          <>New here? <a href={`/sign-up?redirect_url=${encodeURIComponent(redirectTo)}`} className="underline">Create an account</a></>
        )}
      </p>
      <p className="text-[10px] opacity-50 flex gap-1.5 leading-relaxed border-t border-[var(--hairline)] pt-3">
        <Info size={12} className="flex-shrink-0 mt-0.5" />
        Placeholder sign-in for local use: no password, data stays on this computer.
      </p>
    </form>
  );
}
