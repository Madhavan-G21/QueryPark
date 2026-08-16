"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  UserCheck,
  ArrowLeft,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, adminLogin } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated as admin, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role === "admin") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await adminLogin(email, password, adminCode);
    if (res.success) {
      toast("Authenticated as Administrative Officer!", "success");
      router.push("/dashboard");
    } else {
      setError(res.error || "Admin authentication failed.");
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-850 to-rose-950 text-white">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Admin Authority Information */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Official Campus Administration Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            QPark Admin & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
              Grievance Oversight.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto lg:mx-0">
            Dedicated administrative portal for Deans, Wardens, Department Heads, and Security Officials to review student reports, manage grievance statuses, and resolve campus issues.
          </p>

          <div className="space-y-3 pt-2 text-left max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">High-Priority Triage</h4>
                <p className="text-[11px] text-slate-400">Direct escalation of Women&apos;s Safety and Hostel issues.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Administrative Controls</h4>
                <p className="text-[11px] text-slate-400">Update issue status to Under Review, In Progress, or Resolved.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Single Admin Login Form */}
        <div className="lg:col-span-6">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/80 p-7 sm:p-9 space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 text-2xl font-black text-white">
                <span className="text-rose-500 text-3xl">QP</span>ark Admin Portal
              </div>
              <p className="text-xs text-slate-400">
                Sign in with your official administrative credentials
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Administrative Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Admin Security Passkey</span>
                  <span className="text-[10px] text-rose-400 font-normal">Passkey: ADMIN123</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="ADMIN123"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition placeholder:text-slate-500 uppercase tracking-widest font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm active:scale-98"
              >
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Back link */}
            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Student Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
