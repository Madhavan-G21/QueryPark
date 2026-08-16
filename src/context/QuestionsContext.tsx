"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Question, QuestionStatus, UrgencyLevel, DomainId, Comment } from "@/types";
import { INITIAL_QUESTIONS, QUESTIONS_KEY } from "@/lib/constants";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

interface QuestionsContextType {
  questions: Question[];
  isLoading: boolean;
  addQuestion: (data: {
    title: string;
    details?: string;
    domain: DomainId;
    urgency?: UrgencyLevel;
    isAnonymous?: boolean;
    tags?: string[];
  }) => Promise<Question>;
  upvoteQuestion: (id: string) => Promise<void>;
  addComment: (questionId: string, content: string) => Promise<void>;
  updateQuestionStatus: (questionId: string, status: QuestionStatus) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
  resetToSampleData: () => Promise<void>;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export function QuestionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const clearQuestions = () => {
    setQuestions([]);
    try {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify([]));
    } catch (e) {
      console.error("Failed to clear questions from localStorage:", e);
    }
  };

  // Helper to persist state to localStorage as cache/fallback
  const saveToLocalCache = (updated: Question[]) => {
    setQuestions(updated);
    try {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist questions to localStorage:", e);
    }
  };

  // Fetch questions from Supabase or fallback to localStorage
  const loadQuestions = async () => {
    setIsLoading(true);
    let loadedFromDb = false;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbQuestions, error: qError } = await supabase
          .from("questions")
          .select("*")
          .order("date", { ascending: false });

        if (!qError && dbQuestions) {
          const { data: dbComments } = await supabase.from("comments").select("*");

          const commentsMap: Record<string, Comment[]> = {};
          if (dbComments) {
            dbComments.forEach((c: any) => {
              if (!commentsMap[c.question_id]) {
                commentsMap[c.question_id] = [];
              }
              commentsMap[c.question_id].push({
                id: c.id,
                author: c.author,
                authorName: c.author_name,
                content: c.content,
                createdAt: Number(c.created_at),
              });
            });
          }

          const formatted: Question[] = dbQuestions.map((q: any) => ({
            id: q.id,
            title: q.title,
            details: q.details || "",
            domain: q.domain,
            author: q.author,
            authorName: q.author_name,
            date: Number(q.date),
            upvotes: q.upvotes || 0,
            upvotedBy: Array.isArray(q.upvoted_by) ? q.upvoted_by : [],
            status: q.status || "open",
            urgency: q.urgency || "low",
            isAnonymous: !!q.is_anonymous,
            tags: Array.isArray(q.tags) ? q.tags : [],
            comments: commentsMap[q.id] || [],
          }));

          saveToLocalCache(formatted);
          loadedFromDb = true;
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local storage:", err);
      }
    }

    if (!loadedFromDb) {
      try {
        const stored = localStorage.getItem(QUESTIONS_KEY);
        if (stored) {
          const parsed: any[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setQuestions(parsed);
          } else {
            clearQuestions();
          }
        } else {
          clearQuestions();
        }
      } catch (e) {
        setQuestions([]);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const addQuestion = async ({
    title,
    details,
    domain,
    urgency = "low",
    isAnonymous = false,
    tags = [],
  }: {
    title: string;
    details?: string;
    domain: DomainId;
    urgency?: UrgencyLevel;
    isAnonymous?: boolean;
    tags?: string[];
  }): Promise<Question> => {
    const authorEmail = user?.email || "anonymous@college.edu";
    const authorDisplayName = isAnonymous
      ? "Anonymous Student"
      : user?.name || authorEmail.split("@")[0];

    const id = `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const date = Date.now();

    const newQuestion: Question = {
      id,
      title: title.trim(),
      details: details?.trim() || "",
      domain,
      author: isAnonymous ? "anonymous" : authorEmail,
      authorName: authorDisplayName,
      date,
      upvotes: 0,
      upvotedBy: [],
      status: "open",
      urgency,
      isAnonymous,
      tags: tags.filter(Boolean),
      comments: [],
    };

    // Update state & cache immediately
    const updated = [newQuestion, ...questions];
    saveToLocalCache(updated);

    // Sync to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("questions").insert([
          {
            id: newQuestion.id,
            title: newQuestion.title,
            details: newQuestion.details,
            domain: newQuestion.domain,
            author: newQuestion.author,
            author_name: newQuestion.authorName,
            date: newQuestion.date,
            upvotes: newQuestion.upvotes,
            upvoted_by: newQuestion.upvotedBy,
            status: newQuestion.status,
            urgency: newQuestion.urgency,
            is_anonymous: newQuestion.isAnonymous,
            tags: newQuestion.tags,
          },
        ]);
      } catch (e) {
        console.error("Failed to sync question to Supabase:", e);
      }
    }

    return newQuestion;
  };

  const upvoteQuestion = async (id: string) => {
    const userEmail = user?.email || "guest_user";
    let targetQuestion: Question | null = null;

    const updated = questions.map((q) => {
      if (q.id === id) {
        const hasUpvoted = q.upvotedBy?.includes(userEmail);
        const upvotedBy = hasUpvoted
          ? q.upvotedBy.filter((email) => email !== userEmail)
          : [...(q.upvotedBy || []), userEmail];

        const updatedQ = {
          ...q,
          upvotes: hasUpvoted ? Math.max(0, q.upvotes - 1) : q.upvotes + 1,
          upvotedBy,
        };
        targetQuestion = updatedQ;
        return updatedQ;
      }
      return q;
    });

    saveToLocalCache(updated);

    if (targetQuestion && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("questions")
          .update({
            upvotes: (targetQuestion as Question).upvotes,
            upvoted_by: (targetQuestion as Question).upvotedBy,
          })
          .eq("id", id);
      } catch (e) {
        console.error("Failed to update upvote in Supabase:", e);
      }
    }
  };

  const addComment = async (questionId: string, content: string) => {
    if (!content.trim()) return;

    const authorEmail = user?.email || "student@college.edu";
    const authorName = user?.name || authorEmail.split("@")[0];

    const newComment: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: authorEmail,
      authorName,
      content: content.trim(),
      createdAt: Date.now(),
    };

    const updated = questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          comments: [...(q.comments || []), newComment],
        };
      }
      return q;
    });

    saveToLocalCache(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("comments").insert([
          {
            id: newComment.id,
            question_id: questionId,
            author: newComment.author,
            author_name: newComment.authorName,
            content: newComment.content,
            created_at: newComment.createdAt,
          },
        ]);
      } catch (e) {
        console.error("Failed to add comment in Supabase:", e);
      }
    }
  };

  const updateQuestionStatus = async (questionId: string, status: QuestionStatus) => {
    const updated = questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, status };
      }
      return q;
    });

    saveToLocalCache(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("questions").update({ status }).eq("id", questionId);
      } catch (e) {
        console.error("Failed to update question status in Supabase:", e);
      }
    }
  };

  const deleteQuestion = async (questionId: string) => {
    const updated = questions.filter((q) => q.id !== questionId);
    saveToLocalCache(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("questions").delete().eq("id", questionId);
      } catch (e) {
        console.error("Failed to delete question from Supabase:", e);
      }
    }
  };

  const resetToSampleData = async () => {
    clearQuestions();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("comments").delete().neq("id", "");
        await supabase.from("questions").delete().neq("id", "");
      } catch (e) {
        console.error("Failed to clear seeded data in Supabase:", e);
      }
    }
  };

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        isLoading,
        addQuestion,
        upvoteQuestion,
        addComment,
        updateQuestionStatus,
        deleteQuestion,
        resetToSampleData,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions() {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionsProvider");
  }
  return context;
}
