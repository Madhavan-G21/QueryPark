import { Domain, Question } from "@/types";

export const SESSION_KEY = "sqp_session";
export const USERS_KEY = "sqp_users";
export const QUESTIONS_KEY = "sqp_questions";

export const DOMAINS: Domain[] = [
  {
    id: "womens-safety",
    label: "Women's Safety",
    color: "#ec4899",
    bgColor: "bg-pink-50 dark:bg-pink-950/40",
    textColor: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-200 dark:border-pink-800",
    icon: "🛡️",
    description: "Lighting, security patrols, safety hotlines, and campus escort requests",
  },
  {
    id: "sports",
    label: "Sports & Athletics",
    color: "#f97316",
    bgColor: "bg-orange-50 dark:bg-orange-950/40",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-800",
    icon: "🏆",
    description: "Courts, sports gear, tournament schedules, and gym equipment",
  },
  {
    id: "academics",
    label: "Academics & Library",
    color: "#6366f1",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/40",
    textColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    icon: "📚",
    description: "Course schedules, library hours, labs, study halls, and tutoring",
  },
  {
    id: "mental-health",
    label: "Mental Health & Wellbeing",
    color: "#10b981",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    textColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    icon: "🧠",
    description: "Counselling services, stress relief events, peer support, and wellness sessions",
  },
  {
    id: "campus",
    label: "Campus Facilities",
    color: "#0ea5e9",
    bgColor: "bg-sky-50 dark:bg-sky-950/40",
    textColor: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-200 dark:border-sky-800",
    icon: "🏫",
    description: "Wi-Fi connectivity, cafeteria food quality, hostel maintenance, and sanitation",
  },
  {
    id: "career",
    label: "Career & Placements",
    color: "#a855f7",
    bgColor: "bg-purple-50 dark:bg-purple-950/40",
    textColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800",
    icon: "💼",
    description: "Internships, placement drives, resume workshops, and alumni networking",
  },
  {
    id: "other",
    label: "General / Other",
    color: "#64748b",
    bgColor: "bg-slate-50 dark:bg-slate-900/40",
    textColor: "text-slate-600 dark:text-slate-400",
    borderColor: "border-slate-200 dark:border-slate-700",
    icon: "🗂️",
    description: "Transportation, lost & found, cultural clubs, and miscellaneous queries",
  },
];

export const INITIAL_QUESTIONS: Question[] = [];

export const DEMO_USERS = [
  {
    name: "Alex Johnson",
    email: "alex.j@college.edu",
    department: "Computer Science & Engineering",
    role: "student" as const,
  },
  {
    name: "Dr. Sarah Mitchell",
    email: "sarah.m@college.edu",
    department: "Student Affairs & Dean Office",
    role: "admin" as const,
  },
];
