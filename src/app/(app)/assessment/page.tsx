import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PathwayPicker from "@/components/assessment/PathwayPicker";
import TestSessions from "@/components/assessment/TestSessions";
import { getAccount } from "@/lib/account";
import { listAttempts } from "@/lib/db";
import { pathways, TOTAL_ITEMS, ITEMS_PER_PATHWAY } from "@/data/assessment/pathways";

export const metadata: Metadata = {
  title: "Assessment — GrowTern",
  description: "A 200-item, AHP-weighted competency test across Data Analytics, Software Development, Networking and Cybersecurity.",
};

export default async function AssessmentPage() {
  const account = await getAccount();
  const attempts = account ? await listAttempts(account.userId) : [];

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Competency assessment"
        title="Practice"
        accent="test"
        description={`${TOTAL_ITEMS} multiple-choice items across four pathways (${ITEMS_PER_PATHWAY} each). Take one pathway at a time, several, or all four.`}
      />
      <PathwayPicker pathways={pathways} />
      {account && <TestSessions attempts={attempts} />}
    </div>
  );
}
