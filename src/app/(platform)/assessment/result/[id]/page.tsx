import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, LayoutDashboard, RotateCcw, XCircle } from "lucide-react";
import CareerPathCard from "@/components/assessment/CareerPathCard";
import CareerPathFlow from "@/components/assessment/CareerPathFlow";
import PathwayBreakdown from "@/components/assessment/PathwayBreakdown";
import ReportButton from "@/components/assessment/ReportButton";
import ExpertCard from "@/components/experts/ExpertCard";
import { requireAccount } from "@/lib/account";
import { getAttempt } from "@/lib/db";
import { getQuestions } from "@/data/assessment";
import { pathwayById } from "@/data/assessment/pathways";
import { expertsFor } from "@/data/experts";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = await requireAccount(`/assessment/result/${id}`);
  const attempt = await getAttempt(account.userId, id);
  if (!attempt) notFound();

  const { result } = attempt;
  const primaryPathway = pathwayById[result.careerPath.primary.pathway];
  const questions = getQuestions(attempt.pathways);
  const minutes = attempt.duration_seconds ? Math.round(attempt.duration_seconds / 60) : null;

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-16 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity">
          <ArrowLeft size={16} /> My dashboard
        </Link>
        <p className="text-xs opacity-50">
          {new Date(attempt.created_at).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" })}
          {minutes !== null && ` · ${minutes} min`} · {questions.length} items
        </p>
      </div>

      <CareerPathCard result={result} />

      <section>
        <h2 className="text-xl font-bold mb-1">AHP hierarchy</h2>
        <p className="text-sm opacity-60 mb-4">
          Pathway → weighted competencies → careers. Edge thickness shows each competency&apos;s AHP weight; the animated
          path leads to your identified career.
        </p>
        <CareerPathFlow results={result.pathways} primaryCareerId={result.careerPath.primary.id} />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Pathway breakdown</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {result.pathways.map((p) => (
            <PathwayBreakdown key={p.pathway} result={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-1">Talk to an expert in {primaryPathway.name}</h2>
        <p className="text-sm opacity-60 mb-4">Philippines-based practitioners who can review this result with you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {expertsFor(primaryPathway.id).map((e) => (
            <ExpertCard key={e.id} expert={e} attemptId={attempt.id} color={primaryPathway.color} />
          ))}
        </div>
        <Link href="/experts" className="inline-block text-xs opacity-60 hover:opacity-100 mt-3">See experts for every pathway →</Link>
      </section>

      <div className="flex flex-wrap gap-3">
        <ReportButton attemptId={attempt.id} initialUrl={attempt.report_url ? `/reports/${attempt.id}` : null} />
        <Link href="/assessment" className="btn-secondary text-sm px-4 py-2 inline-flex items-center gap-2">
          <RotateCcw size={16} /> Take another assessment
        </Link>
        <Link href="/dashboard" className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-2">
          <LayoutDashboard size={16} /> Go to dashboard
        </Link>
      </div>

      <section>
        <details className="glass-card p-5">
          <summary className="cursor-pointer font-semibold">Review answers ({questions.length} items)</summary>
          <ol className="mt-4 space-y-3">
            {questions.map((q, i) => {
              const picked = attempt.answers[q.id];
              const correct = picked === q.answer;
              return (
                <li key={q.id} className="text-xs border-b border-[var(--hairline)] pb-3 last:border-0">
                  <p className="font-medium flex gap-2">
                    {correct ? (
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{i + 1}. {q.prompt}</span>
                  </p>
                  <p className="ml-6 mt-1 opacity-70">
                    Your answer: {picked === undefined ? <em>unanswered</em> : q.options[picked]}
                    {!correct && <> · Correct: <strong>{q.options[q.answer]}</strong></>}
                  </p>
                </li>
              );
            })}
          </ol>
        </details>
      </section>
    </main>
  );
}
