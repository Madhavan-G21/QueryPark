"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { Question } from "@/types";
import { DOMAINS } from "@/lib/constants";
import { PieChart, TrendingUp, BarChart3 } from "lucide-react";

// Register ChartJS modules
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
);

interface DashboardChartsProps {
  questions: Question[];
}

export default function DashboardCharts({ questions }: DashboardChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm h-72 animate-pulse" />
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm h-72 animate-pulse" />
      </div>
    );
  }

  // Domain counts
  const domainCounts = DOMAINS.map((d) => questions.filter((q) => q.domain === d.id).length);
  const totalQuestions = questions.length;

  // Doughnut Chart Data
  const doughnutData = {
    labels: DOMAINS.map((d) => d.label),
    datasets: [
      {
        data: domainCounts,
        backgroundColor: DOMAINS.map((d) => d.color),
        borderColor: DOMAINS.map(() => "#ffffff"),
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 14,
          font: {
            size: 11,
            family: "Inter, sans-serif",
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const count = context.raw || 0;
            const percent = totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0;
            return ` ${context.label}: ${count} (${percent}%)`;
          },
        },
      },
    },
    cutout: "68%",
  };

  // Activity over last 7 days
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const dayLabels = days.map((d) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" })
  );

  const dayCounts = days.map((d) => {
    const dayStr = d.toDateString();
    return questions.filter((q) => new Date(q.date).toDateString() === dayStr).length;
  });

  const activityData = {
    labels: dayLabels,
    datasets: [
      {
        label: "Questions Posted",
        data: dayCounts,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.12)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const activityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { size: 11 },
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Domain Distribution Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white text-base">
                Domain Distribution
              </h2>
              <p className="text-xs text-gray-400">Breakdown across categories</p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">
            {totalQuestions} Total
          </span>
        </div>

        <div className="h-64 relative flex items-center justify-center">
          {totalQuestions > 0 ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <p className="text-xs text-gray-400">No questions recorded yet.</p>
          )}
        </div>
      </div>

      {/* 7-Day Activity Trend Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white text-base">
                7-Day Activity Trend
              </h2>
              <p className="text-xs text-gray-400">Questions submitted over time</p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 px-2.5 py-1 rounded-full">
            Recent Timeline
          </span>
        </div>

        <div className="h-64 relative">
          <Line data={activityData} options={activityOptions} />
        </div>
      </div>
    </div>
  );
}
