import type { PathwayId } from "./assessment/pathways";

export interface Expert {
  id: string;
  pathway: PathwayId;
  name: string;
  title: string;
  location: string;
  yearsExperience: number;
  specialties: string[];
  credentials: string[];
  bio: string;
  languages: string[];
  sessionModes: ("Online" | "In-person")[];
  /** Consultation requests are "emailed" here (placeholder outbox for now). */
  email: string;
  /**
   * false = sample profile. Replace with real, consenting experts (and their
   * real contact details) before launch, then set this to true.
   */
  verified: boolean;
}

/** Two Philippines-based experts per pathway. */
export const experts: Expert[] = [
  // ── Data Analytics ──
  {
    id: "da-maria-santos",
    pathway: "data-analytics",
    name: "Maria Santos",
    title: "Lead Data Analyst",
    location: "Makati City, Metro Manila",
    yearsExperience: 9,
    specialties: ["SQL", "Power BI", "Retail analytics"],
    credentials: ["Microsoft Certified: Power BI Data Analyst Associate"],
    bio: "Builds KPI dashboards for retail and fintech teams and mentors career shifters moving into analytics.",
    languages: ["English", "Filipino"],
    sessionModes: ["Online", "In-person"],
    email: "maria.santos@example.com",
    verified: false,
  },
  {
    id: "da-joseph-reyes",
    pathway: "data-analytics",
    name: "Joseph Reyes",
    title: "Senior Data Scientist",
    location: "Cebu City, Cebu",
    yearsExperience: 7,
    specialties: ["Python", "Statistics", "Experimentation"],
    credentials: ["Google Data Analytics Certificate"],
    bio: "Designs A/B tests and forecasting models for BPO and e-commerce operations in the Visayas.",
    languages: ["English", "Filipino", "Cebuano"],
    sessionModes: ["Online"],
    email: "joseph.reyes@example.com",
    verified: false,
  },
  // ── Software Development ──
  {
    id: "sd-angela-cruz",
    pathway: "software-development",
    name: "Angela Cruz",
    title: "Engineering Manager",
    location: "Bonifacio Global City, Taguig",
    yearsExperience: 11,
    specialties: ["React", "TypeScript", "Team leadership"],
    credentials: ["AWS Certified Developer – Associate"],
    bio: "Leads product teams shipping web and mobile apps; runs mock technical interviews for junior devs.",
    languages: ["English", "Filipino"],
    sessionModes: ["Online", "In-person"],
    email: "angela.cruz@example.com",
    verified: false,
  },
  {
    id: "sd-mark-villanueva",
    pathway: "software-development",
    name: "Mark Villanueva",
    title: "Senior Back-end Engineer",
    location: "Quezon City, Metro Manila",
    yearsExperience: 8,
    specialties: ["Node.js", "PostgreSQL", "System design"],
    credentials: ["Oracle Certified Professional, Java SE"],
    bio: "Builds payment and logistics APIs and reviews portfolios and GitHub projects for fresh graduates.",
    languages: ["English", "Filipino"],
    sessionModes: ["Online"],
    email: "mark.villanueva@example.com",
    verified: false,
  },
  // ── Networking ──
  {
    id: "nw-ramon-garcia",
    pathway: "networking",
    name: "Ramon Garcia",
    title: "Senior Network Engineer",
    location: "Pasig City, Metro Manila",
    yearsExperience: 12,
    specialties: ["Routing & switching", "ISP networks", "BGP"],
    credentials: ["Cisco CCNP Enterprise"],
    bio: "Designs carrier and enterprise networks and coaches CCNA candidates through subnetting and labs.",
    languages: ["English", "Filipino"],
    sessionModes: ["Online", "In-person"],
    email: "ramon.garcia@example.com",
    verified: false,
  },
  {
    id: "nw-kristine-mendoza",
    pathway: "networking",
    name: "Kristine Mendoza",
    title: "Network Operations Lead",
    location: "Davao City, Davao del Sur",
    yearsExperience: 6,
    specialties: ["NOC operations", "Wireless", "Monitoring"],
    credentials: ["CompTIA Network+", "Cisco CCNA"],
    bio: "Runs a 24/7 NOC team in Mindanao and helps new technicians build troubleshooting habits.",
    languages: ["English", "Filipino", "Bisaya"],
    sessionModes: ["Online"],
    email: "kristine.mendoza@example.com",
    verified: false,
  },
  // ── Cybersecurity ──
  {
    id: "cs-paolo-delacruz",
    pathway: "cybersecurity",
    name: "Paolo Dela Cruz",
    title: "SOC Manager",
    location: "Ortigas Center, Pasig City",
    yearsExperience: 10,
    specialties: ["SIEM", "Incident response", "Threat hunting"],
    credentials: ["GIAC GCIH", "CompTIA Security+"],
    bio: "Manages a managed-security SOC serving Philippine banks and mentors aspiring SOC analysts.",
    languages: ["English", "Filipino"],
    sessionModes: ["Online", "In-person"],
    email: "paolo.delacruz@example.com",
    verified: false,
  },
  {
    id: "cs-bea-aquino",
    pathway: "cybersecurity",
    name: "Bea Aquino",
    title: "Data Privacy & GRC Consultant",
    location: "Iloilo City, Iloilo",
    yearsExperience: 8,
    specialties: ["Data Privacy Act compliance", "ISO 27001", "Risk assessment"],
    credentials: ["CISA", "ISO/IEC 27001 Lead Auditor"],
    bio: "Helps SMEs and schools comply with RA 10173 and guides students toward GRC careers.",
    languages: ["English", "Filipino", "Hiligaynon"],
    sessionModes: ["Online"],
    email: "bea.aquino@example.com",
    verified: false,
  },
];

export function expertsFor(pathway: PathwayId): Expert[] {
  return experts.filter((e) => e.pathway === pathway);
}

export const expertById = new Map(experts.map((e) => [e.id, e]));
