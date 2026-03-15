"use client";

import { useState } from "react";

interface Props {
  score: number;
  reason?: string;
}

export default function MatchScoreBadge({ score, reason }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (score < 60) return null;

  const colorClass =
    score >= 80
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-amber-100 text-amber-800 border-amber-200";

  return (
    <div className="relative inline-block">
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass} cursor-default select-none`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${score >= 80 ? "bg-emerald-500" : "bg-amber-500"}`}
        />
        {score}% match
      </span>

      {showTooltip && reason && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fade-in">
          <div className="bg-slate-900 text-white text-xs rounded-xl px-3 py-2 max-w-[220px] text-center leading-relaxed shadow-lg">
            {reason}
          </div>
          <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
}
