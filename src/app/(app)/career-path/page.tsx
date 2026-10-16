import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AhpMatrix from "@/components/assessment/AhpMatrix";
import CareerPathCard from "@/components/assessment/CareerPathCard";
import CareerPathFlow from "@/components/assessment/CareerPathFlow";
import PathwayIcon from "@/components/assessment/PathwayIcon";
import { getAccount } from "@/lib/account";
import { getCareerProfile } from "@/lib/careerProfile";
import { isPathwayId, pathwayById, pathways } from "@/data/assessment/pathways";

export const metadata: Metadata = { title: "Career path & AHP — GrowTern" };

export default async function CareerPathPage({ searchParams }: { searchParams: Promise<{ pathway?: string }> }) {
  const { pathway: requested } = await searchParams;
  const account = await getAccount();
  const profile = account ? await getCareerProfile(account.userId) : null;
  const combined = profile?.combined ?? null;

  const activeId =
    requested && isPathwayId(requested) ? requested : combined?.careerPath.primary.pathway ?? pathways[0].id;
  const active = pathwayById[activeId];

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Career path identification"
        title="Your"
        accent="career path"
        description="GrowTern ranks 12 IT careers using AHP-weighted competency scores from your latest test in each pathway."
      />

      {/* User's identified career path */}
      {combined ? (
        <section className="space-y-5">
          <CareerPathCard result={combined} heading="Identified from your latest results" />
          <div>
            <h2 className="text-lg font-bold mb-1">Career ranking</h2>
            <p className="text-xs opacity-55 mb-3">Every career across the pathways you&apos;ve taken, by AHP fit.</p>
            <div className="glass-card divide-y divide-[var(--hairline)]">
              {combined.pathways
                .flatMap((p) => p.careers)
                .sort((a, b) => b.fit - a.fit)
                .map((c, i) => {
                  const p = pathwayById[c.pathway];
                  return (
                    <div key={c.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                      <span className="w-6 text-xs font-bold opacity-40 tabular-nums">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`truncate ${i === 0 ? "font-semibold" : ""}`}>{c.title}</p>
                        <p className="text-[11px] opacity-50">{p.name}</p>
                      </div>
                      <div className="w-28 h-1.5 rounded-full bg-[var(--tint)] overflow-hidden hidden sm:block">
                        <div className="h-full rounded-full" style={{ width: `${c.fit}%`, background: p.color }} />
                      </div>
                      <span className="font-bold tabular-nums w-10 text-right">{c.fit}</span>
                    </div>
                  );
                })}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-3">AHP hierarchy</h2>
            <CareerPathFlow results={combined.pathways} primaryCareerId={combined.careerPath.primary.id} />
          </div>
        </section>
      ) : (
        <section className="glass-card p-8 text-center">
          <Target size={32} className="mx-auto mb-3 opacity-50" />
          <h2 className="text-lg font-semibold mb-1">No career path yet</h2>
          <p className="text-sm opacity-60 mb-5">
            {account ? "Take at least one pathway test to identify your career path." : "Create a personal account and take a pathway test to identify your career path."}
          </p>
          <Link href={account ? "/assessment" : "/sign-up?redirect_url=%2Fassessment"} className="btn-primary text-sm">
            {account ? "Start the assessment" : "Create personal account"} <ArrowRight size={16} />
          </Link>
        </section>
      )}

      {/* AHP explainer */}
      <section id="ahp" className="section-scroll">
        <h2 className="text-lg font-bold mb-1">How the AHP weighting works</h2>
        <p className="text-sm opacity-60 mb-4 max-w-2xl">
          The Analytic Hierarchy Process turns expert pairwise judgements into weights. Choose a pathway to see its
          matrix, consistency check, and the weights each career uses.
        </p>
        <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Pathway">
          {pathways.map((p) => (
            <Link
              key={p.id}
              href={`/career-path?pathway=${p.id}#ahp`}
              role="tab"
              aria-selected={p.id === activeId}
              className={`chip ${p.id === activeId ? "chip--active" : ""}`}
              scroll={false}
            >
              <PathwayIcon icon={p.icon} size={14} /> {p.name}
            </Link>
          ))}
        </div>
        <div className="glass-card p-5 sm:p-6">
          <AhpMatrix pathway={active} />
        </div>
      </section>
    </div>
  );
}
