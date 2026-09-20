export const education = {
  university: {
    school: "Adamas University",
    degree: "B.Tech Computer Science and Engineering",
    expected: "Expected graduation 2027",
    cgpa: "8.32 / 10.0",
    sgpa: [8.3, 7.68, 7.96, 8.41, 8.65, 8.86],
  },
  school: {
    name: "Saharda Kalipada Vidyapith Higher Secondary School",
    marks: [
      { label: "Class 10", value: "89%" },
      { label: "Class 12", value: "79.4%" },
    ],
  },
} as const;

export type Certification = { title: string; issuer: string };

export const certifications: Certification[] = [
  { title: "Python for Data Science and Programming", issuer: "NPTEL" },
  { title: "Power BI", issuer: "Simplilearn" },
  { title: "Design Thinking", issuer: "Simplilearn" },
];
