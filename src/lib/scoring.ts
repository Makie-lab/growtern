import { weightedScore } from "@/lib/ahp";
import { pathwayById, type PathwayId } from "@/data/assessment/pathways";
import type { Question } from "@/data/assessment/types";

export type ProficiencyLevel = "Beginner" | "Developing" | "Proficient" | "Advanced";

export interface CompetencyResult {
  id: string;
  name: string;
  /** AHP weight of this competency within the pathway (0–1). */
  weight: number;
  correct: number;
  total: number;
  /** Difficulty-weighted score, 0–100. */
  score: number;
  /** weight × score — this competency's share of the pathway AHP score. */
  contribution: number;
}

export interface CareerFit {
  id: string;
  title: string;
  description: string;
  pathway: PathwayId;
  /** Σ career-weightᵢ × competency-scoreᵢ, 0–100. */
  fit: number;
}

export interface PathwayResult {
  pathway: PathwayId;
  name: string;
  correct: number;
  total: number;
  /** Plain percentage correct. */
  rawScore: number;
  /** AHP weighted competency score, 0–100. */
  ahpScore: number;
  level: ProficiencyLevel;
  consistencyRatio: number;
  competencies: CompetencyResult[];
  careers: CareerFit[];
}

export interface CareerPath {
  primary: CareerFit;
  alternatives: CareerFit[];
  /** Fit gap between the top two careers; small gaps mean a close call. */
  margin: number;
  confidence: "High" | "Moderate" | "Low";
}

export interface AssessmentResult {
  pathways: PathwayResult[];
  overallScore: number;
  careerPath: CareerPath;
  strengths: string[];
  gaps: string[];
}

export type Answers = Record<string, number>;

const round1 = (n: number) => Math.round(n * 10) / 10;

export function proficiencyLevel(score: number): ProficiencyLevel {
  if (score >= 85) return "Advanced";
  if (score >= 70) return "Proficient";
  if (score >= 50) return "Developing";
  return "Beginner";
}

export function scorePathway(pathwayId: PathwayId, questions: Question[], answers: Answers): PathwayResult {
  const pathway = pathwayById[pathwayId];
  const items = questions.filter((q) => q.pathway === pathwayId);

  const competencies: CompetencyResult[] = pathway.competencies.map((c) => {
    const compItems = items.filter((q) => q.competency === c.id);
    let earned = 0;
    let possible = 0;
    let correct = 0;
    for (const q of compItems) {
      possible += q.difficulty;
      if (answers[q.id] === q.answer) {
        earned += q.difficulty;
        correct += 1;
      }
    }
    const score = possible === 0 ? 0 : (earned / possible) * 100;
    return {
      id: c.id,
      name: c.name,
      weight: c.weight,
      correct,
      total: compItems.length,
      score: round1(score),
      contribution: round1(c.weight * score),
    };
  });

  const scores = competencies.map((c) => c.score);
  const ahpScore = round1(weightedScore(pathway.ahp.weights, scores));
  const correct = competencies.reduce((s, c) => s + c.correct, 0);
  const total = competencies.reduce((s, c) => s + c.total, 0);

  const careers: CareerFit[] = pathway.careers
    .map((career) => ({
      id: career.id,
      title: career.title,
      description: career.description,
      pathway: pathwayId,
      fit: round1(weightedScore(career.weights, scores)),
    }))
    .sort((a, b) => b.fit - a.fit);

  return {
    pathway: pathwayId,
    name: pathway.name,
    correct,
    total,
    rawScore: total === 0 ? 0 : round1((correct / total) * 100),
    ahpScore,
    level: proficiencyLevel(ahpScore),
    consistencyRatio: pathway.ahp.consistencyRatio,
    competencies,
    careers,
  };
}

/** Rank every career across the given pathway results and pick the best fit. */
export function identifyCareerPath(results: PathwayResult[]): CareerPath {
  const ahpByPathway = new Map(results.map((r) => [r.pathway, r.ahpScore]));
  const ranked = results
    .flatMap((r) => r.careers)
    .sort((a, b) => b.fit - a.fit || (ahpByPathway.get(b.pathway) ?? 0) - (ahpByPathway.get(a.pathway) ?? 0));

  const [primary, ...rest] = ranked;
  const margin = rest.length ? round1(primary.fit - rest[0].fit) : primary.fit;
  const confidence = margin >= 8 ? "High" : margin >= 3 ? "Moderate" : "Low";
  return { primary, alternatives: rest.slice(0, 3), margin, confidence };
}

function summarise(results: PathwayResult[]): Omit<AssessmentResult, "pathways"> {
  const allCompetencies = results.flatMap((r) => r.competencies.map((c) => ({ ...c, pathway: r.name })));
  const sorted = [...allCompetencies].sort((a, b) => b.score - a.score);
  const label = (c: (typeof allCompetencies)[number]) =>
    results.length > 1 ? `${c.name} (${c.pathway})` : c.name;

  return {
    overallScore: round1(results.reduce((s, r) => s + r.ahpScore, 0) / results.length),
    careerPath: identifyCareerPath(results),
    strengths: sorted.slice(0, 2).map(label),
    gaps: sorted.slice(-2).reverse().map(label),
  };
}

export function scoreAssessment(pathways: PathwayId[], questions: Question[], answers: Answers): AssessmentResult {
  const results = pathways.map((p) => scorePathway(p, questions, answers));
  return { pathways: results, ...summarise(results) };
}

/** Combine the latest result of each pathway (e.g. across several attempts) into one profile. */
export function combineLatest(results: PathwayResult[]): AssessmentResult | null {
  if (results.length === 0) return null;
  return { pathways: results, ...summarise(results) };
}
