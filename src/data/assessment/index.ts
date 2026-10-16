import { dataAnalyticsQuestions } from "./questions/data-analytics";
import { softwareDevelopmentQuestions } from "./questions/software-development";
import { networkingQuestions } from "./questions/networking";
import { cybersecurityQuestions } from "./questions/cybersecurity";
import type { PathwayId } from "./pathways";
import type { PublicQuestion, Question } from "./types";

/**
 * 200-item question bank (4 pathways × 5 competencies × 10 items).
 * Contains answer keys — import only from server code.
 */
export const questionBank: Record<PathwayId, Question[]> = {
  "data-analytics": dataAnalyticsQuestions,
  "software-development": softwareDevelopmentQuestions,
  networking: networkingQuestions,
  cybersecurity: cybersecurityQuestions,
};

export const allQuestions: Question[] = Object.values(questionBank).flat();

export const questionById: Map<string, Question> = new Map(allQuestions.map((q) => [q.id, q]));

export function getQuestions(pathways: PathwayId[]): Question[] {
  return pathways.flatMap((p) => questionBank[p]);
}

export function toPublic(questions: Question[]): PublicQuestion[] {
  return questions.map(({ answer: _answer, ...rest }) => {
    void _answer;
    return rest;
  });
}
