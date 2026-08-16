"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useQuestions } from "@/context/QuestionsContext";
import { useToast } from "@/components/Toast";
import DomainSelector from "@/components/DomainSelector";
import { DomainId, UrgencyLevel } from "@/types";
import {
  Send,
  ArrowLeft,
  Shield,
  AlertTriangle,
  Tag,
  UserCheck,
  Eye,
  CheckCircle2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PostPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addQuestion } = useQuestions();
  const { toast } = useToast();

  const [domain, setDomain] = useState<DomainId | null>(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [urgency, setUrgency] = useState<UrgencyLevel>("low");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!domain) {
      setError("Please select a domain category for your inquiry.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a question title.");
      return;
    }

    setSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    const created = await addQuestion({
      domain,
      title: title.trim(),
      details: details.trim(),
      urgency,
      isAnonymous,
      tags,
    });

    toast("Question submitted successfully!", "success");

    setTimeout(() => {
      router.push("/questions");
    }, 600);
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button & Page header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 mb-3 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Post Your Problem
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Share your feedback, report a campus concern, or ask for administrative clarification.
        </p>
      </div>

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-sm space-y-7"
      >
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Domain Selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span>1. Choose Domain Category</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-gray-400">Select closest fit</span>
          </div>
          <DomainSelector selected={domain} onSelect={(id) => setDomain(id)} />
        </div>

        {/* 2. Question Title */}
        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-white mb-2">
            <span>2. Question / Issue Title</span>
            <span className="text-rose-500 ml-1">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Non-functional streetlights along Girls Hostel path"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition"
          />
        </div>

        {/* 3. Detailed Description */}
        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-white mb-2">
            3. Detailed Description (Optional)
          </label>
          <textarea
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide context, specific locations (e.g. Block C, Room 204), or suggestions to help administration take quick action..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed transition"
          />
        </div>

        {/* 4. Priority / Urgency Level */}
        <div>
          <label className="block text-sm font-bold text-gray-800 dark:text-white mb-2">
            4. Urgency Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(
              [
                { id: "low", label: "Normal", desc: "General inquiry" },
                { id: "medium", label: "Medium", desc: "Noticeable issue" },
                { id: "urgent", label: "Urgent", desc: "Needs quick review" },
                { id: "critical", label: "Critical", desc: "Safety / Emergency" },
              ] as const
            ).map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setUrgency(lvl.id)}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all",
                  urgency === lvl.id
                    ? lvl.id === "critical"
                      ? "border-rose-500 bg-rose-50 text-rose-800 font-bold"
                      : "border-indigo-600 bg-indigo-50 text-indigo-800 font-bold"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                )}
              >
                <div className="text-xs font-bold">{lvl.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{lvl.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Tags & Anonymous Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Hostel3, Lighting, Wi-Fi"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Anonymous checkbox */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-gray-200 bg-gray-50/50">
            <div>
              <p className="text-xs font-bold text-gray-800">Post Anonymously</p>
              <p className="text-[10px] text-gray-500">Hide your name and email from public view</p>
            </div>
            <input
              type="checkbox"
              id="anonToggle"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit action */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="text-xs text-gray-400 hidden sm:block">
            Posting as: <span className="font-semibold text-gray-700">{isAnonymous ? "Anonymous" : user?.name || user?.email}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all text-sm"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? "Publishing..." : "Submit Question"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
