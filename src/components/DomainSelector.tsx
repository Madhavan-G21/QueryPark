"use client";

import React from "react";
import { DOMAINS } from "@/lib/constants";
import { DomainId } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface DomainSelectorProps {
  selected: DomainId | null;
  onSelect: (domainId: DomainId) => void;
}

export default function DomainSelector({ selected, onSelect }: DomainSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {DOMAINS.map((domain) => {
        const isSelected = selected === domain.id;
        return (
          <button
            key={domain.id}
            type="button"
            onClick={() => onSelect(domain.id)}
            className={cn(
              "relative flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
              isSelected
                ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm scale-[1.01]"
                : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50/50"
            )}
          >
            {/* Checkmark Indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}

            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-2xl p-1 rounded-lg bg-gray-100 dark:bg-slate-800">
                {domain.icon}
              </span>
              <span
                className="font-bold text-sm"
                style={{ color: isSelected ? domain.color : undefined }}
              >
                {domain.label}
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
              {domain.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
