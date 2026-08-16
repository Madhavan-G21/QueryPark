"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  GraduationCap,
  MessageSquare,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login, signup } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === "login") {
      const res = await login(email, password);
      if (res.success) {
        toast("Welcome back to QPark!", "success");
        router.push("/dashboard");
      } else {
        setError(res.error || "Login failed");
        setSubmitting(false);
      }
    } else {
      if (!name.trim()) {
        setError("Please enter your full name.");
        setSubmitting(false);
        return;
      }
      const res = await signup(name, email, password, department);
      if (res.success) {
        toast("Account created successfully! Welcome to QPark.", "success");
        router.push("/dashboard");
      } else {
        setError(res.error || "Signup failed");
        setSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-65px)] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/poster.jpg')" }}
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/poster.jpg"
      >
        <source src="/images/Fireplace_burning_in_wizarding_room_202608161406.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-950/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/45 to-indigo-950/50" />

      <div className="relative z-10 flex min-h-[calc(100vh-65px)] flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-semibold shadow-lg shadow-black/10 backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Campus Feedback & Grievance Portal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Your Campus Voice, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-orange-200 to-amber-200">
                Heard & Resolved.
              </span>
            </h1>

            <p className="text-base text-slate-200 leading-relaxed max-w-md mx-auto lg:mx-0">
              Submit questions, report facility issues, advocate for safety, and track transparent
              resolutions from campus administration.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm">
                <Shield className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Women&apos;s Safety</p>
                  <p className="text-[11px] text-slate-200">Fast-track high priority reports</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm">
                <BarChart2 className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Live Analytics</p>
                  <p className="text-[11px] text-slate-200">Real-time domain charts & trends</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm">
                <MessageSquare className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Direct Discussion</p>
                  <p className="text-[11px] text-slate-200">Upvote & comment on inquiries</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Admin Tracking</p>
                  <p className="text-[11px] text-slate-200">Status updates till resolution</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white/92 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-950/20 border border-white/50 p-7 sm:p-9 transition-all">
              <div className="text-center mb-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 text-2xl font-black text-gray-900">
                    <span className="text-rose-600 text-3xl">QP</span>ark
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {mode === "login"
                    ? "Log in with your college mail ID to continue"
                    : "Create your student account to participate"}
                </p>
              </div>

              <div className="grid grid-cols-2 p-1 bg-gray-100/80 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className={cn(
                    "py-2 text-xs font-bold rounded-lg transition-all",
                    mode === "login"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className={cn(
                    "py-2 text-xs font-bold rounded-lg transition-all",
                    mode === "signup"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  New Account
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aarohi Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    College Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Department / Branch (Optional)
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Computer Science & Engg"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "w-full text-white font-semibold py-2.5 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-sm",
                    mode === "login"
                      ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                      : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                  )}
                >
                  <span>{mode === "login" ? "Sign In to Portal" : "Create Student Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
