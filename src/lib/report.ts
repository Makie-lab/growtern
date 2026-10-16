import { put } from "@vercel/blob";
import { escapeHtml } from "@/lib/email";
import type { AssessmentResult } from "@/lib/scoring";

/**
 * Stores connected to a Vercel project authenticate with OIDC (BLOB_STORE_ID +
 * VERCEL_OIDC_TOKEN). Older stores and local dev can use BLOB_READ_WRITE_TOKEN.
 */
export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function renderReport(name: string, createdAt: string, result: AssessmentResult): string {
  const pathways = result.pathways
    .map((p) => {
      const comps = p.competencies
        .map(
          (c) =>
            `<tr><td>${escapeHtml(c.name)}</td><td>${(c.weight * 100).toFixed(1)}%</td><td>${c.correct}/${c.total}</td><td>${c.score}</td><td>${c.contribution}</td></tr>`
        )
        .join("");
      const careers = p.careers.map((c) => `<li>${escapeHtml(c.title)} — ${c.fit}</li>`).join("");
      return `
        <h2>${escapeHtml(p.name)} — ${p.ahpScore}/100 (${p.level})</h2>
        <p>Raw: ${p.correct}/${p.total} correct · AHP consistency ratio ${p.consistencyRatio.toFixed(3)}</p>
        <table><tr><th>Competency</th><th>AHP weight</th><th>Correct</th><th>Score</th><th>Weighted</th></tr>${comps}</table>
        <h3>Career fit</h3><ul>${careers}</ul>`;
    })
    .join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<title>GrowTern Competency Report — ${escapeHtml(name)}</title>
<style>body{font-family:Inter,Arial,sans-serif;max-width:760px;margin:40px auto;padding:0 16px;color:#0a0a0a}
h1,h2{color:#1e3a5f}table{border-collapse:collapse;width:100%}td,th{border:1px solid #e5e7eb;padding:6px 10px;text-align:left}</style>
</head><body>
<h1>GrowTern Competency Report</h1>
<p><strong>${escapeHtml(name)}</strong> · ${escapeHtml(new Date(createdAt).toLocaleString("en-PH", { timeZone: "Asia/Manila" }))}</p>
<p>Identified career path: <strong>${escapeHtml(result.careerPath.primary.title)}</strong> (fit ${result.careerPath.primary.fit}, ${result.careerPath.confidence} confidence)</p>
<p>Overall AHP score: ${result.overallScore}/100</p>
${pathways}
<p style="opacity:.6;font-size:12px">Scores use the Analytic Hierarchy Process: competency weights come from Saaty pairwise comparison matrices (CR &lt; 0.10).</p>
</body></html>`;
}

export async function uploadReport(attemptId: string, name: string, createdAt: string, result: AssessmentResult) {
  const blob = await put(`reports/${attemptId}.html`, renderReport(name, createdAt, result), {
    access: "public",
    contentType: "text/html; charset=utf-8",
    addRandomSuffix: true,
  });
  return blob.url;
}
