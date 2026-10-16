"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, Info, ListChecks, Shuffle } from "lucide-react";
import PathwayIcon from "./PathwayIcon";
import { ITEMS_PER_PATHWAY, type Pathway, type PathwayId } from "@/data/assessment/pathways";

const MINUTES_PER_ITEM = 1;

/** Test setup: choose pathways and options, then start. */
export default function PathwayPicker({ pathways }: { pathways: Pathway[] }) {
  const [selected, setSelected] = useState<PathwayId[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const allSelected = selected.length === pathways.length;
  const items = selected.length * ITEMS_PER_PATHWAY;

  const toggle = (id: PathwayId) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  // Keep canonical pathway order in the URL.
  const query = pathways.filter((p) => selected.includes(p.id)).map((p) => p.id).join(",");
  const href = `/assessment/take?pathways=${query}${shuffle ? "&shuffle=1" : ""}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
      {/* Step 1: pathways */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-sm font-semibold">1 · Choose pathway(s)</h2>
          <button
            type="button"
            onClick={() => setSelected(allSelected ? [] : pathways.map((p) => p.id))}
            className="text-xs font-semibold accent-text"
          >
            {allSelected ? "Clear all" : `Select all (${pathways.length * ITEMS_PER_PATHWAY} items)`}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pathways.map((p) => {
            const active = selected.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                aria-pressed={active}
                className={`glass-card p-5 text-left transition-all ${active ? "ring-2 ring-[var(--accent)]" : "glass-hover"}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}1f`, color: p.color }}>
                    <PathwayIcon icon={p.icon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-[11px] opacity-55">{ITEMS_PER_PATHWAY} items · 5 competencies</p>
                  </div>
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      active ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--background)]" : "border-[var(--hairline-strong)]"
                    }`}
                  >
                    {active && <Check size={14} strokeWidth={3} />}
                  </span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-2">AHP competency weights</p>
                <ul className="space-y-1.5">
                  {p.competencies.map((c) => (
                    <li key={c.id} className="text-xs">
                      <div className="flex justify-between gap-2 mb-0.5">
                        <span className="opacity-75 truncate">{c.name}</span>
                        <span className="font-semibold tabular-nums">{(c.weight * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--tint)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.weight * 100}%`, background: p.color }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: options + start */}
      <aside className="glass-card p-5 lg:sticky lg:top-10 space-y-5">
        <div>
          <h2 className="text-sm font-semibold mb-3">2 · Test options</h2>
          <dl className="text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <dt className="opacity-60 flex items-center gap-1.5"><ListChecks size={13} /> Question type</dt>
              <dd className="font-semibold">Multiple choice</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="opacity-60">Number of questions</dt>
              <dd className="font-semibold tabular-nums">{items || "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="opacity-60 flex items-center gap-1.5"><Clock size={13} /> Estimated time</dt>
              <dd className="font-semibold tabular-nums">{items ? `~${items * MINUTES_PER_ITEM} min` : "—"}</dd>
            </div>
          </dl>
          <label className="flex items-center justify-between gap-2 mt-4 text-xs cursor-pointer">
            <span className="flex items-center gap-1.5 opacity-80"><Shuffle size={13} /> Shuffle questions</span>
            <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} className="w-4 h-4 accent-[var(--accent)]" />
          </label>
        </div>

        {selected.length > 0 ? (
          <Link href={href} className="btn-primary w-full justify-center">
            Start test <ArrowRight size={16} />
          </Link>
        ) : (
          <span className="btn-primary w-full justify-center opacity-40 cursor-not-allowed">Select a pathway</span>
        )}

        <p className="text-[11px] opacity-55 leading-relaxed flex gap-2">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          Harder items count more. Competency weights come from AHP pairwise matrices, and every matrix passes the
          consistency check (CR &lt; 0.10). Progress is saved on this device.
        </p>
      </aside>
    </div>
  );
}
