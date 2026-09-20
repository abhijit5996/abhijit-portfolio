import fiteats from "@/assets/project-fiteats.jpg";
import recsys from "@/assets/project-recsys.jpg";
import medconnect from "@/assets/project-medconnect.jpg";
import pathfinder from "@/assets/project-pathfinder.jpg";
import transithub from "@/assets/project-transithub.jpg";
import khet from "@/assets/project-khetseghartak.jpg";

export type Project = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  status: "LIVE" | "IN BUILD" | "SOURCE";
  summary: string;
  highlights: string[];
  stack: string[];
  image: string;
  imageAlt: string;
  live?: string;
  repo: string;
  featured?: boolean;
};

/** Resume-backed project record. Edit here — the UI reads this list only. */
export const projects: Project[] = [
  {
    id: "medconnect",
    index: "001",
    title: "MedConnect",
    subtitle: "Full-Stack Healthcare Management Platform",
    status: "LIVE",
    summary:
      "A healthcare management platform covering appointment booking, patient records, health vitals monitoring and telemedicine workflows.",
    highlights: [
      "Role-based authentication with separate dashboards for patients, doctors and administrators.",
      "Appointment management, availability scheduling and patient history access.",
      "Express.js APIs and MongoDB data management behind a responsive frontend.",
    ],
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Express.js", "MongoDB"],
    image: medconnect,
    imageAlt: "MedConnect dashboard with appointments, patient vitals and doctor list",
    live: "https://medconnect-8x1l.onrender.com",
    repo: "https://github.com/abhijit5996/MedConnect",
    featured: true,
  },
  {
    id: "fiteats",
    index: "002",
    title: "FitEats",
    subtitle: "Food Ordering & Recommendation Platform",
    status: "LIVE",
    summary:
      "A full-stack food ordering application featuring a personalized recommendation engine to enhance user engagement.",
    highlights: [
      "Developed and deployed the full-stack ordering application on Render.",
      "Personalized recommendation engine integrated into the ordering flow.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB"],
    image: fiteats,
    imageAlt: "FitEats meal ordering interface with nutrition summary",
    live: "https://final-nutriorder.onrender.com",
    repo: "https://github.com/abhijit5996/FitEats-Food-Recommendation-and-Delivery-Partner",
    featured: true,
  },
  {
    id: "recommendation-system",
    index: "003",
    title: "Intelligent Recommendation System",
    subtitle: "ML-Based Suggestion Engine",
    status: "SOURCE",
    summary:
      "A machine-learning recommendation engine using content-based filtering to provide tailored user suggestions.",
    highlights: ["Engineered a recommendation engine using content-based filtering techniques."],
    stack: ["Python", "Pandas", "NumPy", "Streamlit", "Machine Learning"],
    image: recsys,
    imageAlt: "Streamlit recommendation dashboard with similarity scores",
    repo: "https://github.com/abhijit5996/Python-Project-Recommendation-System",
  },
  {
    id: "pathfinder",
    index: "004",
    title: "PathFinder",
    subtitle: "Travelling Salesman Problem Visualization Tool",
    status: "SOURCE",
    summary:
      "An interactive algorithm visualization tool that computes and maps optimal routes across complex multi-node networks.",
    highlights: ["Interactive visualization of route optimization and TSP concepts."],
    stack: ["React.js", "JavaScript", "Algorithm Visualization"],
    image: pathfinder,
    imageAlt: "Route optimization visualizer with nodes and optimal path",
    repo: "https://github.com/abhijit5996/pathfinder-pro",
  },
  {
    id: "transithub",
    index: "005",
    title: "TransitHub",
    subtitle: "Last-Mile Transit Solution",
    status: "SOURCE",
    summary: "A scalable transit platform focused on last-mile transportation.",
    highlights: [
      "Architected with TypeScript for type-safe components, improving maintainability and reducing runtime errors.",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS"],
    image: transithub,
    imageAlt: "Transit platform with routes, live map and schedules",
    repo: "https://github.com/abhijit5996/Transit-Hub",
  },
  {
    id: "khet-se-ghar-tak",
    index: "006",
    title: "Khet-se-ghar-tak",
    subtitle: "Farm-to-Table E-Commerce Platform",
    status: "SOURCE",
    summary:
      "A responsive farm-to-consumer e-commerce platform designed to facilitate direct farmer-to-consumer transactions.",
    highlights: [
      "Engineered to streamline the supply chain between farmers and consumers.",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS"],
    image: khet,
    imageAlt: "Farm-to-table e-commerce storefront with produce and farmer profiles",
    repo: "https://github.com/abhijit5996/grocer-roots-link",
  },
];
