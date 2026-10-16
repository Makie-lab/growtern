import { redirect } from "next/navigation";
import AssessmentRunner from "@/components/assessment/AssessmentRunner";
import { requireAccount } from "@/lib/account";
import { getQuestions, toPublic } from "@/data/assessment";
import { isPathwayId, pathways as allPathways } from "@/data/assessment/pathways";

export default async function TakeAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ pathways?: string; shuffle?: string }>;
}) {
  const { pathways: raw = "", shuffle } = await searchParams;
  const requested = new Set(raw.split(",").filter(isPathwayId));
  const selected = allPathways.filter((p) => requested.has(p.id));
  if (selected.length === 0) redirect("/assessment");

  const query = `pathways=${selected.map((p) => p.id).join(",")}${shuffle === "1" ? "&shuffle=1" : ""}`;
  await requireAccount(`/assessment/take?${query}`);

  // Answer keys stay on the server — the client only receives prompts and options.
  const questions = toPublic(getQuestions(selected.map((p) => p.id)));
  const competencyNames = Object.fromEntries(
    selected.flatMap((p) => p.competencies.map((c) => [c.id, c.name]))
  );

  return (
    <AssessmentRunner
      pathways={selected.map((p) => ({ id: p.id, name: p.name, color: p.color, icon: p.icon }))}
      questions={questions}
      competencyNames={competencyNames}
      shuffle={shuffle === "1"}
    />
  );
}
