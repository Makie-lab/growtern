"use client";

import { useState } from "react";
import { CheckCircle2, CircleMinus, XCircle } from "lucide-react";

export interface ReviewItem {
  id: string;
  number: number;
  prompt: string;
  competency: string;
  options: string[];
  answer: number;
  picked: number | null;
}

type Filter = "all" | "incorrect" | "skipped" | "correct";

const PAGE = 10;

/** Feedback on every question, filterable by outcome. */
export default function AnswerReview({ items }: { items: ReviewItem[] }) {
  const [filter, setFilter] = useState<Filter>("incorrect");
  const [limit, setLimit] = useState(PAGE);
  const status = (i: ReviewItem) => (i.picked === null ? "skipped" : i.picked === i.answer ? "correct" : "incorrect");
  const counts = {
    all: items.length,
    correct: items.filter((i) => status(i) === "correct").length,
    incorrect: items.filter((i) => status(i) === "incorrect").length,
    skipped: items.filter((i) => status(i) === "skipped").length,
  };
  const shown = filter === "all" ? items : items.filter((i) => status(i) === filter);
  const tabs: { value: Filter; label: string }[] = [
    { value: "incorrect", label: "Incorrect" },
    { value: "skipped", label: "Skipped" },
    { value: "correct", label: "Correct" },
    { value: "all", label: "All" },
  ];

  return (
    <section className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold">Question feedback</h2>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter questions">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={filter === t.value}
              onClick={() => {
                setFilter(t.value);
                setLimit(PAGE);
              }}
              className={`chip text-xs py-1.5 ${filter === t.value ? "chip--active" : ""}`}
            >
              {t.label} <span className="tabular-nums opacity-70">{counts[t.value]}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="text-sm opacity-50">No questions in this group.</p>
      ) : (
        <ol className="space-y-3">
          {shown.slice(0, limit).map((item) => {
            const s = status(item);
            return (
              <li key={item.id} className="rounded-xl border border-[var(--hairline)] p-4">
                <p className="text-sm font-medium flex gap-2">
                  {s === "correct" && <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />}
                  {s === "incorrect" && <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />}
                  {s === "skipped" && <CircleMinus size={16} className="opacity-50 flex-shrink-0 mt-0.5" />}
                  <span>
                    <span className="opacity-50">{item.number}.</span> {item.prompt}
                  </span>
                </p>
                <p className="text-[10px] opacity-45 ml-6 mt-0.5">{item.competency}</p>
                <ul className="ml-6 mt-2 space-y-1">
                  {item.options.map((opt, i) => {
                    const isAnswer = i === item.answer;
                    const isPicked = i === item.picked;
                    return (
                      <li
                        key={i}
                        className={`text-xs px-2.5 py-1.5 rounded-lg ${
                          isAnswer ? "bg-emerald-500/10 text-emerald-700 font-semibold" : isPicked ? "bg-red-500/10 text-red-600" : "opacity-55"
                        }`}
                      >
                        {"ABCD"[i]}. {opt}
                        {isAnswer && " ✓ correct answer"}
                        {isPicked && !isAnswer && " ✗ your answer"}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      )}
      {shown.length > limit && (
        <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="btn-secondary w-full justify-center text-sm mt-4">
          Show {Math.min(PAGE, shown.length - limit)} more · {shown.length - limit} left
        </button>
      )}
    </section>
  );
}
