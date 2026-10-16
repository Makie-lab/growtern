"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Flag, Loader2, Send } from "lucide-react";
import PathwayIcon from "./PathwayIcon";
import type { Pathway, PathwayId } from "@/data/assessment/pathways";
import type { PublicQuestion } from "@/data/assessment/types";

type PathwayMeta = Pick<Pathway, "id" | "name" | "color" | "icon">;

interface SavedProgress {
  answers: Record<string, number>;
  flagged: string[];
  index: number;
  startedAt: number;
}

const DIFFICULTY = { 1: "Easy", 2: "Medium", 3: "Hard" } as const;

export default function AssessmentRunner({
  pathways,
  questions,
  competencyNames,
}: {
  pathways: PathwayMeta[];
  questions: PublicQuestion[];
  competencyNames: Record<string, string>;
}) {
  const router = useRouter();
  const storageKey = `growtern-assessment:${pathways.map((p) => p.id).join(",")}`;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Restore progress saved on this device.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as SavedProgress;
        setAnswers(saved.answers ?? {});
        setFlagged(saved.flagged ?? []);
        setIndex(Math.min(saved.index ?? 0, questions.length - 1));
        if (saved.startedAt) setStartedAt(saved.startedAt);
      }
    } catch {
      /* ignore corrupt progress */
    }
    setLoaded(true);
  }, [storageKey, questions.length]);

  useEffect(() => {
    if (!loaded) return;
    const progress: SavedProgress = { answers, flagged, index, startedAt };
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [answers, flagged, index, startedAt, loaded, storageKey]);

  const question = questions[index];
  const pathwayMeta = pathways.find((p) => p.id === question.pathway)!;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const sections = useMemo(
    () =>
      pathways.map((p) => ({
        ...p,
        items: questions.map((q, i) => ({ q, i })).filter(({ q }) => q.pathway === p.id),
      })),
    [pathways, questions]
  );

  const go = (next: number) => {
    setIndex(Math.max(0, Math.min(questions.length - 1, next)));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const choose = (option: number) => setAnswers((a) => ({ ...a, [question.id]: option }));

  const toggleFlag = () =>
    setFlagged((f) => (f.includes(question.id) ? f.filter((x) => x !== question.id) : [...f, question.id]));

  // Keyboard shortcuts: 1–4 / A–D choose, ← → navigate.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      const num = "1234".indexOf(key);
      const letter = "abcd".indexOf(key);
      const pick = num >= 0 ? num : letter;
      if (pick >= 0 && pick < question.options.length) setAnswers((a) => ({ ...a, [question.id]: pick }));
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  async function submit() {
    const unanswered = questions.length - answeredCount;
    if (unanswered > 0 && !window.confirm(`${unanswered} item(s) are unanswered and will be scored as incorrect. Submit anyway?`)) {
      return;
    }
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
    <div ref={topRef} className="section-scroll grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      {/* Question panel */}
      <section className="glass-card p-5 sm:p-8" aria-live="polite">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${pathwayMeta.color}1f`, color: pathwayMeta.color }}
            >
              <PathwayIcon icon={pathwayMeta.icon} size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{pathwayMeta.name}</p>
              <p className="text-[11px] opacity-50 truncate">{competencyNames[question.competency]}</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--tint)] opacity-70 flex-shrink-0">
            {DIFFICULTY[question.difficulty]}
          </span>
        </div>

        <p className="text-xs opacity-50 mb-2">
          Item {index + 1} of {questions.length}
        </p>
        <h1 className="text-lg sm:text-xl font-semibold leading-snug mb-6">{question.prompt}</h1>

        <div className="space-y-3" role="radiogroup" aria-label="Answer options">
          {question.options.map((option, i) => {
            const picked = answers[question.id] === i;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={picked}
                onClick={() => choose(i)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all ${
                  picked
                    ? "border-[var(--accent)] bg-[var(--tint)] font-medium"
                    : "border-[var(--hairline-strong)] hover:bg-[var(--tint)]"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                    picked ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--background)]" : "border-[var(--hairline-strong)]"
                  }`}
                >
                  {"ABCD"[i]}
                </span>
                <span className="pt-0.5">{option}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 mt-8">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="btn-secondary text-sm px-4 py-2 inline-flex items-center gap-1 disabled:opacity-30">
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            type="button"
            onClick={toggleFlag}
            className={`text-xs inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              flagged.includes(question.id) ? "text-amber-600 bg-amber-500/10" : "opacity-50 hover:opacity-100"
            }`}
          >
            <Flag size={14} /> {flagged.includes(question.id) ? "Flagged" : "Flag for review"}
          </button>
          {index < questions.length - 1 ? (
            <button type="button" onClick={() => go(index + 1)} className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-1">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-1">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Submit
            </button>
          )}
        </div>
        <p className="hidden sm:block text-[10px] opacity-35 mt-4 text-center">Shortcuts: A–D or 1–4 to answer · ← → to move</p>
      </section>

      {/* Navigator */}
      <aside className="glass-card p-4 lg:sticky lg:top-24 self-start">
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold">Progress</span>
            <span className="tabular-nums opacity-60">
              {answeredCount}/{questions.length}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--tint)] overflow-hidden">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {sections.map((s) => (
            <div key={s.id}>
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-2">{s.name}</p>
              <div className="grid grid-cols-10 lg:grid-cols-8 gap-1">
                {s.items.map(({ q, i }) => {
                  const answered = answers[q.id] !== undefined;
                  const isFlagged = flagged.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Item ${i + 1}${answered ? ", answered" : ""}${isFlagged ? ", flagged" : ""}`}
                      className={`aspect-square rounded text-[9px] font-semibold tabular-nums transition-all ${
                        i === index ? "ring-2 ring-[var(--accent)]" : ""
                      } ${isFlagged ? "bg-amber-500/30" : answered ? "text-white" : "bg-[var(--tint)] opacity-70"}`}
                      style={answered && !isFlagged ? { background: s.color } : undefined}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        <button type="button" onClick={submit} disabled={submitting} className="btn-primary w-full text-sm py-2.5 mt-4 inline-flex items-center justify-center gap-2">
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Submit assessment
        </button>
      </aside>
    </div>
  );
}
