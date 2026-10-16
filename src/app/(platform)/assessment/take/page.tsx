import { redirect } from "next/navigation";
import AssessmentRunner from "@/components/assessment/AssessmentRunner";
import { requireAccount } from "@/lib/account";
import { getQuestions, toPublic } from "@/data/assessment";
import { isPathwayId, pathways as allPathways } from "@/data/assessment/pathways";

export default async function TakeAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ pathways?: string }>;
}) {
  const { pathways: raw = "" } = await searchParams;
  const requested = new Set(raw.split(",").filter(isPathwayId));
  const selected = allPathways.filter((p) => requested.has(p.id));
  if (selected.length === 0) redirect("/assessment");

  await requireAccount(`/assessment/take?pathways=${selected.map((p) => p.id).join(",")}`);

  // Answer keys stay on the server — the client only receives prompts and options.
  const questions = toPublic(getQuestions(selected.map((p) => p.id)));
  const competencyNames = Object.fromEntries(
    selected.flatMap((p) => p.competencies.map((c) => [c.id, c.name]))
  );

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-16 max-w-5xl mx-auto">
      <AssessmentRunner
        pathways={selected.map((p) => ({ id: p.id, name: p.name, color: p.color, icon: p.icon }))}
        questions={questions}
        competencyNames={competencyNames}
      />
    </main>
  );
}
