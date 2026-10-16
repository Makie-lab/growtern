/**
 * PLACEHOLDER DATABASE — local JSON file at `.data/growtern.json`.
 *
 * Lets the app run on your machine with no Postgres. The function names match
 * what a real database layer would expose, so it can be swapped for
 * PostgreSQL later (see db/schema.sql) without touching the pages.
 * Not for production: serverless hosts (e.g. Vercel) can't write to disk.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { AssessmentResult } from "@/lib/scoring";
import type { PathwayId } from "@/data/assessment/pathways";

export type AccountUserType = "student" | "graduate" | "employee";

export interface Profile {
  user_id: string;
  email: string;
  full_name: string | null;
  user_type: AccountUserType;
  school_or_company: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
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
}

export interface ExpertRequest {
  id: string;
  user_id: string;
  expert_id: string;
  pathway: PathwayId;
  attempt_id: string | null;
  preferred_mode: string;
  message: string;
  status: "pending" | "accepted" | "declined" | "completed";
  created_at: string;
}

export interface OutboxEmail {
  id: string;
  to: string[];
  subject: string;
  html: string;
  created_at: string;
}

interface Data {
  profiles: Profile[];
  attempts: Attempt[];
  expertRequests: ExpertRequest[];
  /** Placeholder emails are written here instead of being sent. */
  outbox: OutboxEmail[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "growtern.json");
const EMPTY: Data = { profiles: [], attempts: [], expertRequests: [], outbox: [] };

async function load(): Promise<Data> {
  try {
    return { ...EMPTY, ...(JSON.parse(await fs.readFile(DATA_FILE, "utf8")) as Partial<Data>) };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(EMPTY);
    throw err;
  }
}

// Serialise writes so concurrent requests don't clobber each other.
let queue: Promise<unknown> = Promise.resolve();

function mutate<T>(fn: (data: Data) => T): Promise<T> {
  const run = queue.then(async () => {
    const data = await load();
    const result = fn(data);
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${DATA_FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2));
    await fs.rename(tmp, DATA_FILE);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

const now = () => new Date().toISOString();
const isId = (id: string) => /^[0-9a-f-]{36}$/i.test(id);
const newestFirst = <T extends { created_at: string }>(a: T, b: T) => b.created_at.localeCompare(a.created_at);

// ── Profiles (placeholder accounts) ───────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  return (await load()).profiles.find((p) => p.user_id === userId) ?? null;
}

/** Sign in by email: returns the existing profile or creates one. */
export function upsertProfileByEmail(email: string, fullName: string | null): Promise<Profile> {
  return mutate((data) => {
    const existing = data.profiles.find((p) => p.email === email);
    if (existing) {
      if (fullName) existing.full_name = fullName;
      existing.updated_at = now();
      return existing;
    }
    const profile: Profile = {
      user_id: randomUUID(),
      email,
      full_name: fullName,
      user_type: "student",
      school_or_company: null,
      city: null,
      created_at: now(),
      updated_at: now(),
    };
    data.profiles.push(profile);
    return profile;
  });
}

export function updateProfile(
  userId: string,
  update: { userType: AccountUserType; schoolOrCompany: string | null; city: string | null }
): Promise<Profile | null> {
  return mutate((data) => {
    const profile = data.profiles.find((p) => p.user_id === userId);
    if (!profile) return null;
    profile.user_type = update.userType;
    profile.school_or_company = update.schoolOrCompany;
    profile.city = update.city;
    profile.updated_at = now();
    return profile;
  });
}

// ── Assessment attempts ───────────────────────────────────────────────────

export function insertAttempt(input: {
  userId: string;
  pathways: PathwayId[];
  answers: Record<string, number>;
  result: AssessmentResult;
  durationSeconds: number | null;
}): Promise<string> {
  return mutate((data) => {
    const { primary } = input.result.careerPath;
    const attempt: Attempt = {
      id: randomUUID(),
      user_id: input.userId,
      pathways: input.pathways,
      answers: input.answers,
      result: input.result,
      overall_score: input.result.overallScore,
      career_id: primary.id,
      career_title: primary.title,
      duration_seconds: input.durationSeconds,
      created_at: now(),
    };
    data.attempts.push(attempt);
    return attempt.id;
  });
}

export async function getAttempt(userId: string, id: string): Promise<Attempt | null> {
  if (!isId(id)) return null;
  return (await load()).attempts.find((a) => a.id === id && a.user_id === userId) ?? null;
}

/** Report links are shareable: anyone with the (random) attempt id can view the report. */
export async function getAttemptForReport(id: string): Promise<{ attempt: Attempt; profile: Profile | null } | null> {
  if (!isId(id)) return null;
  const data = await load();
  const attempt = data.attempts.find((a) => a.id === id);
  if (!attempt) return null;
  return { attempt, profile: data.profiles.find((p) => p.user_id === attempt.user_id) ?? null };
}

export async function listAttempts(userId: string): Promise<AttemptSummary[]> {
  return (await load()).attempts
    .filter((a) => a.user_id === userId)
    .sort(newestFirst)
    .slice(0, 50)
    .map(({ id, pathways, overall_score, career_title, created_at }) => ({ id, pathways, overall_score, career_title, created_at }));
}

/** Results newest first, used to build the combined career profile. */
export async function listAttemptResults(userId: string): Promise<AssessmentResult[]> {
  return (await load()).attempts
    .filter((a) => a.user_id === userId)
    .sort(newestFirst)
    .slice(0, 50)
    .map((a) => a.result);
}

// ── Expert requests ───────────────────────────────────────────────────────

export function insertExpertRequest(input: {
  userId: string;
  expertId: string;
  pathway: PathwayId;
  attemptId: string | null;
  preferredMode: string;
  message: string;
}): Promise<string> {
  return mutate((data) => {
    const request: ExpertRequest = {
      id: randomUUID(),
      user_id: input.userId,
      expert_id: input.expertId,
      pathway: input.pathway,
      attempt_id: input.attemptId,
      preferred_mode: input.preferredMode,
      message: input.message,
      status: "pending",
      created_at: now(),
    };
    data.expertRequests.push(request);
    return request.id;
  });
}

export async function listExpertRequests(userId: string) {
  return (await load()).expertRequests
    .filter((r) => r.user_id === userId)
    .sort(newestFirst)
    .slice(0, 20)
    .map(({ id, expert_id, pathway, status, created_at }) => ({ id, expert_id, pathway, status, created_at }));
}

// ── Outbox (placeholder email) ────────────────────────────────────────────

export function saveToOutbox(email: { to: string[]; subject: string; html: string }): Promise<void> {
  return mutate((data) => {
    data.outbox.push({ id: randomUUID(), ...email, created_at: now() });
    if (data.outbox.length > 200) data.outbox.splice(0, data.outbox.length - 200);
  });
}
