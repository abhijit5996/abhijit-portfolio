export type SocialLink = {
  label: string;
  value: string;
  href: string;
  icon: "mail" | "github" | "linkedin" | "pin";
};

export const social: SocialLink[] = [
  {
    label: "Email",
    value: "abhijitskv3@gmail.com",
    href: "mailto:abhijitskv3@gmail.com",
    icon: "mail",
  },
  {
    label: "GitHub",
    value: "github.com/abhijit5996",
    href: "https://github.com/abhijit5996",
    icon: "github",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/abhijit-das-2449a2270",
    href: "https://www.linkedin.com/in/abhijit-das-2449a2270/",
    icon: "linkedin",
  },
  {
    label: "Location",
    value: "Dumdum, West Bengal, India",
    href: "https://www.google.com/maps/search/Dumdum,+West+Bengal,+India",
    icon: "pin",
  },
];

export const navSections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Stack" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
