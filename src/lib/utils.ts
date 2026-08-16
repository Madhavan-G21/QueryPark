import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DOMAINS } from "./constants";
import { Domain, DomainId, QuestionStatus, UrgencyLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomainInfo(domainId: string): Domain {
  const found = DOMAINS.find((d) => d.id === domainId);
  return (
    found || {
      id: "other",
      label: "Other",
      color: "#64748b",
      bgColor: "bg-slate-50 dark:bg-slate-900/40",
      textColor: "text-slate-600 dark:text-slate-400",
      borderColor: "border-slate-200 dark:border-slate-700",
      icon: "🗂️",
      description: "General topic",
    }
  );
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function getStatusBadge(status: QuestionStatus) {
  switch (status) {
    case "resolved":
      return {
        label: "Resolved",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotClass: "bg-emerald-500",
      };
    case "in-progress":
      return {
        label: "In Progress",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
        dotClass: "bg-amber-500",
      };
    case "under-review":
      return {
        label: "Under Review",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
        dotClass: "bg-blue-500",
      };
    case "open":
    default:
      return {
        label: "Open",
        badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
        dotClass: "bg-indigo-500",
      };
  }
}

export function getUrgencyBadge(urgency: UrgencyLevel) {
  switch (urgency) {
    case "critical":
      return {
        label: "Critical",
        badgeClass: "bg-red-100 text-red-700 border-red-200 font-semibold animate-pulse",
      };
    case "urgent":
      return {
        label: "Urgent",
        badgeClass: "bg-orange-100 text-orange-700 border-orange-200",
      };
    case "medium":
      return {
        label: "Medium",
        badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
      };
    case "low":
    default:
      return {
        label: "Normal",
        badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
      };
  }
}
