import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { pathwayById } from "@/data/assessment/pathways";
import type { AssessmentResult } from "@/lib/scoring";

export default function CareerPathCard({ result, heading = "Your identified career path" }: { result: AssessmentResult; heading?: string }) {
  const { primary, alternatives, confidence, margin } = result.careerPath;
  const pathway = pathwayById[primary.pathway];

  return (
    <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: pathway.color }}
      />
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
        <div>
          <p className="eyebrow mb-2 flex items-center gap-1.5">
            <Target size={14} /> {heading}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: pathway.color }}>
            {primary.title}
          </h2>
          <p className="text-sm opacity-60 mt-2 max-w-xl">{primary.description}</p>
          <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
            <span className="px-2 py-0.5 rounded-full accent-bg accent-text font-semibold">{pathway.name}</span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--tint)]">AHP fit {primary.fit}/100</span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--tint)]">
              {confidence} confidence (+{margin} vs next)
            </span>
          </div>
          {alternatives.length > 0 && (
            <p className="text-xs opacity-60 mt-4">
              Also a good fit: {alternatives.map((a) => `${a.title} (${a.fit})`).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex md:flex-col gap-6 md:text-right">
          <div>
            <p className="text-4xl font-bold tabular-nums">{result.overallScore}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-50">Overall AHP score</p>
          </div>
        </div>
      </div>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[var(--hairline)] text-xs">
        <div>
          <p className="font-semibold mb-1 flex items-center gap-1.5 text-emerald-600">
            <TrendingUp size={14} /> Strengths
          </p>
          <p className="opacity-70">{result.strengths.join(" · ")}</p>
        </div>
        <div>
          <p className="font-semibold mb-1 flex items-center gap-1.5 text-amber-600">
            <TrendingDown size={14} /> Focus areas
          </p>
          <p className="opacity-70">{result.gaps.join(" · ")}</p>
        </div>
      </div>
    </div>
  );
}
