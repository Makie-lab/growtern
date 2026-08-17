export type RoleCategory =
  | "engineering"
  | "design"
  | "data"
  | "cloud"
  | "management"
  | "security"
  | "creative";

export interface RoleComparison {
  name: string;
  salaryRange: string;
  focus: string;
  graduationPick: string;
  companyExpectations: string[];
  category: RoleCategory;
}

export const roleComparisons: RoleComparison[] = [
  {
    name: "Frontend Developer",
    salaryRange: "$12k - $55k",
    focus:
      "Building user-facing interfaces with HTML, CSS, and JavaScript frameworks like React, Vue, or Angular. Focuses on responsive design, accessibility, and performance optimization to deliver seamless user experiences across devices.",
    graduationPick: "18%",
    companyExpectations: [
      "Proficiency in React, Vue, or Angular with TypeScript",
      "Understanding of responsive design and cross-browser compatibility",
      "Experience with state management and REST/GraphQL APIs",
      "Portfolio showcasing real projects with clean, accessible UI",
    ],
    category: "engineering",
  },
  {
    name: "Backend Developer",
    salaryRange: "$14k - $60k",
    focus:
      "Designing and maintaining server-side logic, databases, and APIs that power applications. Handles authentication, data processing, system architecture, and ensures scalability under heavy traffic loads.",
    graduationPick: "15%",
    companyExpectations: [
      "Strong knowledge of Node.js, Python, Java, or Go",
      "Database design skills (SQL and NoSQL)",
      "Experience building and documenting RESTful or GraphQL APIs",
      "Understanding of security best practices and authentication flows",
    ],
    category: "engineering",
  },
  {
    name: "Full Stack Developer",
    salaryRange: "$15k - $65k",
    focus:
      "Bridging frontend and backend development to deliver complete web applications end-to-end. Handles everything from UI components to database schemas, deployment pipelines, and API integrations.",
    graduationPick: "22%",
    companyExpectations: [
      "Competence in both frontend frameworks and backend languages",
      "Ability to design database schemas and manage deployments",
      "Understanding of CI/CD pipelines and cloud hosting",
      "Strong problem-solving skills and ability to own features end-to-end",
    ],
    category: "engineering",
  },
  {
    name: "Data Analyst",
    salaryRange: "$10k - $45k",
    focus:
      "Transforming raw data into actionable business insights through statistical analysis, visualization, and reporting. Works closely with stakeholders to identify trends, measure KPIs, and support data-driven decision making.",
    graduationPick: "12%",
    companyExpectations: [
      "Proficiency in SQL, Python/R, and visualization tools (Tableau, Power BI)",
      "Strong analytical thinking and attention to detail",
      "Experience cleaning, transforming, and interpreting large datasets",
      "Ability to communicate findings clearly to non-technical stakeholders",
    ],
    category: "data",
  },
  {
    name: "UI/UX Designer",
    salaryRange: "$10k - $48k",
    focus:
      "Crafting intuitive, visually compelling digital experiences through user research, wireframing, prototyping, and usability testing. Balances aesthetic design with user needs and business goals to create products people love to use.",
    graduationPick: "9%",
    companyExpectations: [
      "Expertise in Figma, Sketch, or Adobe XD with strong portfolio",
      "Understanding of user research methodologies and usability testing",
      "Knowledge of design systems, accessibility standards, and interaction patterns",
      "Ability to collaborate with developers and translate designs into specs",
    ],
    category: "design",
  },
  {
    name: "Mobile Developer",
    salaryRange: "$13k - $58k",
    focus:
      "Building native or cross-platform mobile applications for iOS and Android. Focuses on smooth performance, offline capabilities, push notifications, and platform-specific design patterns that users expect.",
    graduationPick: "8%",
    companyExpectations: [
      "Experience with React Native, Flutter, Swift, or Kotlin",
      "Understanding of mobile UX patterns and platform guidelines",
      "Knowledge of app store deployment and mobile CI/CD",
      "Ability to optimize for performance, battery life, and offline use",
    ],
    category: "engineering",
  },
  {
    name: "DevOps Engineer",
    salaryRange: "$18k - $70k",
    focus:
      "Automating infrastructure, managing CI/CD pipelines, and ensuring system reliability at scale. Bridges development and operations to enable faster, safer deployments while maintaining monitoring and incident response capabilities.",
    graduationPick: "5%",
    companyExpectations: [
      "Proficiency with Docker, Kubernetes, and infrastructure-as-code (Terraform)",
      "Experience with CI/CD tools (GitHub Actions, Jenkins, GitLab CI)",
      "Strong Linux administration and scripting skills",
      "Understanding of monitoring, logging, and incident response",
    ],
    category: "cloud",
  },
  {
    name: "Cybersecurity",
    salaryRange: "$16k - $65k",
    focus:
      "Protecting systems, networks, and data from cyber threats through vulnerability assessment, penetration testing, and security architecture. Develops security policies, responds to incidents, and ensures regulatory compliance.",
    graduationPick: "4%",
    companyExpectations: [
      "Knowledge of network security, encryption, and authentication protocols",
      "Experience with penetration testing tools and vulnerability scanning",
      "Understanding of compliance frameworks (ISO 27001, SOC 2, GDPR)",
      "Incident response and threat detection capabilities",
    ],
    category: "security",
  },
  {
    name: "AI/ML Engineer",
    salaryRange: "$18k - $75k",
    focus:
      "Designing, training, and deploying machine learning models that solve real-world problems. Works with large datasets, neural networks, NLP, and computer vision to build intelligent systems that learn and improve over time.",
    graduationPick: "10%",
    companyExpectations: [
      "Strong Python skills with TensorFlow, PyTorch, or scikit-learn",
      "Understanding of statistics, linear algebra, and ML algorithms",
      "Experience with data pipelines and model deployment (MLOps)",
      "Ability to translate business problems into ML solutions",
    ],
    category: "data",
  },
  {
    name: "Project Manager",
    salaryRange: "$12k - $50k",
    focus:
      "Planning, executing, and delivering technology projects on time and within budget. Coordinates cross-functional teams, manages stakeholder expectations, mitigates risks, and ensures alignment between business objectives and technical execution.",
    graduationPick: "6%",
    companyExpectations: [
      "Familiarity with Agile, Scrum, and project management tools (Jira, Asana)",
      "Strong communication and stakeholder management skills",
      "Ability to break down complex projects into manageable deliverables",
      "Risk assessment and resource planning experience",
    ],
    category: "management",
  },
  {
    name: "Cloud Architect",
    salaryRange: "$22k - $80k",
    focus:
      "Designing scalable, secure, and cost-effective cloud infrastructure solutions across AWS, Azure, or GCP. Defines architecture patterns, migration strategies, and governance frameworks that support business growth.",
    graduationPick: "3%",
    companyExpectations: [
      "Deep expertise in AWS, Azure, or GCP architecture and services",
      "Experience designing multi-tier, highly available distributed systems",
      "Knowledge of cost optimization, security best practices, and compliance",
      "Strong documentation and ability to mentor engineering teams",
    ],
    category: "cloud",
  },
  {
    name: "Product Manager",
    salaryRange: "$14k - $55k",
    focus:
      "Defining product vision, strategy, and roadmap by synthesizing user needs, market data, and business goals. Prioritizes features, writes requirements, and works with engineering and design teams to ship products that create value.",
    graduationPick: "5%",
    companyExpectations: [
      "Ability to define product strategy backed by user research and data",
      "Experience writing PRDs, user stories, and acceptance criteria",
      "Strong cross-functional communication with engineering and design",
      "Understanding of metrics, A/B testing, and iterative product development",
    ],
    category: "management",
  },
  {
    name: "Data Engineer",
    salaryRange: "$16k - $68k",
    focus:
      "Building and maintaining the data infrastructure that powers analytics and ML. Designs data pipelines, warehouses, and ETL processes that ensure reliable, clean, and accessible data for the entire organization.",
    graduationPick: "6%",
    companyExpectations: [
      "Proficiency in SQL, Python, and big data tools (Spark, Airflow, dbt)",
      "Experience building ETL/ELT pipelines and data warehouses",
      "Knowledge of cloud data services (BigQuery, Redshift, Snowflake)",
      "Understanding of data modeling, quality, and governance practices",
    ],
    category: "data",
  },
  {
    name: "QA Engineer",
    salaryRange: "$10k - $42k",
    focus:
      "Ensuring software quality through manual testing, test automation, and quality processes. Designs test strategies, writes automated test suites, identifies edge cases, and collaborates with developers to prevent defects before they reach users.",
    graduationPick: "4%",
    companyExpectations: [
      "Experience with test automation frameworks (Selenium, Cypress, Playwright)",
      "Understanding of testing methodologies and test case design",
      "Ability to write clear bug reports and work within CI/CD pipelines",
      "Knowledge of performance testing and API testing tools",
    ],
    category: "engineering",
  },
];

export const roleCategories: { label: string; value: RoleCategory }[] = [
  { label: "Engineering", value: "engineering" },
  { label: "Design", value: "design" },
  { label: "Data", value: "data" },
  { label: "Cloud", value: "cloud" },
  { label: "Management", value: "management" },
  { label: "Security", value: "security" },
  { label: "Creative", value: "creative" },
];
