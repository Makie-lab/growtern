import { NextResponse } from "next/server";
import { getAccount } from "@/lib/account";
import { getAttempt, insertExpertRequest } from "@/lib/db";
import { sendExpertRequestEmails } from "@/lib/email";
import { expertById } from "@/data/experts";

const MODES = new Set(["Online", "In-person"]);

export async function POST(request: Request) {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!account.email) return NextResponse.json({ error: "Add an email address to your account first" }, { status: 400 });

  const body = (await request.json().catch(() => null)) as
    | { expertId?: unknown; message?: unknown; preferredMode?: unknown; attemptId?: unknown }
    | null;

  const expert = typeof body?.expertId === "string" ? expertById.get(body.expertId) : undefined;
  if (!expert) return NextResponse.json({ error: "Unknown expert" }, { status: 400 });

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json({ error: "Message must be 10–2000 characters" }, { status: 400 });
  }

  const preferredMode = typeof body?.preferredMode === "string" ? body.preferredMode : "Online";
  if (!MODES.has(preferredMode) || !expert.sessionModes.includes(preferredMode as "Online" | "In-person")) {
    return NextResponse.json({ error: `${expert.name} doesn't offer ${preferredMode} sessions` }, { status: 400 });
  }

  // Only link attempts that belong to this user.
  const attempt =
    typeof body?.attemptId === "string" ? await getAttempt(account.userId, body.attemptId) : null;

  const id = await insertExpertRequest({
    userId: account.userId,
    expertId: expert.id,
    pathway: expert.pathway,
    attemptId: attempt?.id ?? null,
    preferredMode,
    message,
  });

  const pathwayResult = attempt?.result.pathways.find((p) => p.pathway === expert.pathway);
  const summary = attempt
    ? `Identified career path: ${attempt.result.careerPath.primary.title}` +
      (pathwayResult ? ` · ${pathwayResult.name} AHP score ${pathwayResult.ahpScore}/100 (${pathwayResult.level})` : "")
    : null;

  await sendExpertRequestEmails({
    expert,
    userEmail: account.email,
    userName: account.name,
    message,
    preferredMode,
    summary,
  }).catch((err) => console.error("[experts] email failed", err));

  return NextResponse.json({ id }, { status: 201 });
}
