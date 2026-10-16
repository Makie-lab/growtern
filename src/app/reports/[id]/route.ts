import { getAttemptForReport } from "@/lib/db";
import { renderReport } from "@/lib/report";

/** Shareable, printable HTML report for an assessment attempt. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await getAttemptForReport(id);
  if (!found) return new Response("Report not found", { status: 404 });

  const { attempt, profile } = found;
  const html = renderReport(profile?.full_name ?? profile?.email ?? "GrowTern user", attempt.created_at, attempt.result);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
    },
  });
}
