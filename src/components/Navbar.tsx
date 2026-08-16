"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "./Toast";
import {
  Home,
  PlusCircle,
  Search,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login/landing page and not logged in, show minimal branding header
  if (pathname === "/" && !isAuthenticated) {
    return (
      <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <Link href="/" className="flex items-center shrink-0 group">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900 dark:text-white">
                <span className="text-rose-600">QP</span>ark
                <span className="text-[10px] sm:text-xs ml-1.5 font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Portal
                </span>
              </span>
            </Link>

          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-gray-500 hidden md:inline font-medium">
              Campus Grievance & Student Voice
            </span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const handleLogout = () => {
    logout();
    toast("You have been logged out successfully.", "info");
    router.push("/");
  };

  const navLinks = [
    { href: "/dashboard", label: "Home", icon: Home, match: ["/dashboard", "/home"] },
    { href: "/post", label: "Post", icon: PlusCircle, match: ["/post"] },
    { href: "/questions", label: "Inspect", icon: Search, match: ["/questions", "/inspect"] },
  ];

  return (
    <header className="w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo & Affiliations */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <Link href="/dashboard" className="flex items-center shrink-0 group">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900 dark:text-white">
              <span className="text-rose-600">QP</span>ark
            </span>
          </Link>

        </div>

        {/* Desktop Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.match.includes(pathname);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs"
                      : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/60 dark:hover:bg-slate-800/60"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {isAuthenticated && user && (
            <div className="hidden lg:flex items-center gap-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200/70 dark:border-slate-700/80 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                {user.name ? user.name[0] : "U"}
              </div>
              <div className="flex flex-col text-left max-w-[120px] truncate">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">
                  {user.name || user.email.split("@")[0]}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate leading-none">
                  {user.email}
                </span>
              </div>
              {user.role === "admin" && (
                <span className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 px-1.5 py-0.5 rounded font-bold">
                  Admin
                </span>
              )}
            </div>
          )}

          <Link
            href="/post"
            className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Ask Question</span>
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400 bg-gray-100/80 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50 px-3 py-2 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              href="/"
              className="text-xs font-medium bg-indigo-600 text-white px-3.5 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
          {isAuthenticated && user && (
            <div className="p-3 bg-gray-50 dark:bg-slate-800/80 rounded-xl mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {user.name ? user.name[0] : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {navLinks.map((link) => {
            const isActive = link.match.includes(pathname);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/post"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full mt-2 bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl shadow"
          >
            <PlusCircle className="w-4 h-4" />
            Ask Question
          </Link>
        </div>
      )}
    </header>
  );
}
