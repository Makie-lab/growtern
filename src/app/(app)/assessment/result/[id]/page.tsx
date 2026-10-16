import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, RefreshCw, RotateCcw } from "lucide-react";
import AnswerReview, { type ReviewItem } from "@/components/assessment/AnswerReview";
import CareerPathCard from "@/components/assessment/CareerPathCard";
import CareerPathFlow from "@/components/assessment/CareerPathFlow";
import PathwayBreakdown from "@/components/assessment/PathwayBreakdown";
import ExpertCard from "@/components/experts/ExpertCard";
import { requireAccount } from "@/lib/account";
import { getAttempt } from "@/lib/db";
import { getQuestions } from "@/data/assessment";
import { pathwayById } from "@/data/assessment/pathways";
import { expertsFor } from "@/data/experts";

function formatDuration(seconds: number | null) {
  if (seconds === null) return "—";
  const m = Math.floor(seconds / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m ${seconds % 60}s`;
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = await requireAccount(`/assessment/result/${id}`);
  const attempt = await getAttempt(account.userId, id);
  if (!attempt) notFound();

  const { result } = attempt;
  const primaryPathway = pathwayById[result.careerPath.primary.pathway];
  const questions = getQuestions(attempt.pathways);
  const total = questions.length;
  const correct = result.pathways.reduce((n, p) => n + p.correct, 0);
  const skipped = questions.filter((q) => attempt.answers[q.id] === undefined).length;
  const incorrect = total - correct - skipped;
  const percent = Math.round((correct / total) * 100);
  const competencyNames = new Map(
    attempt.pathways.flatMap((p) => pathwayById[p].competencies.map((c) => [c.id, c.name] as const))
  );

  const review: ReviewItem[] = questions.map((q, i) => ({
    id: q.id,
    number: i + 1,
    prompt: q.prompt,
    competency: competencyNames.get(q.competency) ?? "",
    options: q.options,
    answer: q.answer,
    picked: attempt.answers[q.id] ?? null,
  }));

  const retakeHref = `/assessment/take?pathways=${attempt.pathways.join(",")}`;
  const ring = `conic-gradient(var(--accent) ${percent * 3.6}deg, var(--tint) 0deg)`;

  return (
    <div className="space-y-8">
      <Link href="/assessment" className="inline-flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity">
        <ArrowLeft size={16} /> Assessment
      </Link>

      {/* Test results summary */}
      <section className="glass-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-28 h-28 rounded-full p-2 flex-shrink-0" style={{ background: ring }} aria-label={`${percent}% correct`}>
            <div className="w-full h-full rounded-full bg-[var(--background)] flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums">{percent}%</span>
              <span className="text-[10px] opacity-50">correct</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="eyebrow mb-1">Test results</p>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {attempt.pathways.length === 4 ? "Full assessment" : attempt.pathways.map((p) => pathwayById[p].name).join(" + ")}
            </h1>
            <p className="text-xs opacity-55">
              {new Date(attempt.created_at).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" })}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
              {[
                ["AHP score", String(result.overallScore), ""],
                ["Correct", String(correct), "text-emerald-600"],
                ["Incorrect", String(incorrect), "text-red-500"],
                ["Skipped", String(skipped), ""],
                ["Time", formatDuration(attempt.duration_seconds), ""],
              ].map(([label, value, cls]) => (
                <div key={label} className="rounded-xl bg-[var(--tint)] px-3 py-2">
                  <p className={`text-lg font-bold tabular-nums ${cls}`}>{value}</p>
                  <p className="text-[10px] opacity-55">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-[var(--hairline)]">
          <Link href={retakeHref} className="btn-primary text-sm px-4 py-2">
            <RotateCcw size={15} /> Retake this test
          </Link>
          <Link href={`${retakeHref}&shuffle=1`} className="btn-secondary text-sm px-4 py-2">
            <RefreshCw size={15} /> Retake shuffled
          </Link>
          <Link href="/assessment" className="btn-secondary text-sm px-4 py-2">New test</Link>
          <a href={`/reports/${attempt.id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm px-4 py-2">
            <FileText size={15} /> Printable report
          </a>
        </div>
      </section>

      <CareerPathCard result={result} />

      <section>
        <h2 className="text-lg font-bold mb-4">AHP-weighted competency breakdown</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {result.pathways.map((p) => (
            <PathwayBreakdown key={p.pathway} result={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-1">AHP hierarchy</h2>
        <p className="text-sm opacity-60 mb-4">
          Pathway → weighted competencies → careers. Thicker edges carry more AHP weight; the animated path leads to your
          identified career.
        </p>
        <CareerPathFlow results={result.pathways} primaryCareerId={result.careerPath.primary.id} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-1">Talk to an expert in {primaryPathway.name}</h2>
        <p className="text-sm opacity-60 mb-4">Philippines-based practitioners who can review this result with you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {expertsFor(primaryPathway.id).map((e) => (
            <ExpertCard key={e.id} expert={e} attemptId={attempt.id} color={primaryPathway.color} />
          ))}
        </div>
      </section>

      <AnswerReview items={review} />
    </div>
  );
}
