import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  MapPin,
  Scale,
  Target,
  UserRound,
  Users,
} from "lucide-react";
import PathwayIcon from "@/components/assessment/PathwayIcon";
import { getAccount } from "@/lib/account";
import { getCareerProfile } from "@/lib/careerProfile";
import { listAttempts } from "@/lib/db";
import { ITEMS_PER_PATHWAY, pathwayById, pathways, TOTAL_ITEMS } from "@/data/assessment/pathways";
import { experts } from "@/data/experts";

const FEATURES = [
  {
    href: "/assessment",
    Icon: ClipboardCheck,
    title: "200-item assessment",
    body: `4 pathways × ${ITEMS_PER_PATHWAY} items. Take one pathway at a time or all four in one sitting.`,
  },
  {
    href: "/career-path#ahp",
    Icon: Scale,
    title: "AHP-weighted competency",
    body: "Scores are weighted with the Analytic Hierarchy Process, so the skills that matter most count most.",
  },
  {
    href: "/career-path",
    Icon: Target,
    title: "Career path identification",
    body: "Each of 12 careers has its own AHP weights. Your best fit becomes your identified career path.",
  },
  {
    href: "/experts",
    Icon: Users,
    title: "Experts in the Philippines",
    body: "2 practitioners per pathway you can request a consultation from.",
  },
  {
    href: "/dashboard",
    Icon: UserRound,
    title: "Personal account",
    body: "Your own profile, test history and career path in one place.",
  },
];

export default async function HomePage() {
  const account = await getAccount();
  const [profile, attempts] = account
    ? await Promise.all([getCareerProfile(account.userId), listAttempts(account.userId)])
    : [null, []];
  const career = profile?.combined?.careerPath.primary ?? null;
  const firstName = account?.name?.split(" ")[0];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="glass-card p-6 sm:p-10 relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, #1e3a5f, #6366f1)" }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-center">
          <div>
            <p className="eyebrow mb-3">{account ? `Welcome back${firstName ? `, ${firstName}` : ""}` : "Career assessment for IT pathways"}</p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
              Find your{" "}
              <span className="font-serif italic accent-text" style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}>
                IT career path
              </span>
            </h1>
            <p className="text-sm sm:text-base opacity-65 max-w-xl mb-6">
              Take a {TOTAL_ITEMS}-item competency test in Data Analytics, Software Development, Networking or
              Cybersecurity. GrowTern scores it with AHP, names the career you fit best, and connects you with experts
              in the Philippines.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/assessment" className="btn-primary">
                {attempts.length ? "Take another test" : "Start the assessment"} <ArrowRight size={16} />
              </Link>
              {!account && (
                <Link href="/sign-up" className="btn-secondary">
                  Create personal account
                </Link>
              )}
            </div>
          </div>

          {/* Status card */}
          <div className="glass-card-subtle p-5">
            {career ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1">Your career path</p>
                <p className="text-xl font-bold" style={{ color: pathwayById[career.pathway].color }}>{career.title}</p>
                <p className="text-xs opacity-60 mb-4">AHP fit {career.fit}/100 · {pathwayById[career.pathway].name}</p>
                <Link href="/career-path" className="text-xs font-semibold accent-text inline-flex items-center gap-1">
                  See why <ArrowRight size={12} />
                </Link>
              </>
            ) : (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-3">How it works</p>
                <ol className="space-y-3 text-xs">
                  {["Pick one or more pathways", "Answer the multiple-choice test", "Get your AHP score & career path", "Talk to an expert"].map((step, i) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full accent-bg accent-text text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <span className="opacity-75">{step}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-lg font-bold mb-4">What you can do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {FEATURES.map(({ href, Icon, title, body }) => (
            <Link key={title} href={href} className="glass-card p-4 glass-hover group flex flex-col">
              <span className="w-9 h-9 rounded-lg accent-bg flex items-center justify-center mb-3">
                <Icon size={18} className="accent-icon" />
              </span>
              <h3 className="text-sm font-semibold mb-1">{title}</h3>
              <p className="text-xs opacity-60 leading-relaxed flex-1">{body}</p>
              <ArrowRight size={14} className="mt-3 opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Pathway tests */}
      <section aria-labelledby="pathways-heading">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 id="pathways-heading" className="text-lg font-bold">Pathway tests</h2>
            <p className="text-xs opacity-55">{ITEMS_PER_PATHWAY} multiple-choice items each · 5 competencies × 10 items</p>
          </div>
          <Link href="/assessment" className="text-xs font-semibold accent-text inline-flex items-center gap-1 flex-shrink-0">
            Full {TOTAL_ITEMS}-item test <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pathways.map((p) => {
            const latest = profile?.latest[p.id];
            return (
              <article key={p.id} className="glass-card p-5 flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}1f`, color: p.color }}>
                    <PathwayIcon icon={p.icon} size={20} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-xs opacity-55 leading-relaxed">{p.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.competencies.map((c) => (
                    <span key={c.id} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--tint)]">
                      {c.name} · {(c.weight * 100).toFixed(0)}%
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-[var(--hairline)]">
                  <p className="text-xs">
                    {latest ? (
                      <>
                        <span className="font-bold tabular-nums" style={{ color: p.color }}>{latest.ahpScore}</span>
                        <span className="opacity-55"> / 100 · {latest.level}</span>
                      </>
                    ) : (
                      <span className="opacity-45">Not taken yet</span>
                    )}
                  </p>
                  <Link href={`/assessment/take?pathways=${p.id}`} className="btn-secondary text-xs px-4 py-2">
                    {latest ? "Retake" : "Take test"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Experts preview */}
      <section aria-labelledby="experts-heading">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 id="experts-heading" className="text-lg font-bold">Experts in the Philippines</h2>
            <p className="text-xs opacity-55">2 per pathway · sample profiles for now</p>
          </div>
          <Link href="/experts" className="text-xs font-semibold accent-text inline-flex items-center gap-1 flex-shrink-0">
            All experts <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {experts.map((e) => {
            const p = pathwayById[e.pathway];
            return (
              <Link key={e.id} href={`/experts#${e.pathway}`} className="glass-card p-4 glass-hover">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}1f`, color: p.color }}>
                    {e.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate flex items-center gap-1">
                      {e.name} {e.verified && <BadgeCheck size={13} className="text-emerald-600" />}
                    </p>
                    <p className="text-[11px] opacity-55 truncate">{e.title}</p>
                  </div>
                </div>
                <p className="text-[11px] opacity-55 mt-2 flex items-center gap-1 truncate">
                  <MapPin size={11} /> {e.location}
                </p>
                <p className="text-[10px] mt-1 font-semibold truncate" style={{ color: p.color }}>{p.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent tests */}
      {account && attempts.length > 0 && (
        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="text-lg font-bold mb-4">Recent tests</h2>
          <div className="glass-card divide-y divide-[var(--hairline)]">
            {attempts.slice(0, 3).map((a) => (
              <Link key={a.id} href={`/assessment/result/${a.id}`} className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-[var(--tint)]">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{a.career_title}</p>
                  <p className="text-[11px] opacity-50 truncate">{a.pathways.map((id) => pathwayById[id].name).join(", ")}</p>
                </div>
                <span className="font-bold tabular-nums">{a.overall_score}</span>
                <ArrowRight size={14} className="opacity-40" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
