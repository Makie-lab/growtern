import { getReportUrl } from "@/lib/db";

/**
 * Vercel Blob serves .html files as downloads (Content-Disposition: attachment),
 * so shareable reports are streamed through this route to display in the browser.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blobUrl = await getReportUrl(id);
  if (!blobUrl) return new Response("Report not found", { status: 404 });

  const res = await fetch(blobUrl, { cache: "no-store" });
  if (!res.ok) return new Response("Report unavailable", { status: 502 });

  return new Response(await res.text(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Robots-Tag": "noindex",
      // Report HTML is generated server-side with escaped values; lock it down anyway.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
    },
  });
}
