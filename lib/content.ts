/**
 * Single source of truth for every claim on the site.
 * Everything here comes from Naveen's supplied brief. Anything not supplied
 * is marked `PLACEHOLDER` instead of being invented.
 */

export const profile = {
  name: "Naveen B",
  role: "Generative AI Engineer",
  specialization: "Full-Stack & Agentic Systems",
  headline: "I build intelligent systems that think, reason, and act.",
  supporting: "Engineering agentic AI systems, production APIs, and intelligent products.",
  location: "Based in India",
  focus: ["AI", "Agents", "Systems", "Open Source"],
  email: "naveensbsf123@gmail.com",
  github: "https://github.com/NA-V10",
  githubHandle: "NA-V10",
  linkedin: "https://linkedin.com/in/naveen-b-7ab544326",
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const seo = {
  title: "Naveen B — Generative AI Engineer | Full-Stack & Agentic Systems",
  description:
    "Portfolio of Naveen B, a Generative AI Engineer building agentic AI systems, full-stack applications, intelligent automation, and open-source software.",
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Open Source", href: "#open-source" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const intro = {
  headline: ["I don't just use AI tools.", "I build AI systems."],
  statement:
    "Forward Deployed Engineer at Synapt, building production-grade agentic AI systems and full-stack applications — from the retrieval layer to the interface.",
  focus: [
    "Agentic AI",
    "Multi-agent systems",
    "RAG / Graph RAG",
    "MCP",
    "Backend engineering",
    "Distributed systems",
    "Open source",
  ],
};

export const about = {
  statement:
    "I build systems at the intersection of generative AI, backend engineering, and intelligent automation.",
  pillars: ["AI Agents", "System Design", "Open Source", "Full-Stack Engineering", "Developer Tools"],
};

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectId = "cybersentinel" | "intellicourse" | "dailydocs";

export type Project = {
  id: ProjectId;
  index: string;
  title: string;
  fullTitle: string;
  oneLiner: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  /** null → no public repository was supplied. */
  github: string | null;
};

export const projects: Project[] = [
  {
    id: "cybersentinel",
    index: "01",
    title: "CyberSentinel",
    fullTitle: "CyberSentinel Command Center",
    oneLiner: "An agentic Graph RAG cybersecurity platform for AI-powered incident response.",
    stack: ["LangGraph", "Neo4j", "Qdrant", "PostgreSQL", "MCP"],
    metrics: [
      { value: "12", label: "Orchestrated agents" },
      { value: "9", label: "MCP tools" },
      { value: "3", label: "LLMs" },
    ],
    github: "https://github.com/NA-V10/CyberSentinel",
  },
  {
    id: "intellicourse",
    index: "02",
    title: "IntelliCourse AI",
    fullTitle: "IntelliCourse AI",
    oneLiner: "AI-powered university course discovery and career simulation.",
    stack: ["FastAPI", "Next.js", "OpenAI", "Neo4j", "Redis", "ChromaDB"],
    metrics: [
      { value: "6", label: "Dimension probability model" },
      { value: "9", label: "REST endpoints" },
    ],
    // PLACEHOLDER: no public repository supplied for IntelliCourse AI.
    github: null,
  },
  {
    id: "dailydocs",
    index: "03",
    title: "DailyDocs",
    fullTitle: "DailyDocs",
    oneLiner: "Privacy-first document utility platform.",
    stack: ["Next.js", "TypeScript", "Vercel"],
    metrics: [
      { value: "0", label: "Sign-ups required" },
      { value: "3", label: "Portal presets" },
    ],
    github: "https://github.com/NA-V10/DailyDocs",
  },
];

export const cyberSentinel = {
  title: ["CyberSentinel", "Command Center"],
  subtitle: "Agentic AI for Cybersecurity Incident Response",
  architectureNote: "10-layer interactive system architecture",
  pipeline: [
    { id: "incident", label: "Incident", detail: "A security incident enters the platform." },
    { id: "detection", label: "Detection", detail: "Incident detection and triage." },
    {
      id: "orchestration",
      label: "Agent Orchestration",
      detail: "12 agents orchestrated with LangGraph across 3 LLMs.",
    },
    {
      id: "retrieval",
      label: "Graph RAG + Vector Retrieval",
      detail: "Hybrid graph + vector retrieval over Neo4j and Qdrant.",
    },
    { id: "investigation", label: "Investigation", detail: "Agent-driven investigation with MCP tools." },
    { id: "decision", label: "Decision", detail: "Findings converge into a response decision." },
    { id: "response", label: "Response", detail: "Response actions, with Jira integration." },
  ],
  stats: [
    { value: "12", label: "Agents" },
    { value: "9", label: "MCP Tools" },
    { value: "3", label: "LLMs" },
  ],
  stack: ["Neo4j", "Qdrant", "PostgreSQL", "LangGraph", "MCP"],
  capabilities: [
    "Incident detection",
    "Triage",
    "Investigation",
    "Response",
    "Hybrid Graph + Vector retrieval",
    "Multi-agent orchestration",
    "SOC automation",
    "Jira integration",
    "Multi-tenant SaaS architecture",
  ],
};

export const intelliCourse = {
  title: "IntelliCourse AI",
  subtitle: "AI-powered university course discovery and career simulation.",
  stack: ["FastAPI", "Next.js", "OpenAI", "Neo4j", "Redis", "ChromaDB"],
  retrieval: {
    inputs: ["BM25", "Semantic Embeddings"],
    stages: ["CrossEncoder", "Re-ranking", "Progressive SSE Streaming"],
  },
  futurePath: {
    name: "FuturePath AI",
    description:
      "A career-simulation engine generating multi-timeline projections using a six-dimension weighted probability model and natural-language what-if analysis.",
  },
  highlights: [
    "Memory-aware personalization",
    "Neo4j knowledge graph",
    "9 REST endpoints",
    "Redis + in-memory caching",
    "Query embedding cache",
    "Cache warming",
  ],
  graphEntities: [
    { id: "kg:users", label: "Users" },
    { id: "kg:courses", label: "Courses" },
    { id: "kg:skills", label: "Skills" },
    { id: "kg:careers", label: "Careers" },
    { id: "kg:timelines", label: "Timelines" },
  ],
};

export const dailyDocs = {
  title: "DailyDocs",
  subtitle: "Privacy-first document utility platform.",
  stack: ["Next.js", "TypeScript", "Vercel"],
  capabilities: [
    "PDF compression",
    "PDF merge",
    "PDF split",
    "PDF conversion",
    "PDF editing",
    "Image utilities",
  ],
  differentiator: ["No sign-up.", "No server-side document storage.", "In-memory processing."],
  presets: ["Passport Seva", "UPSC", "SSC"],
  presetNote:
    "Portal-specific presets package uploads according to each government portal's required size and format.",
};

/* ------------------------------------------------------------------ */
/* Open source                                                         */
/* ------------------------------------------------------------------ */

export type OssRepo = {
  id: string;
  name: string;
  /** Merged PRs explicitly supplied for this repository; null when no count was given. */
  prs: number | null;
  summary: string;
  topics?: string[];
};

export const openSource = {
  headline: "15+ merged pull requests across major engineering projects.",
  repos: [
    { id: "oss:kubernetes", name: "Kubernetes", prs: null, summary: "Improved Node architecture documentation." },
    {
      id: "oss:jenkins",
      name: "Jenkins",
      prs: 4,
      summary: "4 merged PRs covering Docker, Linux and Windows setup documentation.",
      topics: ["Docker", "Linux", "Windows"],
    },
    { id: "oss:github-docs", name: "GitHub Docs", prs: null, summary: "CLI quickstart documentation." },
    { id: "oss:agones", name: "Google Agones", prs: null, summary: "Allocator, ping and HA behavior contribution." },
    {
      id: "oss:dl4j",
      name: "Eclipse Deeplearning4j",
      prs: 5,
      summary: "5 merged PRs adding READMEs and inline documentation.",
      topics: ["CNN", "Feedforward", "Autoencoder", "RNN", "VAE"],
    },
  ] satisfies OssRepo[],
};

/** Satellites drawn per repo: the stated PR count, or a single contribution marker. */
export const ossNodeCount = (r: OssRepo) => r.prs ?? 1;

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export type Experience = {
  id: string;
  role: string;
  company: string;
  /** Omitted when not supplied. */
  location?: string;
  /** e.g. "Full-time" — omitted for internships listed by role title. */
  type?: string;
  /** True for the role held now. */
  current?: boolean;
  period: string;
  stage: string;
  summary?: string;
  points: string[];
};

/** Chronological order — the timeline reads left (earliest) to right (latest). */
export const experience: Experience[] = [
  {
    id: "xp:zidio",
    role: "UI/UX Intern",
    company: "Zidio Development",
    location: "Remote",
    period: "May 2025 – Jun 2025",
    stage: "UI/UX",
    summary: "Designed “Zidio Learning” — 38 interactive gamified screens.",
    points: ["Competitive analysis", "Personas", "Wireframing", "Low-fidelity design", "High-fidelity design"],
  },
  {
    id: "xp:hepro",
    role: "AI / ML Intern",
    company: "HePro AI",
    location: "Remote",
    period: "Dec 2025 – Feb 2026",
    stage: "AI/ML",
    points: [
      "Data sourcing",
      "Data cleaning",
      "Preprocessing",
      "EDA",
      "Model training",
      "Evaluation",
      "Feature selection",
    ],
  },
  {
    id: "xp:devarena",
    role: "Java Full Stack Developer",
    company: "The Developers Arena",
    location: "Remote",
    period: "Dec 2025 – Mar 2026",
    stage: "Full Stack",
    summary: "Built event-driven microservices and improved system scalability.",
    points: ["React", "Spring Boot", "Kafka", "JWT", "RBAC", "Redis", "Docker", "CI/CD", "Kubernetes"],
  },
  {
    id: "xp:prodapt",
    role: "AI Intern",
    company: "Prodapt",
    location: "Chennai",
    period: "Feb 2026 – Jun 2026",
    stage: "Generative AI",
    points: [
      "Designed agentic LLM pipelines",
      "LangChain / LangGraph",
      "Multi-step reasoning",
      "Tool calling",
      "Python/FastAPI production services",
      "Cloud/data engineering",
      "Production deployment",
      "Monitoring",
      "Stakeholder-driven iteration",
      "Translating business requirements into agent architectures",
    ],
  },
  {
    id: "xp:synapt",
    role: "Forward Deployed Engineer (FDE)",
    company: "Synapt",
    // PLACEHOLDER: location not supplied.
    type: "Full-time",
    current: true,
    period: "Jul 2026 – Present",
    stage: "Forward Deployed Engineer",
    summary: "Full-time Forward Deployed Engineer at a product-based company.",
    points: ["Agentic AI", "Automation", "Context Engineering", "Azure"],
  },
];

export const progression = ["UI/UX", "AI/ML", "Full Stack", "Generative AI", "Forward Deployed Engineer", "Agentic Systems"];

export const education = {
  school: "VIT University",
  location: "Vellore",
  degree: "B.Tech — Computer Science Engineering",
  period: "Sep 2022 – Jul 2026",
};

export type Certification = {
  name: string;
  /** Exam code, where one applies. */
  code?: string;
  issuer: string;
  /** null → no date supplied yet. */
  date: string | null;
};

/** Listed in display order. */
export const certifications: Certification[] = [
  {
    name: "Claude Certified Developer – Foundations",
    code: "CCDV-F",
    issuer: "Anthropic",
    // PLACEHOLDER: issue date not supplied.
    date: null,
  },
  { name: "IBM Generative AI", issuer: "IBM", date: "June 2025" },
];

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export const skills = [
  { id: "sk:languages", label: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "Kotlin"] },
  {
    id: "sk:genai",
    label: "AI / GenAI",
    items: ["LangChain", "LangGraph", "Agentic Workflows", "Multi-Agent Orchestration", "RAG", "Graph RAG", "Google ADK", "MCP"],
  },
  { id: "sk:vision", label: "AI / Computer Vision", items: ["TensorFlow", "MediaPipe", "OpenCV"] },
  {
    id: "sk:backend",
    label: "Backend",
    items: ["FastAPI", "Spring Boot", "Node.js", "Express.js", "REST APIs", "Microservices", "Kafka", "JWT", "RBAC", "Redis"],
  },
  { id: "sk:infra", label: "Data / Infra", items: ["Neo4j", "Qdrant", "PostgreSQL", "Docker", "Kubernetes", "CI/CD"] },
  { id: "sk:frontend", label: "Frontend", items: ["React", "Next.js", "React Native", "HTML", "CSS", "GSAP"] },
  { id: "sk:cloud", label: "Cloud / Design", items: ["Vercel", "Render", "Fly.io", "Figma", "Wireframing", "User Research"] },
];

export const contact = {
  statement: "Let's build something intelligent.",
  supporting:
    "Open to conversations around AI engineering, agentic systems, developer infrastructure, and ambitious products.",
};
