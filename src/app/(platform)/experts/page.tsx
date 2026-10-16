import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PathwayIcon from "@/components/assessment/PathwayIcon";
import ExpertCard from "@/components/experts/ExpertCard";
import { pathways } from "@/data/assessment/pathways";
import { expertsFor } from "@/data/experts";

export const metadata: Metadata = {
  title: "Experts in the Philippines — GrowTern",
  description: "Two Philippines-based experts for each pathway: Data Analytics, Software Development, Networking and Cybersecurity.",
};

export default function ExpertsPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-16 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Expert guidance"
        title="Experts in the"
        accent="Philippines"
        description="Two practitioners per pathway. Send a consultation request from your account and they'll reply by email."
      />
      <div className="space-y-12">
        {pathways.map((p) => (
          <section key={p.id} id={p.id} className="section-scroll">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${p.color}1f`, color: p.color }}>
                <PathwayIcon icon={p.icon} size={16} />
              </span>
              {p.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {expertsFor(p.id).map((e) => (
                <ExpertCard key={e.id} expert={e} color={p.color} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
