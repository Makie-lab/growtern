import type { Pathway } from "@/data/assessment/pathways";

/** Saaty values as fractions: 0.333… → "1/3". */
function fmt(v: number): string {
  if (Math.abs(v - 1) < 1e-9) return "1";
  if (v > 1) return String(Math.round(v));
  return `1/${Math.round(1 / v)}`;
}

/** Short column labels: "Statistics & Probability" → "Statistics". */
function short(name: string) {
  return name.split(/ & | and |, /)[0];
}

export default function AhpMatrix({ pathway }: { pathway: Pathway }) {
  const { competencies, matrix, ahp, careers, color } = pathway;

  return (
    <div className="space-y-6">
      {/* Pairwise matrix */}
      <div>
        <h3 className="text-sm font-semibold mb-1">1 · Pairwise comparison matrix</h3>
        <p className="text-xs opacity-55 mb-3">
          Each cell rates how much more important the row competency is than the column one, on Saaty&apos;s 1–9 scale
          (1 = equal, 3 = moderately more, 5 = strongly more). Opposite cells are reciprocals.
        </p>
        <div className="overflow-x-auto">
          <table className="text-xs min-w-[640px] w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left font-medium opacity-50 p-2" />
                {competencies.map((c) => (
                  <th key={c.id} className="font-medium opacity-60 p-2 text-center" title={c.name}>{short(c.name)}</th>
                ))}
                <th className="font-semibold p-2 text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {competencies.map((row, i) => (
                <tr key={row.id} className="border-t border-[var(--hairline)]">
                  <th scope="row" className="text-left font-medium p-2">{row.name}</th>
                  {matrix[i].map((v, j) => (
                    <td
                      key={j}
                      className="p-2 text-center tabular-nums"
                      style={i === j ? { opacity: 0.35 } : v > 1 ? { color, fontWeight: 700 } : { opacity: 0.6 }}
                    >
                      {fmt(v)}
                    </td>
                  ))}
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[var(--tint)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${row.weight * 100}%`, background: color }} />
                      </div>
                      <span className="font-bold tabular-nums w-12">{(row.weight * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consistency */}
      <div>
        <h3 className="text-sm font-semibold mb-1">2 · Consistency check</h3>
        <p className="text-xs opacity-55 mb-3">
          The weights are the matrix&apos;s principal eigenvector. The judgements are only trusted if the consistency
          ratio (CR) is below 0.10.
        </p>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            ["λmax", ahp.lambdaMax.toFixed(3)],
            ["CI", ahp.consistencyIndex.toFixed(3)],
            ["CR", ahp.consistencyRatio.toFixed(3)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[var(--tint)] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-50">{label}</p>
              <p className="text-lg font-bold tabular-nums">{value}</p>
            </div>
          ))}
        </div>
        <p className={`text-xs mt-2 font-semibold ${ahp.isConsistent ? "text-emerald-600" : "text-red-500"}`}>
          {ahp.isConsistent ? "✓ Consistent (CR < 0.10)" : "✗ Inconsistent: revise the judgements"}
        </p>
      </div>

      {/* Career weights */}
      <div>
        <h3 className="text-sm font-semibold mb-1">3 · Career weights</h3>
        <p className="text-xs opacity-55 mb-3">
          Each career has its own pairwise matrix, so it values the competencies differently. Your career fit = Σ
          career weight × your competency score.
        </p>
        <div className="overflow-x-auto">
          <table className="text-xs min-w-[640px] w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left font-medium opacity-50 p-2">Career</th>
                {competencies.map((c) => (
                  <th key={c.id} className="font-medium opacity-60 p-2 text-center" title={c.name}>{short(c.name)}</th>
                ))}
                <th className="font-medium opacity-60 p-2 text-right">CR</th>
              </tr>
            </thead>
            <tbody>
              {careers.map((career) => {
                const top = Math.max(...career.weights);
                return (
                  <tr key={career.id} className="border-t border-[var(--hairline)]">
                    <th scope="row" className="text-left font-medium p-2">{career.title}</th>
                    {career.weights.map((w, j) => (
                      <td key={j} className="p-2 text-center tabular-nums" style={w === top ? { color, fontWeight: 700 } : { opacity: 0.7 }}>
                        {(w * 100).toFixed(0)}%
                      </td>
                    ))}
                    <td className="p-2 text-right tabular-nums opacity-60">{career.ahp.consistencyRatio.toFixed(3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
