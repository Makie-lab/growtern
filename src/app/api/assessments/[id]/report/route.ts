import { NextResponse } from "next/server";
import { getAccount } from "@/lib/account";
import { getAttempt, setReportUrl } from "@/lib/db";
import { isBlobConfigured, uploadReport } from "@/lib/report";

/** Generates a shareable HTML competency report and stores it in Vercel Blob. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const attempt = await getAttempt(account.userId, id);
  if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (attempt.report_url) return NextResponse.json({ url: attempt.report_url });

  if (!isBlobConfigured()) {
    return NextResponse.json({ error: "Report storage is not configured" }, { status: 503 });
  }

  const url = await uploadReport(
    attempt.id,
    account.name ?? account.email ?? "GrowTern user",
    attempt.created_at,
    attempt.result
  );
  await setReportUrl(account.userId, attempt.id, url);
  return NextResponse.json({ url }, { status: 201 });
}
