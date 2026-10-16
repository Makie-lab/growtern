# GrowTern

Career growth platform for students, graduates and employees in the Philippines: free resources, a **200-item AHP-weighted competency assessment**, career path identification, and Philippines-based experts.

**Stack:** Next.js (App Router) on Vercel · Tailwind CSS · Clerk (personal accounts) · PostgreSQL (Neon) · Resend · Vercel Blob · React Flow · lucide-react

## Features

| Feature | Where |
| --- | --- |
| Personal accounts (sign up / sign in, profile, history) | `/sign-up`, `/sign-in`, `/dashboard` |
| 200-item assessment: 4 pathways × 50 items, pick any pathway(s) | `/assessment` |
| AHP-weighted competency scoring + identified career path | `/assessment/result/[id]` |
| 2 Philippines-based experts per pathway, consultation requests by email | `/experts`, result page |
| Shareable HTML report stored in Vercel Blob | result page → "Save shareable report" |

### Pathways and competencies

Each pathway has 5 competencies × 10 items (difficulty 1–3).

| Pathway | Competencies | Careers ranked |
| --- | --- | --- |
| Data Analytics | Statistics · SQL · Data wrangling · Visualization/BI · Business analysis | Data Analyst, BI Analyst, Junior Data Scientist |
| Software Development | Programming · DS&A · Web · Engineering practices · Databases & APIs | Front-end, Back-end, Full-stack Developer |
| Networking | Fundamentals · IP/Subnetting · Routing & switching · Services & wireless · Troubleshooting | Network Engineer, Network Administrator, NOC Technician |
| Cybersecurity | Principles & governance · Threats · Network security · Crypto & identity · SecOps/IR | SOC Analyst, Penetration Tester, GRC Analyst |

### How the AHP scoring works

1. **Competency score**: difficulty-weighted percentage correct per competency (`src/lib/scoring.ts`).
2. **Competency weights**: each pathway has a Saaty 1–9 pairwise comparison matrix. Its principal eigenvector gives the weights, and the consistency ratio is checked: CR = CI / RI < 0.10 (`src/lib/ahp.ts`).
3. **Pathway AHP score** = Σ weightᵢ × competency scoreᵢ.
4. **Career fit**: every career has its own pairwise matrix over the same competencies. Fit = Σ career weightᵢ × competency scoreᵢ.
5. **Identified career path**: the highest-fitting career across every pathway taken, with confidence based on the gap to the runner-up. The dashboard combines the latest result from each pathway.

You can tune the judgements in `src/data/assessment/pathways.ts`. Every matrix currently has CR ≤ 0.017.

## Directory structure

```
growtern/
├── db/schema.sql                    # PostgreSQL schema (profiles, attempts, expert requests)
├── scripts/migrate.mjs              # npm run db:migrate
├── .env.example
└── src/
    ├── proxy.ts                     # Clerk middleware (Next 16 "proxy"), protects account pages
    ├── app/
    │   ├── layout.tsx               # <ClerkProvider>
    │   ├── page.tsx                 # Landing page
    │   ├── sign-in/[[...sign-in]]/  # Clerk sign-in
    │   ├── sign-up/[[...sign-up]]/  # Clerk sign-up (personal account)
    │   ├── (platform)/              # Shared Navbar + Footer shell
    │   │   ├── category/[slug]/     # Free resources by category
    │   │   ├── assessment/          # Pathway picker
    │   │   │   ├── take/            # Assessment runner (answer keys stay server-side)
    │   │   │   └── result/[id]/     # AHP breakdown, career path, React Flow hierarchy, experts
    │   │   ├── experts/             # 2 Philippines-based experts per pathway
    │   │   └── dashboard/           # Personal profile, history, combined career path
    │   └── api/
    │       ├── assessments/         # POST submit & score · GET history
    │       │   └── [id]/report/     # POST → Vercel Blob report
    │       ├── experts/requests/    # POST consultation request → Resend
    │       └── profile/             # GET / PUT personal profile
    ├── lib/
    │   ├── ahp.ts                   # AHP: eigenvector weights, λmax, CI, CR
    │   ├── scoring.ts               # Competency, pathway, career fit, career path
    │   ├── account.ts               # Clerk user → profile row
    │   ├── db.ts                    # Neon queries
    │   ├── email.ts                 # Resend templates
    │   └── report.ts                # Vercel Blob report
    ├── data/
    │   ├── assessment/
    │   │   ├── pathways.ts          # Pathways, competencies, AHP matrices, careers
    │   │   ├── types.ts             # Question types and bank builder
    │   │   ├── index.ts             # 200-item bank (server only)
    │   │   └── questions/           # 50 items per pathway
    │   ├── experts.ts               # Expert profiles
    │   ├── features.ts, roleComparison.ts, roleFlow.ts, userTypes.ts
    └── components/
        ├── assessment/              # PathwayPicker, AssessmentRunner, CareerPathFlow, …
        ├── experts/ExpertCard.tsx
        ├── account/                 # AuthShell, ProfileForm
        └── …                        # Landing page sections
```

## Setup

```bash
npm install
cp .env.example .env.local     # fill in Clerk, DATABASE_URL, Resend, Blob
npm run db:migrate             # create tables
npm run dev
```

On Vercel, add **Neon** (Postgres) and **Blob** from the Storage tab, then add the Clerk and Resend keys. In the Clerk dashboard, leave **Organizations disabled** so every account is a personal account.

> **Expert profiles are samples.** The 8 entries in `src/data/experts.ts` use placeholder names and `example.com` emails, and they show a "Sample profile" badge. Before launch, replace them with real experts in the Philippines who have agreed to be listed, and set `verified: true`.
