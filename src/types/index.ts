export type DomainId =
  | "womens-safety"
  | "sports"
  | "academics"
  | "mental-health"
  | "campus"
  | "career"
  | "other";

export interface Domain {
  id: DomainId;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

export type UrgencyLevel = "low" | "medium" | "urgent" | "critical";

export type QuestionStatus = "open" | "under-review" | "in-progress" | "resolved";

export interface Comment {
  id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: number;
}

export interface Question {
  id: string;
  title: string;
  details?: string;
  domain: DomainId;
  author: string;
  authorName: string;
  date: number;
  upvotes: number;
  upvotedBy: string[]; // email array
  status: QuestionStatus;
  urgency: UrgencyLevel;
  isAnonymous?: boolean;
  comments: Comment[];
  tags?: string[];
}

export interface User {
  name: string;
  email: string;
  password?: string;
  department?: string;
  role?: "student" | "faculty" | "admin";
  avatar?: string;
}

export type FilterDomain = DomainId | "all";
export type SortOption = "newest" | "oldest" | "most-upvoted" | "most-discussed";
