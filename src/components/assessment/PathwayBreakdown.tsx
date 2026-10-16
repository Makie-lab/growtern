import PathwayIcon from "./PathwayIcon";
import { pathwayById } from "@/data/assessment/pathways";
import type { PathwayResult } from "@/lib/scoring";

export default function PathwayBreakdown({ result }: { result: PathwayResult }) {
  const pathway = pathwayById[result.pathway];
  return (
    <article className="glass-card p-5 sm:p-6">
      <header className="flex items-start gap-3 mb-5">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${pathway.color}1f`, color: pathway.color }}
        >
          <PathwayIcon icon={pathway.icon} size={20} />
        </span>
        <div className="flex-1">
          <h3 className="font-semibold">{result.name}</h3>
          <p className="text-[11px] opacity-50">
            {result.correct}/{result.total} correct ({result.rawScore}%) · CR {result.consistencyRatio.toFixed(3)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums" style={{ color: pathway.color }}>{result.ahpScore}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">{result.level}</p>
        </div>
      </header>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs min-w-[460px]">
          <thead>
            <tr className="text-left opacity-50 border-b border-[var(--hairline)]">
              <th className="py-2 px-1 font-medium">Competency</th>
              <th className="py-2 px-1 font-medium text-right">AHP weight</th>
              <th className="py-2 px-1 font-medium text-right">Correct</th>
              <th className="py-2 px-1 font-medium w-[30%]">Score</th>
              <th className="py-2 px-1 font-medium text-right">Weighted</th>
            </tr>
          </thead>
          <tbody>
            {result.competencies.map((c) => (
              <tr key={c.id} className="border-b border-[var(--hairline)] last:border-0">
                <td className="py-2 px-1">{c.name}</td>
                <td className="py-2 px-1 text-right tabular-nums">{(c.weight * 100).toFixed(1)}%</td>
                <td className="py-2 px-1 text-right tabular-nums">{c.correct}/{c.total}</td>
                <td className="py-2 px-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--tint)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: pathway.color }} />
                    </div>
                    <span className="tabular-nums w-8 text-right">{c.score}</span>
                  </div>
                </td>
                <td className="py-2 px-1 text-right tabular-nums font-semibold">{c.contribution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mt-5 mb-2">Career fit (AHP)</p>
      <ul className="space-y-1.5">
        {result.careers.map((c, i) => (
          <li key={c.id} className="flex items-center gap-3 text-xs">
            <span className={`flex-1 ${i === 0 ? "font-semibold" : "opacity-70"}`}>{c.title}</span>
            <div className="w-24 h-1.5 rounded-full bg-[var(--tint)] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${c.fit}%`, background: pathway.color, opacity: i === 0 ? 1 : 0.5 }} />
            </div>
            <span className="tabular-nums w-8 text-right">{c.fit}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
