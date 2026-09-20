export type Skill = {
  name: string;
  group: string;
  /** Project ids (from src/data/projects.ts) that verifiably use this skill. */
  projects?: string[];
};

export const skillGroups = [
  "Languages",
  "Web",
  "CMS",
  "Frameworks",
  "Databases",
  "DevOps & Tools",
  "Core Concepts",
] as const;

export const skills: Skill[] = [
  { name: "C", group: "Languages" },
  { name: "Java", group: "Languages" },
  { name: "Python", group: "Languages", projects: ["recommendation-system"] },
  { name: "Dart", group: "Languages" },

  { name: "HTML", group: "Web" },
  {
    name: "JavaScript",
    group: "Web",
    projects: ["fiteats", "pathfinder"],
  },
  {
    name: "React JS",
    group: "Web",
    projects: ["fiteats", "medconnect", "pathfinder", "transithub", "khet-se-ghar-tak"],
  },
  {
    name: "React TS",
    group: "Web",
    projects: ["medconnect", "transithub", "khet-se-ghar-tak"],
  },

  { name: "WordPress", group: "CMS" },

  { name: "Node.js", group: "Frameworks", projects: ["fiteats"] },
  { name: "Express.js", group: "Frameworks", projects: ["fiteats", "medconnect"] },
  {
    name: "Tailwind CSS",
    group: "Frameworks",
    projects: ["medconnect", "transithub", "khet-se-ghar-tak"],
  },
  { name: "Flutter", group: "Frameworks" },
  { name: "Streamlit", group: "Frameworks", projects: ["recommendation-system"] },

  { name: "MongoDB", group: "Databases", projects: ["fiteats", "medconnect"] },
  { name: "MySQL", group: "Databases" },
  { name: "PostgreSQL", group: "Databases" },

  { name: "Docker", group: "DevOps & Tools" },
  { name: "Git", group: "DevOps & Tools" },
  { name: "GitHub", group: "DevOps & Tools" },

  { name: "Data Structures & Algorithms", group: "Core Concepts" },
  { name: "REST APIs", group: "Core Concepts" },
  { name: "Responsive Design", group: "Core Concepts" },
  { name: "Database Design", group: "Core Concepts" },
  { name: "Algorithm Visualization", group: "Core Concepts", projects: ["pathfinder"] },
];

export const spokenLanguages = ["Bengali", "English", "Hindi"] as const;
