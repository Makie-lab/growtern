"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, Info } from "lucide-react";
import PathwayIcon from "./PathwayIcon";
import { ITEMS_PER_PATHWAY, type Pathway, type PathwayId } from "@/data/assessment/pathways";

const MINUTES_PER_ITEM = 1;

export default function PathwayPicker({ pathways }: { pathways: Pathway[] }) {
  const [selected, setSelected] = useState<PathwayId[]>([]);
  const allSelected = selected.length === pathways.length;
  const items = selected.length * ITEMS_PER_PATHWAY;

  const toggle = (id: PathwayId) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  // Keep canonical pathway order in the URL.
  const query = pathways.filter((p) => selected.includes(p.id)).map((p) => p.id).join(",");

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pathways.map((p) => {
          const active = selected.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              aria-pressed={active}
              className={`glass-card p-5 sm:p-6 text-left transition-all ${
                active ? "ring-2 ring-[var(--accent)]" : "glass-hover"
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${p.color}1f`, color: p.color }}
                >
                  <PathwayIcon icon={p.icon} size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <p className="text-xs opacity-55 leading-relaxed">{p.description}</p>
                </div>
                <span
                  className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    active ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--background)]" : "border-[var(--hairline-strong)]"
                  }`}
                >
                  {active && <Check size={14} strokeWidth={3} />}
                </span>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-2">
                AHP competency weights
              </p>
              <ul className="space-y-1.5 mb-4">
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

              <div className="flex flex-wrap items-center gap-2 text-[11px] pt-3 border-t border-[var(--hairline)]">
                <span className="px-2 py-0.5 rounded-full accent-bg accent-text font-semibold">{ITEMS_PER_PATHWAY} items</span>
                <span className="opacity-50">Careers: {p.careers.map((c) => c.title).join(" · ")}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-4 mt-8 z-20">
        <div className="glass-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {selected.length === 0
                ? "Select one or more pathways"
                : `${selected.length} pathway${selected.length > 1 ? "s" : ""} · ${items} items`}
            </p>
            <p className="text-[11px] opacity-50 flex items-center gap-1">
              <Clock size={12} /> About {items * MINUTES_PER_ITEM} minutes · progress is saved on this device
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelected(allSelected ? [] : pathways.map((p) => p.id))}
            className="btn-secondary text-sm px-5 py-2.5"
          >
            {allSelected ? "Clear selection" : `Full assessment (${pathways.length * ITEMS_PER_PATHWAY} items)`}
          </button>
          {selected.length > 0 ? (
            <Link href={`/assessment/take?pathways=${query}`} className="btn-primary text-sm px-5 py-2.5 inline-flex items-center justify-center gap-2">
              Start assessment <ArrowRight size={16} />
            </Link>
          ) : (
            <span className="btn-primary text-sm px-5 py-2.5 opacity-40 cursor-not-allowed text-center">Start assessment</span>
          )}
        </div>
      </div>

      <div className="mt-10 glass-card-subtle p-5 text-xs leading-relaxed opacity-80 flex gap-3">
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <p>
          <strong>How scoring works.</strong> Each competency score is difficulty-weighted (harder items count more).
          Competency weights come from Saaty pairwise comparison matrices — every matrix passes the AHP consistency check
          (CR &lt; 0.10). Your pathway score is Σ weight × competency score, and each career has its own AHP weights, so
          the career with the highest weighted fit becomes your identified career path.
        </p>
      </div>
    </div>
  );
}
