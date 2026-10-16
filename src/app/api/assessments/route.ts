import { NextResponse } from "next/server";
import { getAccount } from "@/lib/account";
import { insertAttempt, listAttempts } from "@/lib/db";
import { sendResultEmail } from "@/lib/email";
import { scoreAssessment, type Answers } from "@/lib/scoring";
import { getQuestions } from "@/data/assessment";
import { isPathwayId, PATHWAY_IDS, type PathwayId } from "@/data/assessment/pathways";

export async function GET() {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ attempts: await listAttempts(account.userId) });
}

export async function POST(request: Request) {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { pathways: rawPathways, answers: rawAnswers, durationSeconds } = (body ?? {}) as {
    pathways?: unknown;
    answers?: unknown;
    durationSeconds?: unknown;
  };

  if (!Array.isArray(rawPathways) || rawPathways.length === 0) {
    return NextResponse.json({ error: "Choose at least one pathway" }, { status: 400 });
  }
  const requested = new Set(rawPathways.filter((p): p is string => typeof p === "string"));
  const pathways: PathwayId[] = PATHWAY_IDS.filter((id) => requested.has(id));
  if (pathways.length !== requested.size || ![...requested].every(isPathwayId)) {
    return NextResponse.json({ error: "Unknown pathway" }, { status: 400 });
  }

  if (!rawAnswers || typeof rawAnswers !== "object" || Array.isArray(rawAnswers)) {
    return NextResponse.json({ error: "Answers are required" }, { status: 400 });
  }

  const questions = getQuestions(pathways);
  const answers: Answers = {};
  for (const q of questions) {
    const value = (rawAnswers as Record<string, unknown>)[q.id];
    if (Number.isInteger(value) && (value as number) >= 0 && (value as number) < q.options.length) {
      answers[q.id] = value as number;
    }
  }
  if (Object.keys(answers).length === 0) {
    return NextResponse.json({ error: "Answer at least one question" }, { status: 400 });
  }

  const result = scoreAssessment(pathways, questions, answers);
  const duration =
    typeof durationSeconds === "number" && Number.isFinite(durationSeconds)
      ? Math.max(0, Math.min(Math.round(durationSeconds), 60 * 60 * 24))
      : null;

  const id = await insertAttempt({ userId: account.userId, pathways, answers, result, durationSeconds: duration });

  if (account.email) {
    await sendResultEmail(account.email, account.name, id, result).catch((err) =>
      console.error("[assessments] result email failed", err)
    );
  }

  return NextResponse.json({ id, result }, { status: 201 });
}
