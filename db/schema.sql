-- GrowTern PostgreSQL schema — NOT USED YET.
-- The app currently stores data in a local JSON file (src/lib/db.ts).
-- Use these tables when you replace that placeholder with a real database.

-- One personal profile per user (no organisations / team accounts).
CREATE TABLE IF NOT EXISTS profiles (
  user_id            TEXT PRIMARY KEY,               -- Clerk user id
  email              TEXT,
  full_name          TEXT,
  user_type          TEXT NOT NULL DEFAULT 'student'
                     CHECK (user_type IN ('student', 'graduate', 'employee')),
  school_or_company  TEXT,
  city               TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Each submitted assessment (one or more pathways, up to 200 items).
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  pathways           TEXT[] NOT NULL,
  answers            JSONB NOT NULL,                 -- { questionId: optionIndex }
  result             JSONB NOT NULL,                 -- AHP scoring output (AssessmentResult)
  overall_score      NUMERIC(5, 1) NOT NULL,
  career_id          TEXT NOT NULL,
  career_title       TEXT NOT NULL,
  duration_seconds   INTEGER,
  report_url         TEXT,                           -- Vercel Blob report
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assessment_attempts_user_created_idx
  ON assessment_attempts (user_id, created_at DESC);

-- Consultation requests sent to Philippines-based experts.
CREATE TABLE IF NOT EXISTS expert_requests (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  expert_id          TEXT NOT NULL,
  pathway            TEXT NOT NULL,
  attempt_id         UUID REFERENCES assessment_attempts(id) ON DELETE SET NULL,
  preferred_mode     TEXT NOT NULL DEFAULT 'Online',
  message            TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS expert_requests_user_idx ON expert_requests (user_id, created_at DESC);
