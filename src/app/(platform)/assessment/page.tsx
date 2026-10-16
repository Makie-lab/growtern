import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PathwayPicker from "@/components/assessment/PathwayPicker";
import { pathways, TOTAL_ITEMS, ITEMS_PER_PATHWAY } from "@/data/assessment/pathways";

export const metadata: Metadata = {
  title: "Competency Assessment — GrowTern",
  description: "A 200-item, AHP-weighted competency assessment across Data Analytics, Software Development, Networking and Cybersecurity.",
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-16 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Competency assessment"
        title="Find your"
        accent="career path"
        description={
          <>
            {TOTAL_ITEMS} items across four pathways ({ITEMS_PER_PATHWAY} each). Take one pathway at a time or all of
            them. Your score is weighted with the Analytic Hierarchy Process (AHP), so the competencies that matter most
            for each pathway — and each career — count the most.
          </>
        }
      />
      <PathwayPicker pathways={pathways} />
    </main>
  );
}
