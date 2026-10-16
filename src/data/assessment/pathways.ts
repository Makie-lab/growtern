import { computeAhp, fromUpperTriangle, type AhpResult } from "@/lib/ahp";

/**
 * AHP hierarchy used by the assessment.
 *
 *   Goal: identify the best-fit career path
 *    └─ Pathway (Data Analytics, Software Development, Networking, Cybersecurity)
 *        └─ Competencies (5 per pathway, 10 test items each → 50 items per pathway)
 *            └─ Careers — each career has its own pairwise matrix over the
 *               pathway's competencies, giving career-specific weights.
 *
 * Pairwise judgements use Saaty's 1–9 scale and are written as the upper
 * triangle of the matrix (row i compares competency i with i+1 … n).
 */

export type PathwayId = "data-analytics" | "software-development" | "networking" | "cybersecurity";

export const PATHWAY_IDS: PathwayId[] = [
  "data-analytics",
  "software-development",
  "networking",
  "cybersecurity",
];

export interface Competency {
  id: string;
  name: string;
  description: string;
}

export interface CareerDefinition {
  id: string;
  title: string;
  description: string;
  /** Upper triangle of the pairwise comparison matrix over the pathway competencies. */
  judgements: number[][];
}

export interface PathwayDefinition {
  id: PathwayId;
  name: string;
  shortName: string;
  description: string;
  icon: "BarChart3" | "Code2" | "Network" | "ShieldCheck";
  color: string;
  competencies: Competency[];
  /** Upper triangle of the pathway-level pairwise matrix (general competency importance). */
  judgements: number[][];
  careers: CareerDefinition[];
}

export interface WeightedCompetency extends Competency {
  weight: number;
}

export interface Career extends Omit<CareerDefinition, "judgements"> {
  pathway: PathwayId;
  weights: number[];
  ahp: AhpResult;
}

export interface Pathway extends Omit<PathwayDefinition, "judgements" | "careers" | "competencies"> {
  competencies: WeightedCompetency[];
  ahp: AhpResult;
  careers: Career[];
}

