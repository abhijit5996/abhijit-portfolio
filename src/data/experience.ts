export type ExperienceEntry = {
  org: string;
  orgNote: string;
  role: string;
  domain: string;
  status: string;
  points: string[];
  stack: string[];
};

export const experience: ExperienceEntry[] = [
  {
    org: "Atos",
    orgNote: "Global IT Solutions",
    role: "CloudOps & AI Engineer Intern",
    domain: "AI · Cloud · Enterprise Automation",
    status: "ACTIVE",
    points: [
      "Developing enterprise-grade Agentic AI solutions for real-world business applications.",
      "Managing cloud infrastructure, deployments and services on Microsoft Azure to ensure reliability and scalability.",
      "Partnering with engineering teams to build and deliver AI-powered solutions for global enterprise clients.",
    ],
    stack: ["Agentic AI", "Microsoft Azure", "Cloud Operations"],
  },
];
