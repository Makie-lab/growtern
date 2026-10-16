import type { PathwayId } from "./pathways";

export type Difficulty = 1 | 2 | 3;

/** Authoring format: [difficulty, prompt, correct answer, [3 distractors]] */
export type RawItem = [Difficulty, string, string, [string, string, string]];

export interface Question {
  id: string;
  pathway: PathwayId;
  competency: string;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  /** Index of the correct option. Never send this to the client. */
  answer: number;
}

/** Client-safe question (no answer key). */
export type PublicQuestion = Omit<Question, "answer">;

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic option shuffle so answer positions are spread but stable per item id. */
function shuffle<T>(items: T[], seed: string): T[] {
  const out = [...items];
  let s = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildBank(pathway: PathwayId, items: Record<string, RawItem[]>): Question[] {
  return Object.entries(items).flatMap(([competency, list]) =>
    list.map(([difficulty, prompt, correct, distractors], i) => {
      const id = `${competency}-${String(i + 1).padStart(2, "0")}`;
      const options = shuffle([correct, ...distractors], id);
      return { id, pathway, competency, difficulty, prompt, options, answer: options.indexOf(correct) };
    })
  );
}
