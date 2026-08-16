"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useQuestions } from "@/context/QuestionsContext";
import { DOMAINS } from "@/lib/constants";
import { DomainId, QuestionStatus, SortOption } from "@/types";
import QuestionCard from "@/components/QuestionCard";
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { questions, isLoading: questionsLoading } = useQuestions();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<DomainId | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<QuestionStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Read initial query params
  useEffect(() => {
    const domainParam = searchParams.get("domain");
    if (domainParam && (domainParam === "all" || DOMAINS.some((d) => d.id === domainParam))) {
      setSelectedDomain(domainParam as DomainId | "all");
    }
    const statusParam = searchParams.get("status");
    if (statusParam && ["open", "under-review", "in-progress", "resolved"].includes(statusParam)) {
      setSelectedStatus(statusParam as QuestionStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => {
        // Domain match
        if (selectedDomain !== "all" && q.domain !== selectedDomain) return false;
        // Status match
        if (selectedStatus !== "all" && q.status !== selectedStatus) return false;
        // Search query match
        if (searchQuery.trim()) {
          const qText = `${q.title} ${q.details || ""} ${q.authorName} ${q.tags?.join(" ") || ""}`.toLowerCase();
          if (!qText.includes(searchQuery.toLowerCase())) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.date - a.date;
        if (sortBy === "oldest") return a.date - b.date;
        if (sortBy === "most-upvoted") return b.upvotes - a.upvotes;
        if (sortBy === "most-discussed") return (b.comments?.length || 0) - (a.comments?.length || 0);
        return 0;
      });
  }, [questions, selectedDomain, selectedStatus, searchQuery, sortBy]);

  if (authLoading || questionsLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chips = [
    { id: "all" as const, label: "All Topics", icon: "✨", color: "#6366f1" },
    ...DOMAINS,
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("all");
    setSelectedStatus("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery !== "" || selectedDomain !== "all" || selectedStatus !== "all" || sortBy !== "newest";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header with Title and Quick Post CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Campus Question Feed
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse, search, and vote on campus issues and administrative inquiries.
          </p>
        </div>

        <Link
          href="/post"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ask Question</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
        {/* Search input and Sort dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, hostel, location, or tag (e.g. Wi-Fi, Library)..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as QuestionStatus | "all")}
              className="px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="under-review">Under Review</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="most-upvoted">Most Upvoted</option>
              <option value="most-discussed">Most Discussed</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Domain Filter Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {chips.map((d) => {
            const isSelected = selectedDomain === d.id;
            const count =
              d.id === "all"
                ? questions.length
                : questions.filter((q) => q.domain === d.id).length;

            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDomain(d.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  isSelected
                    ? "text-white shadow-xs"
                    : "bg-gray-50/70 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                )}
                style={
                  isSelected
                    ? {
                        backgroundColor: d.color,
                        borderColor: d.color,
                      }
                    : undefined
                }
              >
                <span>{d.icon}</span>
                <span>{d.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                    isSelected ? "bg-white/25 text-white" : "bg-gray-200/80 text-gray-600"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter summary & Results count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <div>
          Showing <span className="font-bold text-gray-900">{filteredQuestions.length}</span>{" "}
          {filteredQuestions.length === 1 ? "question" : "questions"}
          {selectedDomain !== "all" && (
            <span>
              {" "}
              in <span className="font-semibold text-indigo-600">{selectedDomain}</span>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-indigo-600 hover:underline font-semibold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Questions List */}
      {filteredQuestions.length > 0 ? (
        <div className="space-y-3.5">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl">
            🔎
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-800 text-base">No questions found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No questions matched your active filters or search terms. Try modifying your search or
              post a new question.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
            <Link
              href="/post"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
            >
              Post Question
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <QuestionsContent />
    </Suspense>
  );
}
