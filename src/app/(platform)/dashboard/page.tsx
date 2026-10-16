import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Mail } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CareerPathCard from "@/components/assessment/CareerPathCard";
import PathwayIcon from "@/components/assessment/PathwayIcon";
import ProfileForm from "@/components/account/ProfileForm";
import { requireAccount } from "@/lib/account";
import { listAttemptResults, listAttempts, listExpertRequests } from "@/lib/db";
import { combineLatest, type PathwayResult } from "@/lib/scoring";
import { pathways, pathwayById } from "@/data/assessment/pathways";
import { expertById } from "@/data/experts";

export const metadata: Metadata = { title: "My dashboard — GrowTern" };

export default async function DashboardPage() {
  const account = await requireAccount("/dashboard");
  const [attempts, results, requests] = await Promise.all([
    listAttempts(account.userId),
    listAttemptResults(account.userId),
    listExpertRequests(account.userId),
  ]);

  // Latest result per pathway → combined career profile across all assessments taken.
  const latest = new Map<string, PathwayResult>();
  for (const r of results) for (const p of r.pathways) if (!latest.has(p.pathway)) latest.set(p.pathway, p);
  const combined = combineLatest(pathways.map((p) => latest.get(p.id)).filter((p): p is PathwayResult => Boolean(p)));

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-16 max-w-6xl mx-auto space-y-10">
      <PageHeader
        eyebrow="Personal account"
        title={`Hi, ${account.name?.split(" ")[0] ?? "there"}`}
        description="Your profile, assessment history and identified career path."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          {combined ? (
            <CareerPathCard result={combined} heading="Career path across your latest results" />
          ) : (
            <div className="glass-card p-8 text-center">
              <ClipboardCheck size={32} className="mx-auto mb-3 opacity-50" />
              <h2 className="text-lg font-semibold mb-1">No assessments yet</h2>
              <p className="text-sm opacity-60 mb-5">Take one pathway (50 items) or all four (200 items) to identify your career path.</p>
              <Link href="/assessment" className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2">
                Start an assessment <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Pathway coverage */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pathways.map((p) => {
              const r = latest.get(p.id);
              return (
                <Link
                  key={p.id}
                  href={`/assessment/take?pathways=${p.id}`}
                  className="glass-card p-4 glass-hover"
                >
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${p.color}1f`, color: p.color }}>
                    <PathwayIcon icon={p.icon} size={16} />
                  </span>
                  <p className="text-xs font-semibold">{p.name}</p>
                  {r ? (
                    <p className="text-[11px] opacity-60 tabular-nums">{r.ahpScore}/100 · {r.level}</p>
                  ) : (
                    <p className="text-[11px] opacity-40">Not taken yet</p>
                  )}
                </Link>
              );
            })}
          </section>

          {/* History */}
          <section className="glass-card p-5">
            <h2 className="font-semibold mb-3">Assessment history</h2>
            {attempts.length === 0 ? (
              <p className="text-sm opacity-50">Your submitted assessments will appear here.</p>
            ) : (
              <ul className="divide-y divide-[var(--hairline)]">
                {attempts.map((a) => (
                  <li key={a.id}>
                    <Link href={`/assessment/result/${a.id}`} className="flex items-center gap-3 py-3 text-sm hover:opacity-80">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{a.career_title}</p>
                        <p className="text-[11px] opacity-50 truncate">
                          {a.pathways.map((p) => pathwayById[p]?.name ?? p).join(", ")} ·{" "}
                          {new Date(a.created_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium" })}
                        </p>
                      </div>
                      <span className="font-bold tabular-nums">{a.overall_score}</span>
                      <ArrowRight size={14} className="opacity-40" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <ProfileForm
            email={account.email}
            isNewAccount={Date.now() - new Date(account.profile.created_at).getTime() < 15 * 60 * 1000}
            initial={{
              userType: account.profile.user_type,
              schoolOrCompany: account.profile.school_or_company ?? "",
              city: account.profile.city ?? "",
            }}
          />

          <section className="glass-card p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Mail size={16} /> Expert requests</h2>
            {requests.length === 0 ? (
              <p className="text-xs opacity-50">
                No requests yet. <Link href="/experts" className="underline">Browse experts</Link>
              </p>
            ) : (
              <ul className="space-y-2 text-xs">
                {requests.map((r) => (
                  <li key={r.id} className="flex justify-between gap-2">
                    <span className="truncate">{expertById.get(r.expert_id)?.name ?? r.expert_id}</span>
                    <span className="capitalize opacity-60">{r.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