const definitions: PathwayDefinition[] = [
  {
    id: "data-analytics",
    name: "Data Analytics",
    shortName: "Data",
    description: "Turn raw data into decisions using statistics, SQL, data wrangling and visualization.",
    icon: "BarChart3",
    color: "#7c3aed",
    competencies: [
      { id: "da-stats", name: "Statistics & Probability", description: "Descriptive and inferential statistics, distributions, hypothesis testing." },
      { id: "da-sql", name: "SQL & Databases", description: "Querying, joining, aggregating and modelling relational data." },
      { id: "da-wrangling", name: "Data Wrangling & Programming", description: "Cleaning and transforming data with Python, pandas and spreadsheets." },
      { id: "da-viz", name: "Data Visualization & BI", description: "Choosing charts, dashboards and BI tools to communicate insight." },
      { id: "da-business", name: "Business Analysis & Communication", description: "KPIs, metrics, experimentation and data storytelling." },
    ],
    judgements: [
      [1 / 2, 1, 2, 2],
      [2, 3, 3],
      [2, 2],
      [1],
    ],
    careers: [
      {
        id: "data-analyst",
        title: "Data Analyst",
        description: "Answers business questions with SQL, spreadsheets and clear reporting.",
        judgements: [[1 / 2, 1, 1 / 2, 1], [2, 1, 2], [1 / 2, 1], [2]],
      },
      {
        id: "bi-analyst",
        title: "Business Intelligence Analyst",
        description: "Builds dashboards and KPI reporting that leadership relies on.",
        judgements: [[1 / 2, 1, 1 / 4, 1 / 3], [2, 1 / 2, 1], [1 / 3, 1 / 2], [2]],
      },
      {
        id: "data-scientist",
        title: "Junior Data Scientist",
        description: "Applies statistics and Python to model, predict and experiment.",
        judgements: [[2, 1, 4, 3], [1 / 2, 2, 2], [4, 3], [1]],
      },
    ],
  },
  {
    id: "software-development",
    name: "Software Development",
    shortName: "Software",
    description: "Design, build and ship reliable applications for the web and beyond.",
    icon: "Code2",
    color: "#2563eb",
    competencies: [
      { id: "sd-prog", name: "Programming Fundamentals", description: "Variables, control flow, functions, OOP and language semantics." },
      { id: "sd-dsa", name: "Data Structures & Algorithms", description: "Arrays, trees, hashing, complexity and classic algorithms." },
      { id: "sd-web", name: "Web Development", description: "HTML, CSS, JavaScript, HTTP and front-end frameworks." },
      { id: "sd-practices", name: "Software Engineering Practices", description: "Version control, testing, SDLC, design principles and DevOps." },
      { id: "sd-dbapi", name: "Databases & APIs", description: "SQL, data modelling, REST and back-end integration." },
    ],
    judgements: [
      [2, 2, 2, 2],
      [1, 1, 1],
      [1, 1],
      [1],
    ],
    careers: [
      {
        id: "frontend-developer",
        title: "Front-end Developer",
        description: "Builds accessible, responsive user interfaces for the web.",
        judgements: [[2, 1 / 2, 2, 3], [1 / 4, 1, 2], [4, 5], [2]],
      },
      {
        id: "backend-developer",
        title: "Back-end Developer",
        description: "Builds APIs, services and data layers that power applications.",
        judgements: [[2, 3, 2, 1], [2, 1, 1 / 2], [1 / 2, 1 / 3], [1 / 2]],
      },
      {
        id: "fullstack-developer",
        title: "Full-stack Developer",
        description: "Delivers features end-to-end, from database to browser.",
        judgements: [[2, 1, 2, 1], [1 / 2, 1, 1 / 2], [2, 1], [1 / 2]],
      },
    ],
  },
  {
    id: "networking",
    name: "Networking",
    shortName: "Network",
    description: "Design, configure and keep enterprise and ISP networks running.",
    icon: "Network",
    color: "#0891b2",
    competencies: [
      { id: "nw-fund", name: "Network Fundamentals", description: "OSI/TCP-IP models, media, devices and protocols." },
      { id: "nw-ip", name: "IP Addressing & Subnetting", description: "IPv4/IPv6 addressing, CIDR and subnet design." },
      { id: "nw-rs", name: "Routing & Switching", description: "VLANs, STP, static and dynamic routing protocols." },
      { id: "nw-svc", name: "Network Services & Wireless", description: "DNS, DHCP, NAT, QoS and Wi-Fi standards." },
      { id: "nw-ops", name: "Troubleshooting & Operations", description: "Diagnostics tools, monitoring and structured troubleshooting." },
    ],
    judgements: [
      [1, 1, 2, 1],
      [1, 2, 1],
      [2, 1],
      [1 / 2],
    ],
    careers: [
      {
        id: "network-engineer",
        title: "Network Engineer",
        description: "Designs and implements routed and switched enterprise networks.",
        judgements: [[1, 1 / 2, 2, 1], [1 / 2, 2, 1], [3, 2], [1 / 2]],
      },
      {
        id: "network-administrator",
        title: "Network Administrator",
        description: "Operates day-to-day network services, users and devices.",
        judgements: [[1, 1, 1, 1 / 2], [1, 1, 1 / 2], [1, 1 / 2], [1 / 2]],
      },
      {
        id: "noc-technician",
        title: "NOC Technician",
        description: "Monitors networks 24/7 and resolves incidents fast.",
        judgements: [[2, 2, 1, 1 / 3], [1, 1 / 2, 1 / 4], [1 / 2, 1 / 4], [1 / 2]],
      },
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    shortName: "Security",
    description: "Protect systems, data and people from cyber threats.",
    icon: "ShieldCheck",
    color: "#dc2626",
    competencies: [
      { id: "cs-grc", name: "Security Principles & Governance", description: "CIA triad, risk, policy, compliance and the Data Privacy Act." },
      { id: "cs-threats", name: "Threats & Vulnerabilities", description: "Malware, social engineering, web and system vulnerabilities." },
      { id: "cs-netsec", name: "Network Security", description: "Firewalls, IDS/IPS, segmentation, VPNs and secure protocols." },
      { id: "cs-crypto", name: "Cryptography & Identity", description: "Encryption, hashing, PKI, authentication and access control." },
      { id: "cs-secops", name: "Security Operations & Incident Response", description: "SIEM, logging, forensics and the incident response lifecycle." },
    ],
    judgements: [
      [1, 1, 1, 1 / 2],
      [1, 2, 1],
      [2, 1],
      [1 / 2],
    ],
    careers: [
      {
        id: "soc-analyst",
        title: "SOC Analyst",
        description: "Detects, triages and responds to security alerts.",
        judgements: [[1 / 3, 1 / 2, 1, 1 / 5], [2, 3, 1 / 2], [2, 1 / 3], [1 / 4]],
      },
      {
        id: "penetration-tester",
        title: "Penetration Tester",
        description: "Ethically attacks systems to find weaknesses before criminals do.",
        judgements: [[1 / 5, 1 / 4, 1 / 2, 1 / 2], [2, 4, 3], [2, 2], [1]],
      },
      {
        id: "grc-analyst",
        title: "GRC / Compliance Analyst",
        description: "Manages risk, policy and regulatory compliance programmes.",
        judgements: [[4, 4, 3, 3], [1, 1, 1], [1 / 2, 1], [2]],
      },
    ],
  },
];

function build(def: PathwayDefinition): Pathway {
  const ahp = computeAhp(fromUpperTriangle(def.judgements));
  const careers: Career[] = def.careers.map(({ judgements, ...career }) => {
    const careerAhp = computeAhp(fromUpperTriangle(judgements));
    return { ...career, pathway: def.id, weights: careerAhp.weights, ahp: careerAhp };
  });
  const { judgements: _j, careers: _c, competencies, ...rest } = def;
  void _j;
  void _c;
  return {
    ...rest,
    competencies: competencies.map((c, i) => ({ ...c, weight: ahp.weights[i] })),
    ahp,
    careers,
  };
}

export const pathways: Pathway[] = definitions.map(build);

export const pathwayById: Record<PathwayId, Pathway> = Object.fromEntries(
  pathways.map((p) => [p.id, p])
) as Record<PathwayId, Pathway>;

export function isPathwayId(value: string): value is PathwayId {
  return (PATHWAY_IDS as string[]).includes(value);
}

export const ITEMS_PER_COMPETENCY = 10;
export const ITEMS_PER_PATHWAY = 50;
export const TOTAL_ITEMS = ITEMS_PER_PATHWAY * PATHWAY_IDS.length; // 200
