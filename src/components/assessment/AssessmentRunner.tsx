"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Flag, Loader2, Send, X } from "lucide-react";
import PathwayIcon from "./PathwayIcon";
import type { Pathway, PathwayId } from "@/data/assessment/pathways";
import type { PublicQuestion } from "@/data/assessment/types";

type PathwayMeta = Pick<Pathway, "id" | "name" | "color" | "icon">;

interface SavedProgress {
  answers: Record<string, number>;
  flagged: string[];
  startedAt: number;
}

const DIFFICULTY = { 1: "Easy", 2: "Medium", 3: "Hard" } as const;

function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Test-form layout: every question of a part on one page, submit at the end. */
export default function AssessmentRunner({
  pathways,
  questions,
  competencyNames,
  shuffle,
}: {
  pathways: PathwayMeta[];
  questions: PublicQuestion[];
  competencyNames: Record<string, string>;
  shuffle: boolean;
}) {
  const router = useRouter();
  const storageKey = `growtern-test:${pathways.map((p) => p.id).join(",")}`;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [part, setPart] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore progress saved on this device.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as SavedProgress;
        setAnswers(saved.answers ?? {});
        setFlagged(saved.flagged ?? []);
        if (saved.startedAt) setStartedAt(saved.startedAt);
      }
    } catch {
      /* ignore corrupt progress */
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(storageKey, JSON.stringify({ answers, flagged, startedAt } satisfies SavedProgress));
  }, [answers, flagged, startedAt, loaded, storageKey]);

  useEffect(() => {
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  // One part per pathway; numbering runs across the whole test.
  const parts = useMemo(() => {
    let n = 0;
    return pathways.map((p, i) => {
      const own = questions.filter((q) => q.pathway === p.id);
      const ordered = shuffle ? seededShuffle(own, startedAt + i) : own;
      return { ...p, items: ordered.map((q) => ({ q, number: ++n })) };
    });
  }, [pathways, questions, shuffle, startedAt]);

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const skippedCount = total - answeredCount;
  const current = parts[part];

  const choose = (id: string, option: number) => setAnswers((a) => ({ ...a, [id]: option }));
  const clear = (id: string) =>
    setAnswers((a) => {
      const next = { ...a };
      delete next[id];
      return next;
    });
  const toggleFlag = (id: string) => setFlagged((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const jumpTo = (partIndex: number, id?: string) => {
    setPart(partIndex);
    requestAnimationFrame(() => {
      const el = id ? document.getElementById(`q-${id}`) : null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathways: pathways.map((p) => p.id) as PathwayId[],
          answers,
          durationSeconds: (Date.now() - startedAt) / 1000,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      localStorage.removeItem(storageKey);
      router.push(`/assessment/result/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Sticky test header */}
      <div className="sticky top-14 lg:top-4 z-30">
        <div className="glass-card px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex-1 min-w-[180px]">
            <p className="text-sm font-semibold truncate">
              {pathways.length === 4 ? "Full assessment" : pathways.map((p) => p.name).join(" + ")}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full bg-[var(--tint)] overflow-hidden">
                <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${(answeredCount / total) * 100}%` }} />
              </div>
              <span className="text-[11px] tabular-nums opacity-60">{answeredCount}/{total}</span>
            </div>
          </div>
          <span className="text-xs tabular-nums opacity-70 flex items-center gap-1" aria-label="Elapsed time">
            <Clock size={13} /> {formatTime(elapsed)}
          </span>
          {flagged.length > 0 && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <Flag size={13} /> {flagged.length}
            </span>
          )}
          <button type="button" onClick={() => setConfirming(true)} className="btn-primary text-xs px-4 py-2">
            <Send size={14} /> Submit test
          </button>
        </div>
      </div>

      {/* Part tabs */}
      {parts.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Test parts">
          {parts.map((p, i) => {
            const done = p.items.filter(({ q }) => answers[q.id] !== undefined).length;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === part}
                onClick={() => jumpTo(i)}
                className={`chip ${i === part ? "chip--active" : ""}`}
              >
                <PathwayIcon icon={p.icon} size={14} />
                Part {i + 1}: {p.name}
                <span className="tabular-nums opacity-70">{done}/{p.items.length}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6 items-start">
        {/* Questions */}
        <ol className="space-y-4">
          {current.items.map(({ q, number }) => {
            const picked = answers[q.id];
            const isFlagged = flagged.includes(q.id);
            return (
              <li key={q.id} id={`q-${q.id}`} className="glass-card p-5 sm:p-6 scroll-mt-40">
                <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px]">
                  <span className="font-bold">Question {number}</span>
                  <span className="opacity-40">of {total}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--tint)] opacity-80">{competencyNames[q.competency]}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--tint)] opacity-60">{DIFFICULTY[q.difficulty]}</span>
                  <button
                    type="button"
                    onClick={() => toggleFlag(q.id)}
                    aria-pressed={isFlagged}
                    className={`ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-lg ${isFlagged ? "text-amber-600 bg-amber-500/10" : "opacity-45 hover:opacity-100"}`}
                  >
                    <Flag size={12} /> {isFlagged ? "Flagged" : "Flag"}
                  </button>
                </div>
                <p className="text-base font-semibold leading-snug mb-4">{q.prompt}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label={`Question ${number} options`}>
                  {q.options.map((option, i) => (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={picked === i}
                      onClick={() => choose(q.id, i)}
                      className={`test-option ${picked === i ? "test-option--picked" : ""}`}
                    >
                      <span className="test-option-letter">{"ABCD"[i]}</span>
                      <span className="pt-0.5">{option}</span>
                    </button>
                  ))}
                </div>
                {picked !== undefined && (
                  <button type="button" onClick={() => clear(q.id)} className="text-[11px] opacity-45 hover:opacity-100 mt-3">
                    Clear answer
                  </button>
                )}
              </li>
            );
          })}

          <li className="flex flex-wrap justify-end gap-3 pt-2">
            {part < parts.length - 1 ? (
              <button type="button" onClick={() => jumpTo(part + 1)} className="btn-primary">
                Next: Part {part + 2} — {parts[part + 1].name} <ArrowRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="btn-primary">
                <Send size={16} /> Submit test
              </button>
            )}
          </li>
        </ol>

        {/* Question map */}
        <aside className="glass-card p-4 hidden lg:block sticky top-32">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-2">Question map</p>
          <div className="grid grid-cols-5 gap-1">
            {current.items.map(({ q, number }) => {
              const answered = answers[q.id] !== undefined;
              const isFlagged = flagged.includes(q.id);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => jumpTo(part, q.id)}
                  aria-label={`Question ${number}${answered ? ", answered" : ""}${isFlagged ? ", flagged" : ""}`}
                  className={`aspect-square rounded text-[10px] font-semibold tabular-nums ${
                    isFlagged ? "bg-amber-500/30" : answered ? "text-[var(--background)]" : "bg-[var(--tint)] opacity-70"
                  }`}
                  style={answered && !isFlagged ? { background: "var(--accent)" } : undefined}
                >
                  {number}
                </button>
              );
            })}
          </div>
          <div className="text-[10px] opacity-55 mt-3 space-y-1">
            <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--accent)" }} /> Answered</p>
            <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500/40" /> Flagged</p>
            <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--tint)] border border-[var(--hairline-strong)]" /> Not answered</p>
          </div>
        </aside>
      </div>

      {/* Submit confirmation — portalled so it sits above the app sidebar */}
      {confirming && createPortal(
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="submit-title">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !submitting && setConfirming(false)} />
          <div className="relative bg-[var(--background)] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-6 animate-fade-in">
            <button type="button" onClick={() => setConfirming(false)} disabled={submitting} aria-label="Close" className="absolute right-4 top-4 opacity-50 hover:opacity-100">
              <X size={18} />
            </button>
            <h2 id="submit-title" className="text-lg font-bold mb-1">Submit your test?</h2>
            <p className="text-sm opacity-60 mb-5">Skipped questions are scored as incorrect.</p>
            <div className="grid grid-cols-3 gap-2 mb-5 text-center">
              <div className="rounded-xl bg-[var(--tint)] p-3">
                <p className="text-xl font-bold tabular-nums">{answeredCount}</p>
                <p className="text-[10px] opacity-55">Answered</p>
              </div>
              <div className="rounded-xl bg-[var(--tint)] p-3">
                <p className={`text-xl font-bold tabular-nums ${skippedCount ? "text-red-500" : ""}`}>{skippedCount}</p>
                <p className="text-[10px] opacity-55">Skipped</p>
              </div>
              <div className="rounded-xl bg-[var(--tint)] p-3">
                <p className={`text-xl font-bold tabular-nums ${flagged.length ? "text-amber-600" : ""}`}>{flagged.length}</p>
                <p className="text-[10px] opacity-55">Flagged</p>
              </div>
            </div>
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirming(false)} disabled={submitting} className="btn-secondary flex-1 justify-center">
                Keep going
              </button>
              <button type="button" onClick={submit} disabled={submitting || answeredCount === 0} className="btn-primary flex-1 justify-center">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Submit
              </button>
            </div>
            {answeredCount === 0 && <p className="text-[11px] opacity-55 mt-3 text-center">Answer at least one question to submit.</p>}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
