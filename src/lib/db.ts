import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { AssessmentResult } from "@/lib/scoring";
import type { PathwayId } from "@/data/assessment/pathways";

let client: NeonQueryFunction<false, false> | null = null;

/** Lazily created so builds don't need DATABASE_URL. */
export function sql(): NeonQueryFunction<false, false> {
  if (!client) {
    // The Vercel Neon integration sets DATABASE_URL and POSTGRES_URL.
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error("DATABASE_URL is not configured");
    client = neon(url);
  }
  return client;
}

export type AccountUserType = "student" | "graduate" | "employee";

export interface Profile {
  user_id: string;
  email: string | null;
  full_name: string | null;
  user_type: AccountUserType;
  school_or_company: string | null;
  city: string | null;
  created_at: string;
}

export interface AttemptSummary {
  id: string;
  pathways: PathwayId[];
  overall_score: number;
  career_title: string;
  created_at: string;
}

export interface Attempt extends AttemptSummary {
  user_id: string;
  answers: Record<string, number>;
  result: AssessmentResult;
  career_id: string;
  duration_seconds: number | null;
  report_url: string | null;
}

// ── Profiles ──────────────────────────────────────────────────────────────

export async function upsertProfile(input: {
  userId: string;
  email: string | null;
  fullName: string | null;
}): Promise<Profile> {
  const rows = await sql()`
    INSERT INTO profiles (user_id, email, full_name)
    VALUES (${input.userId}, ${input.email}, ${input.fullName})
    ON CONFLICT (user_id) DO UPDATE
      SET email = EXCLUDED.email,
          full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
          updated_at = now()
    RETURNING *`;
  return rows[0] as Profile;
}

export async function updateProfile(
  userId: string,
  data: { userType: AccountUserType; schoolOrCompany: string | null; city: string | null }
): Promise<Profile | null> {
  const rows = await sql()`
    UPDATE profiles
       SET user_type = ${data.userType},
           school_or_company = ${data.schoolOrCompany},
           city = ${data.city},
           updated_at = now()
     WHERE user_id = ${userId}
    RETURNING *`;
  return (rows[0] as Profile) ?? null;
}

// ── Assessment attempts ───────────────────────────────────────────────────

export async function insertAttempt(input: {
  userId: string;
  pathways: PathwayId[];
  answers: Record<string, number>;
  result: AssessmentResult;
  durationSeconds: number | null;
}): Promise<string> {
  const { primary } = input.result.careerPath;
  const rows = await sql()`
    INSERT INTO assessment_attempts
      (user_id, pathways, answers, result, overall_score, career_id, career_title, duration_seconds)
    VALUES
      (${input.userId}, ${input.pathways}, ${JSON.stringify(input.answers)}::jsonb,
       ${JSON.stringify(input.result)}::jsonb, ${input.result.overallScore},
       ${primary.id}, ${primary.title}, ${input.durationSeconds})
    RETURNING id`;
  return (rows[0] as { id: string }).id;
}

export async function getAttempt(userId: string, id: string): Promise<Attempt | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await sql()`
    SELECT * FROM assessment_attempts WHERE id = ${id} AND user_id = ${userId} LIMIT 1`;
  const row = rows[0];
  return row ? ({ ...row, overall_score: Number(row.overall_score) } as Attempt) : null;
}

export async function listAttempts(userId: string): Promise<AttemptSummary[]> {
  const rows = await sql()`
    SELECT id, pathways, overall_score, career_title, created_at
      FROM assessment_attempts
     WHERE user_id = ${userId}
     ORDER BY created_at DESC
     LIMIT 50`;
  return rows.map((r) => ({ ...r, overall_score: Number(r.overall_score) }) as AttemptSummary);
}

/** Latest attempt results (newest first) — used to build the combined career profile. */
export async function listAttemptResults(userId: string): Promise<AssessmentResult[]> {
  const rows = await sql()`
    SELECT result FROM assessment_attempts
     WHERE user_id = ${userId}
     ORDER BY created_at DESC
     LIMIT 50`;
  return rows.map((r) => r.result as AssessmentResult);
}

/** Public lookup for shareable reports — attempt ids are random UUIDs. */
export async function getReportUrl(id: string): Promise<string | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await sql()`SELECT report_url FROM assessment_attempts WHERE id = ${id} LIMIT 1`;
  return (rows[0]?.report_url as string | null) ?? null;
}

export async function setReportUrl(userId: string, id: string, url: string): Promise<void> {
  await sql()`
    UPDATE assessment_attempts SET report_url = ${url} WHERE id = ${id} AND user_id = ${userId}`;
}

// ── Expert requests ───────────────────────────────────────────────────────

export async function insertExpertRequest(input: {
  userId: string;
  expertId: string;
  pathway: PathwayId;
  attemptId: string | null;
  preferredMode: string;
  message: string;
}): Promise<string> {
  const rows = await sql()`
    INSERT INTO expert_requests (user_id, expert_id, pathway, attempt_id, preferred_mode, message)
    VALUES (${input.userId}, ${input.expertId}, ${input.pathway}, ${input.attemptId},
            ${input.preferredMode}, ${input.message})
    RETURNING id`;
  return (rows[0] as { id: string }).id;
}

export async function listExpertRequests(userId: string) {
  const rows = await sql()`
    SELECT id, expert_id, pathway, status, created_at
      FROM expert_requests WHERE user_id = ${userId}
     ORDER BY created_at DESC LIMIT 20`;
  return rows as { id: string; expert_id: string; pathway: PathwayId; status: string; created_at: string }[];
}
