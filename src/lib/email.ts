import { Resend } from "resend";
import type { AssessmentResult } from "@/lib/scoring";
import type { Expert } from "@/data/experts";

const FROM = process.env.RESEND_FROM_EMAIL || "GrowTern <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Email is best-effort: failures are logged and never block the request. */
async function send(payload: { to: string[]; subject: string; html: string; replyTo?: string }) {
  const resend = client();
  if (!resend) {
    console.info("[email] RESEND_API_KEY not set — skipping:", payload.subject);
    return false;
  }
  const { error } = await resend.emails.send({ from: FROM, ...payload });
  if (error) {
    console.error("[email] send failed:", error);
    return false;
  }
  return true;
}

export async function sendResultEmail(to: string, name: string | null, attemptId: string, result: AssessmentResult) {
  const rows = result.pathways
    .map(
      (p) =>
        `<tr><td style="padding:6px 12px">${escapeHtml(p.name)}</td><td style="padding:6px 12px">${p.ahpScore}</td><td style="padding:6px 12px">${p.level}</td></tr>`
    )
    .join("");
  const { primary } = result.careerPath;

  return send({
    to: [to],
    subject: `Your GrowTern result: ${primary.title}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;color:#0a0a0a;max-width:560px">
        <h2 style="color:#1e3a5f">Hi ${escapeHtml(name ?? "there")}, here are your results</h2>
        <p>Your identified career path is <strong>${escapeHtml(primary.title)}</strong>
           (AHP fit ${primary.fit}/100).</p>
        <table style="border-collapse:collapse;border:1px solid #e5e7eb">
          <tr style="background:#f3f4f6"><th style="padding:6px 12px;text-align:left">Pathway</th>
          <th style="padding:6px 12px;text-align:left">AHP score</th><th style="padding:6px 12px;text-align:left">Level</th></tr>
          ${rows}
        </table>
        <p>Strengths: ${result.strengths.map(escapeHtml).join(", ")}<br/>
           Focus areas: ${result.gaps.map(escapeHtml).join(", ")}</p>
        <p><a href="${APP_URL}/assessment/result/${attemptId}" style="color:#1e3a5f">View the full breakdown and book an expert →</a></p>
      </div>`,
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
    replyTo: userEmail,
    subject: `GrowTern consultation request from ${userName ?? userEmail}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px">
        <h2 style="color:#1e3a5f">New consultation request</h2>
        <p><strong>${who}</strong> (${escapeHtml(userEmail)}) would like a <strong>${escapeHtml(preferredMode)}</strong> session.</p>
        ${summary ? `<p><em>${escapeHtml(summary)}</em></p>` : ""}
        <blockquote style="border-left:3px solid #1e3a5f;padding-left:12px">${escapeHtml(message).replace(/\n/g, "<br/>")}</blockquote>
        <p>Reply to this email to respond directly.</p>
      </div>`,
  });

  await send({
    to: [userEmail],
    subject: `Request sent to ${expert.name}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px">
        <p>Hi ${who}, we've sent your consultation request to <strong>${escapeHtml(expert.name)}</strong>,
        ${escapeHtml(expert.title)} based in ${escapeHtml(expert.location)}. They'll reply to you by email.</p>
      </div>`,
  });
}
