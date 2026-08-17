import Link from "next/link";
import {
  Award,
  Briefcase,
  Zap,
  BookOpen,
  GraduationCap,
  Code,
  Video,
  Globe,
  ArrowRight,
} from "lucide-react";

const offerings = [
  {
    icon: Award,
    title: "Free Certifications",
    description: "Industry-recognized certificates from Google, Meta, IBM, AWS, Microsoft — all free to access.",
    href: "/category/certifications",
  },
  {
    icon: Briefcase,
    title: "Internship Opportunities",
    description: "Paid internship programs from top companies in Singapore, Philippines, Japan, and beyond.",
    href: "/category/internships",
  },
  {
    icon: Zap,
    title: "Hackathon Directory",
    description: "Find and join hackathons across Asia-Pacific. Build your portfolio, win prizes, grow your network.",
    href: "/category/hackathons",
  },
  {
    icon: BookOpen,
    title: "Hands-on Workshops",
    description: "Full-stack bootcamps, design workshops, and DevOps labs from trusted platforms.",
    href: "/category/workshops",
  },
  {
    icon: Video,
    title: "Live Webinars",
    description: "Attend live sessions from GDG Asia, AWS Summits, Microsoft Build, and regional tech events.",
    href: "/category/webinars",
  },
  {
    icon: GraduationCap,
    title: "Scholarships & Credits",
    description: "Free cloud credits, tool access, and course scholarships from GitHub, AWS, Google, and more.",
    href: "/category/scholarships",
  },
  {
    icon: Code,
    title: "Real-World Projects",
    description: "Open source contributions, GSoC, and portfolio-building challenges in the Asia dev community.",
    href: "/category/projects",
  },
  {
    icon: Globe,
    title: "Asia-Based Focus",
    description: "Resources specifically curated for the Asia-Pacific tech ecosystem and job market.",
    href: "#categories",
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
          We curate the best free resources across Asia-Pacific so you can focus on
          learning and growing — not searching or paying.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {offerings.map((offering) => {
          const isExternal = offering.href.startsWith("#");
          const Wrapper = isExternal ? "a" : Link;
          return (
            <Wrapper
              key={offering.title}
              href={offering.href}
              className="glass-card glass-hover p-5 flex flex-col group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(30, 58, 95, 0.1)" }}
                >
                  <offering.icon size={20} style={{ color: "#1e3a5f" }} />
                </div>
                <ArrowRight
                  size={14}
                  className="opacity-0 group-hover:opacity-50 -translate-x-1 group-hover:translate-x-0 transition-all"
                />
              </div>
              <h3 className="text-base font-semibold mb-1.5">{offering.title}</h3>
              <p className="text-sm opacity-55 leading-relaxed flex-1">
                {offering.description}
              </p>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}
