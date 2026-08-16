"use client";

import React, { useState } from "react";
import { Question, QuestionStatus } from "@/types";
import { getDomainInfo, formatTimeAgo, getStatusBadge, getUrgencyBadge } from "@/lib/utils";
import { useQuestions } from "@/context/QuestionsContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "./Toast";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  ChevronDown,
  ChevronUp,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  compact?: boolean;
}

export default function QuestionCard({ question, compact = false }: QuestionCardProps) {
  const { user } = useAuth();
  const { upvoteQuestion, addComment, updateQuestionStatus, deleteQuestion } = useQuestions();
  const { toast } = useToast();

  const [expanded, setExpanded] = useState(!compact);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const domain = getDomainInfo(question.domain);
  const statusInfo = getStatusBadge(question.status);
  const urgencyInfo = getUrgencyBadge(question.urgency);

  const hasUpvoted = question.upvotedBy?.includes(user?.email || "");
  const isAuthor = user && user.email === question.author;
  const isAdmin = user?.role === "admin";

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await upvoteQuestion(question.id);
    if (!hasUpvoted) {
      toast("Upvoted question!", "success");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment(question.id, commentText);
    setCommentText("");
    toast("Comment posted!", "success");
  };

  const handleStatusChange = async (newStatus: QuestionStatus) => {
    await updateQuestionStatus(question.id, newStatus);
    toast(`Status updated to ${newStatus.replace("-", " ")}`, "info");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/questions?id=${question.id}`);
      toast("Question link copied to clipboard!", "info");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion(question.id);
      toast("Question deleted.", "info");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 p-5 sm:p-6 overflow-hidden">
      {/* Top row: Badges and Domain */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain Pill */}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shadow-2xs"
            style={{
              backgroundColor: `${domain.color}15`,
              color: domain.color,
              borderColor: `${domain.color}35`,
            }}
          >
            <span>{domain.icon}</span>
            <span>{domain.label}</span>
          </span>

          {/* Status Badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border",
              statusInfo.badgeClass
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", statusInfo.dotClass)} />
            {statusInfo.label}
          </span>

          {/* Urgency Badge */}
          {question.urgency && question.urgency !== "low" && (
            <span
              className={cn(
                "inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                urgencyInfo.badgeClass
              )}
            >
              {urgencyInfo.label}
            </span>
          )}
        </div>

        {/* Action icons / timestamps */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatTimeAgo(question.date)}
          </span>
          <button
            onClick={handleShare}
            className="p-1 hover:text-indigo-600 transition"
            title="Copy link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          {(isAuthor || isAdmin) && (
            <button
              onClick={handleDelete}
              className="p-1 hover:text-rose-600 transition"
              title="Delete question"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Question Title */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug tracking-tight">
        {question.title}
      </h3>

      {/* Details snippet / full */}
      {question.details && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {compact && !expanded ? (
            <p className="line-clamp-2">{question.details}</p>
          ) : (
            <p className="whitespace-pre-line">{question.details}</p>
          )}
        </div>
      )}

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {question.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] text-gray-500 bg-gray-100 dark:bg-slate-800 dark:text-gray-400 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Meta: Author + Interactions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3.5 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500">
        {/* Author info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-[10px]">
            {question.isAnonymous ? "?" : question.authorName?.[0] || "U"}
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {question.isAnonymous ? "Anonymous Student" : question.authorName}
          </span>
        </div>

        {/* Buttons: Upvote, Comments toggle, Status Dropdown */}
        <div className="flex items-center gap-2">
          {/* Admin / Author Status Control */}
          {(isAdmin || isAuthor) && (
            <select
              value={question.status}
              onChange={(e) => handleStatusChange(e.target.value as QuestionStatus)}
              className="text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="open">Mark Open</option>
              <option value="under-review">Under Review</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          )}

          {/* Upvote Button */}
          <button
            type="button"
            onClick={handleUpvote}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-150 active:scale-95",
              hasUpvoted
                ? "bg-indigo-600 border-indigo-600 text-white shadow-xs shadow-indigo-500/20"
                : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600"
            )}
          >
            <ThumbsUp className={cn("w-3.5 h-3.5", hasUpvoted && "fill-current")} />
            <span>{question.upvotes}</span>
          </button>

          {/* Comments Toggle */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-750 text-xs font-medium transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
            <span>{question.comments?.length || 0}</span>
            {showComments ? (
              <ChevronUp className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Discussion ({question.comments?.length || 0})
          </h4>

          {/* Comments list */}
          {question.comments && question.comments.length > 0 ? (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {question.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 dark:bg-slate-800/70 p-3 rounded-xl border border-gray-100 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {comment.authorName}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No responses yet. Be the first to reply!</p>
          )}

          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a response or update..."
              className="flex-1 text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3 py-2 bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Reply</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
