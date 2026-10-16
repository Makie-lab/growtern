"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

export default function ReportButton({ attemptId, initialUrl }: { attemptId: string; initialUrl: string | null }) {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm px-4 py-2 inline-flex items-center gap-2">
        <FileText size={16} /> Open saved report
      </a>
    );
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessments/${attemptId}/report`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save report");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col">
      <button type="button" onClick={generate} disabled={loading} className="btn-secondary text-sm px-4 py-2 inline-flex items-center gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />} Save shareable report
      </button>
      {error && <span className="text-[11px] text-red-500 mt-1">{error}</span>}
    </span>
  );
}
