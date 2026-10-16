"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "@/components/account/useAccount";
import { Award, Briefcase, CheckCircle2, Languages, Loader2, Mail, MapPin, Video } from "lucide-react";
import type { Expert } from "@/data/experts";

export default function ExpertCard({ expert, attemptId, color }: { expert: Expert; attemptId?: string; color: string }) {
  const { isSignedIn } = useAccount();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<string>(expert.sessionModes[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const initials = expert.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/experts/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expertId: expert.id, message, preferredMode: mode, attemptId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      setStatus("error");
    }
  }

  return (
    <article className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{ background: `${color}1f`, color }}
          aria-hidden
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold">{expert.name}</h3>
            {!expert.verified && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-semibold">Sample profile</span>
            )}
          </div>
          <p className="text-xs opacity-60 flex items-center gap-1">
            <Briefcase size={12} /> {expert.title} · {expert.yearsExperience} yrs
          </p>
          <p className="text-xs opacity-60 flex items-center gap-1">
            <MapPin size={12} /> {expert.location}, Philippines
          </p>
        </div>
      </div>

      <p className="text-xs opacity-70 leading-relaxed">{expert.bio}</p>

      <div className="flex flex-wrap gap-1">
        {expert.specialties.map((s) => (
          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--tint)]">{s}</span>
        ))}
      </div>

      <div className="text-[11px] opacity-60 space-y-1">
        <p className="flex items-center gap-1.5"><Award size={12} /> {expert.credentials.join(" · ")}</p>
        <p className="flex items-center gap-1.5"><Languages size={12} /> {expert.languages.join(", ")}</p>
        <p className="flex items-center gap-1.5"><Video size={12} /> {expert.sessionModes.join(" / ")}</p>
      </div>

      <div className="mt-auto pt-3 border-t border-[var(--hairline)]">
        {status === "sent" ? (
          <p className="text-xs text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Request sent — {expert.name.split(" ")[0]} will reply by email.
          </p>
        ) : !isSignedIn ? (
          <Link href="/sign-in?redirect_url=%2Fexperts" className="btn-secondary w-full text-sm py-2 inline-flex justify-center">
            Sign in to request a session
          </Link>
        ) : !open ? (
          <button type="button" onClick={() => setOpen(true)} className="btn-primary w-full text-sm py-2 inline-flex items-center justify-center gap-2">
            <Mail size={15} /> Request a consultation
          </button>
        ) : (
          <form onSubmit={send} className="space-y-2">
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like guidance on? e.g. reviewing my result and planning certifications"
              className="w-full text-xs p-3 rounded-xl border border-[var(--hairline-strong)] bg-transparent focus:outline-none focus:border-[var(--accent)]"
            />
            <div className="flex gap-2">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="text-xs px-2 rounded-xl border border-[var(--hairline-strong)] bg-transparent"
                aria-label="Session mode"
              >
                {expert.sessionModes.map((m) => <option key={m}>{m}</option>)}
              </select>
              <button type="submit" disabled={status === "sending"} className="btn-primary flex-1 text-sm py-2 inline-flex items-center justify-center gap-2">
                {status === "sending" && <Loader2 size={14} className="animate-spin" />} Send request
              </button>
            </div>
            {error && <p className="text-[11px] text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </article>
  );
}
