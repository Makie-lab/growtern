/**
 * PLACEHOLDER EMAIL — nothing is actually sent.
 * Messages are printed to the terminal running `npm run dev` and saved to the
 * `outbox` list in `.data/growtern.json`. Swap `send()` for a real email
 * provider (e.g. Resend) later.
 */
import { saveToOutbox } from "@/lib/db";
import type { AssessmentResult } from "@/lib/scoring";
import type { Expert } from "@/data/experts";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function send(payload: { to: string[]; subject: string; html: string }) {
  console.info(`[email placeholder] to=${payload.to.join(", ")} subject="${payload.subject}"`);
  await saveToOutbox(payload);
}

export async function sendResultEmail(to: string, name: string | null, attemptId: string, result: AssessmentResult) {
  const rows = result.pathways
    .map((p) => `<li>${escapeHtml(p.name)}: ${p.ahpScore}/100 (${p.level})</li>`)
    .join("");
  const { primary } = result.careerPath;
  await send({
    to: [to],
    subject: `Your GrowTern result: ${primary.title}`,
    html: `<p>Hi ${escapeHtml(name ?? "there")}, your identified career path is <strong>${escapeHtml(primary.title)}</strong> (AHP fit ${primary.fit}/100).</p>
<ul>${rows}</ul>
<p><a href="${APP_URL}/assessment/result/${attemptId}">View the full breakdown</a></p>`,
  });
}

export async function sendExpertRequestEmails(input: {
  expert: Expert;
  userEmail: string;
  userName: string | null;
  message: string;
  preferredMode: string;
  summary: string | null;
}) {
  const { expert, userEmail, userName, message, preferredMode, summary } = input;
  const who = escapeHtml(userName ?? userEmail);
  await send({
    to: [expert.email],
    subject: `GrowTern consultation request from ${userName ?? userEmail}`,
    html: `<p><strong>${who}</strong> (${escapeHtml(userEmail)}) requests a ${escapeHtml(preferredMode)} session.</p>
${summary ? `<p><em>${escapeHtml(summary)}</em></p>` : ""}
<blockquote>${escapeHtml(message).replace(/\n/g, "<br/>")}</blockquote>`,
  });
  await send({
    to: [userEmail],
    subject: `Request sent to ${expert.name}`,
    html: `<p>Hi ${who}, your request was sent to ${escapeHtml(expert.name)} (${escapeHtml(expert.location)}).</p>`,
  });
}
