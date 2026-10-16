import { listAttemptResults } from "@/lib/db";
import { combineLatest, type AssessmentResult, type PathwayResult } from "@/lib/scoring";
import { pathways, type PathwayId } from "@/data/assessment/pathways";

export interface CareerProfile {
  /** Most recent result for each pathway the user has taken. */
  latest: Partial<Record<PathwayId, PathwayResult>>;
  /** Career path computed across those latest results (null if nothing taken yet). */
  combined: AssessmentResult | null;
}

export async function getCareerProfile(userId: string): Promise<CareerProfile> {
  const results = await listAttemptResults(userId); // newest first
  const latest: Partial<Record<PathwayId, PathwayResult>> = {};
  for (const r of results) for (const p of r.pathways) latest[p.pathway] ??= p;
  const ordered = pathways.map((p) => latest[p.id]).filter((p): p is PathwayResult => Boolean(p));
  return { latest, combined: combineLatest(ordered) };
}
