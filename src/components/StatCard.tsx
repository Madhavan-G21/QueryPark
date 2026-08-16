"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: string | React.ReactNode;
  iconBg?: string;
  trend?: string;
  trendPositive?: boolean;
  accentColor?: string;
  onClick?: () => void;
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  trend,
  trendPositive = true,
  accentColor,
  onClick,
  className,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden",
        onClick && "cursor-pointer hover:-translate-y-0.5",
        className
      )}
    >
      {/* Accent top bar */}
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
          style={{ backgroundColor: accentColor }}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1.5 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110",
              iconBg || "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center text-xs">
          <span
            className={cn(
              "font-medium",
              trendPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend}
          </span>
          <span className="text-gray-400 ml-1.5">vs last week</span>
        </div>
      )}
    </div>
  );
}
