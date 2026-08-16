"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useQuestions } from "@/context/QuestionsContext";
import { DOMAINS } from "@/lib/constants";
import StatCard from "@/components/StatCard";
import DashboardCharts from "@/components/DashboardCharts";
import QuestionCard from "@/components/QuestionCard";
import {
  PlusCircle,
  Search,
  CheckCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  TrendingUp,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { useToast } from "@/components/Toast";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { questions, isLoading: questionsLoading } = useQuestions();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || questionsLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate KPI metrics
  const totalCount = questions.length;
  const resolvedCount = questions.filter((q) => q.status === "resolved").length;
  const activeCount = questions.filter(
    (q) => q.status === "open" || q.status === "in-progress" || q.status === "under-review"
  ).length;
  const criticalCount = questions.filter(
    (q) => q.urgency === "critical" || q.urgency === "urgent" || q.domain === "womens-safety"
  ).length;

  const recentQuestions = questions.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>QueryPark</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
            <p className="text-indigo-100 text-sm max-w-xl">
              Track open grievances, voice student concerns, and follow administrative updates in
              real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/post"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition-all duration-200 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Ask Question</span>
            </Link>
            <Link
              href="/questions"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2.5 rounded-xl text-sm backdrop-blur-xs transition"
            >
              <Search className="w-4 h-4" />
              <span>Browse All</span>
            </Link>
          </div>
        </div>

        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* KPI Stat Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Questions"
          value={totalCount}
          subtitle="All campus inquiries"
          icon="📊"
          accentColor="#6366f1"
          onClick={() => router.push("/questions")}
        />
        <StatCard
          title="Active & In Progress"
          value={activeCount}
          subtitle="Under active review"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          accentColor="#f59e0b"
          onClick={() => router.push("/questions?status=in-progress")}
        />
        <StatCard
          title="Resolved Inquiries"
          value={resolvedCount}
          subtitle="Successfully addressed"
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          accentColor="#10b981"
          onClick={() => router.push("/questions?status=resolved")}
        />
        <StatCard
          title="High Priority / Safety"
          value={criticalCount}
          subtitle="Critical & safety focus"
          icon={<ShieldAlert className="w-5 h-5 text-pink-600" />}
          iconBg="bg-pink-50"
          accentColor="#ec4899"
          onClick={() => router.push("/questions?domain=womens-safety")}
        />
      </section>

      {/* Category Pills Row */}
      <section className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Browse By Category
          </h3>
          <span className="text-xs text-gray-400">{DOMAINS.length} Domains</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((domain) => {
            const count = questions.filter((q) => q.domain === domain.id).length;
            return (
              <button
                key={domain.id}
                onClick={() => router.push(`/questions?domain=${domain.id}`)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-800 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs font-medium text-gray-700 dark:text-gray-200 group"
              >
                <span>{domain.icon}</span>
                <span className="group-hover:text-indigo-600 font-semibold">{domain.label}</span>
                <span className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-gray-500 border border-gray-200 dark:border-slate-600">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Interactive Charts Section */}
      <section>
        <DashboardCharts questions={questions} />
      </section>

      {/* Recent Questions Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Recent Campus problems
            </h2>
            <p className="text-xs text-gray-500">Latest issues and discussions posted by students</p>
          </div>
          <Link
            href="/questions"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group"
          >
            <span>View All ({questions.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {recentQuestions.length > 0 ? (
          <div className="space-y-3">
            {recentQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} compact={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-3">
            <p className="text-gray-500 text-sm">No questions have been posted yet.</p>
            <Link
              href="/post"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-xl text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post the First Problem</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
