# GrowTern

Career growth platform for students, graduates and employees in the Philippines: free resources, a **200-item AHP-weighted competency assessment**, career path identification, and Philippines-based experts.

**Stack:** Next.js (App Router) · Tailwind CSS · React Flow · lucide-react

It runs **entirely on your computer with no API keys**. Accounts, the database, email and report storage are simple placeholders (see [Placeholders](#placeholders)).

## Run it locally

Requires Node.js 20 or newer.

```bash
git clone https://github.com/Makie-lab/growtern.git
cd growtern
npm install
npm run dev
```

Open http://localhost:3000, click **Create personal account** in the sidebar, then go to **Assessment**.

## Features

The app opens on a feature hub with a sidebar (desktop) or bottom tabs (mobile).

| Feature | Where |
| --- | --- |
| Feature hub: what the system does, pathway tests, experts, your career path | `/` |
| 200-item assessment: 4 pathways × 50 items. Test setup → test form (all questions of a part on one page) → submit check | `/assessment`, `/assessment/take` |
| Test results: % correct, correct / incorrect / skipped, retake, question feedback | `/assessment/result/[id]` |
| AHP-weighted competency: matrices, weights, consistency check | `/career-path#ahp`, result page |
| Career path identification and ranking of all 12 careers | `/career-path` |
| 2 Philippines-based experts per pathway, consultation requests | `/experts` |
| Personal account: profile, test history, expert requests | `/sign-up`, `/sign-in`, `/dashboard` |
| Printable HTML report | `/reports/[id]` |
| Free resources (the original landing page) | `/explore` |

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

## Placeholders

| Feature | Placeholder used now | Replace later with |
| --- | --- | --- |
| Accounts | Name + email sign-in, no password, cookie session (`src/lib/account.ts`, `src/app/api/auth/session/`) | Clerk |
| Database | JSON file at `.data/growtern.json` (`src/lib/db.ts`) | PostgreSQL (`db/schema.sql` has the matching tables) |
| Email | Printed in the terminal and saved to `outbox` in the data file (`src/lib/email.ts`) | Resend |
| Report storage | Built on request at `/reports/[id]` (`src/lib/report.ts`) | Vercel Blob |

Delete the `.data/` folder to reset all local data. These placeholders are for local use only: there are no passwords, and hosted (serverless) platforms can't write the data file.

> **Expert profiles are samples.** The 8 entries in `src/data/experts.ts` use placeholder names and `example.com` emails, and they show a "Sample profile" badge. Replace them with real experts in the Philippines who have agreed to be listed, and set `verified: true`.

## Directory structure

```
growtern/
├── db/schema.sql                    # PostgreSQL tables for when you add a real database
└── src/
    ├── proxy.ts                     # Redirects signed-out users away from account pages
    ├── app/
    │   ├── layout.tsx
    │   ├── sign-in/, sign-up/       # Placeholder sign-in / personal account creation
    │   ├── reports/[id]/            # Printable competency report
    │   ├── (app)/                   # Feature app: sidebar / bottom-tab shell
    │   │   ├── page.tsx             # Feature hub (home)
    │   │   ├── assessment/          # Test setup + previous test sessions
    │   │   │   ├── take/            # Test form (answer keys stay server-side)
    │   │   │   └── result/[id]/     # Results, AHP breakdown, career path, experts, feedback
    │   │   ├── career-path/         # Identified career path + AHP matrices explained
    │   │   ├── experts/             # 2 Philippines-based experts per pathway
    │   │   └── dashboard/           # Personal profile, test history, expert requests
    │   ├── (platform)/              # Original landing-page shell (Navbar + Footer)
    │   │   ├── explore/             # Free resources landing page
    │   │   └── category/[slug]/     # Free resources by category
    │   └── api/
    │       ├── auth/session/        # Placeholder sign-in / sign-out
    │       ├── assessments/         # POST submit & score · GET history
    │       ├── experts/requests/    # POST consultation request
    │       └── profile/             # GET / PUT personal profile
    ├── lib/
    │   ├── ahp.ts                   # AHP: eigenvector weights, λmax, CI, CR
    │   ├── scoring.ts               # Competency, pathway, career fit, career path
    │   ├── careerProfile.ts         # Latest result per pathway → combined career path
    │   ├── account.ts               # Placeholder auth
    │   ├── db.ts                    # Placeholder database (JSON file)
    │   ├── email.ts                 # Placeholder email (terminal + outbox)
    │   └── report.ts                # Report HTML
    ├── data/
    │   ├── assessment/
    │   │   ├── pathways.ts          # Pathways, competencies, AHP matrices, careers
    │   │   ├── types.ts             # Question types and bank builder
    │   │   ├── index.ts             # 200-item bank (server only)
    │   │   └── questions/           # 50 items per pathway
    │   ├── experts.ts               # Expert profiles
    │   └── features.ts, roleComparison.ts, roleFlow.ts, userTypes.ts
    └── components/
        ├── app/AppShell.tsx         # Sidebar, mobile tabs, theme, account
        ├── assessment/              # PathwayPicker, AssessmentRunner, AnswerReview, AhpMatrix, …
        ├── experts/ExpertCard.tsx
        ├── account/                 # AuthShell, LocalSignInForm, ProfileForm, useAccount
        └── …                        # Landing page sections
```
