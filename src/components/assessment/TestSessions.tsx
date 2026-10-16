import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pathwayById } from "@/data/assessment/pathways";
import type { AttemptSummary } from "@/lib/db";

/** Previous test sessions: score, correct, incorrect, skipped, date. */
export default function TestSessions({ attempts, title = "Previous test sessions" }: { attempts: AttemptSummary[]; title?: string }) {
  return (
    <section className="glass-card p-5">
      <h2 className="font-semibold mb-3">{title}</h2>
      {attempts.length === 0 ? (
        <p className="text-sm opacity-50">Your submitted tests will appear here.</p>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[560px]">
            <thead>
              <tr className="text-left opacity-50 border-b border-[var(--hairline)]">
                <th className="py-2 px-1 font-medium">Test</th>
                <th className="py-2 px-1 font-medium text-right">AHP score</th>
                <th className="py-2 px-1 font-medium text-right text-emerald-600">Correct</th>
                <th className="py-2 px-1 font-medium text-right text-red-500">Incorrect</th>
                <th className="py-2 px-1 font-medium text-right">Skipped</th>
                <th className="py-2 px-1 font-medium text-right">Date</th>
                <th className="py-2 px-1" />
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id} className="border-b border-[var(--hairline)] last:border-0">
                  <td className="py-2.5 px-1">
                    <Link href={`/assessment/result/${a.id}`} className="font-medium hover:underline">
                      {a.pathways.length === 4 ? "Full assessment" : a.pathways.map((id) => pathwayById[id].name).join(", ")}
                    </Link>
                    <p className="text-[10px] opacity-50">{a.career_title}</p>
                  </td>
                  <td className="py-2.5 px-1 text-right font-bold tabular-nums">{a.overall_score}</td>
                  <td className="py-2.5 px-1 text-right tabular-nums">{a.correct}</td>
                  <td className="py-2.5 px-1 text-right tabular-nums">{a.total - a.correct - a.skipped}</td>
                  <td className="py-2.5 px-1 text-right tabular-nums opacity-60">{a.skipped}</td>
                  <td className="py-2.5 px-1 text-right opacity-60 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium" })}
                  </td>
                  <td className="py-2.5 px-1 text-right">
                    <Link href={`/assessment/result/${a.id}`} aria-label="View result" className="opacity-40 hover:opacity-100">
                      <ArrowRight size={14} className="inline" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
