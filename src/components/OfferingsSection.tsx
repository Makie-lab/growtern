import {
  Award,
  Briefcase,
  Zap,
  BookOpen,
  GraduationCap,
  Code,
  Heart,
  DollarSign,
} from "lucide-react";

const offerings = [
  {
    icon: Award,
    title: "Free Certifications",
    description:
      "Curated industry-recognized certificates from Google, Meta, IBM, and AWS — all free to access.",
  },
  {
    icon: Briefcase,
    title: "Internship Opportunities",
    description:
      "Paid internship programs from top tech companies matched to your skill level and interests.",
  },
  {
    icon: Zap,
    title: "Hackathon Directory",
    description:
      "Find and join hackathons worldwide. Build your portfolio, win prizes, and grow your network.",
  },
  {
    icon: BookOpen,
    title: "Hands-on Workshops",
    description:
      "Full-stack bootcamps, design workshops, and DevOps labs from trusted learning platforms.",
  },
  {
    icon: GraduationCap,
    title: "Scholarships & Credits",
    description:
      "Free cloud credits, tool access, and course scholarships from GitHub, AWS, Google, and more.",
  },
  {
    icon: Code,
    title: "Real-World Projects",
    description:
      "Open source contributions, GSoC, and portfolio-building challenges to prove your skills.",
  },
  {
    icon: Heart,
    title: "Role-Based Search",
    description:
      "Find resources tailored to your career path — Frontend, Full Stack, Data Analyst, and more.",
  },
  {
    icon: DollarSign,
    title: "100% Free. Always.",
    description:
      "No plans, no pricing, no premium tiers. Every resource we curate is free for students.",
  },
];

export default function OfferingsSection() {
  return (
    <section
      id="offerings"
      aria-label="What we offer"
      className="section-scroll max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="mb-12 text-center">
        <p className="eyebrow mb-2">What GrowTern offers</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Everything you need,{" "}
          <span
            className="font-serif italic"
            style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}
          >
            completely
          </span>{" "}
          free
        </h2>
        <p className="text-base opacity-60 max-w-2xl mx-auto">
          We curate the best free resources across the internet so you can focus on
          learning and growing — not searching or paying.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {offerings.map((offering, i) => (
          <div
            key={offering.title}
            className={`glass-card glass-hover p-5 animate-fade-in-${Math.min(i + 1, 3)}`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgba(30, 58, 95, 0.1)" }}
            >
              <offering.icon size={20} style={{ color: "#1e3a5f" }} />
            </div>
            <h3 className="text-base font-semibold mb-1.5">{offering.title}</h3>
            <p className="text-sm opacity-55 leading-relaxed">
              {offering.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
