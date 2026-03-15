"use client";

import { X } from "lucide-react";
import { EntityChip, EntityType } from "@/app/types";
import { ENTITY_COLORS } from "@/app/lib/mockData";

const TYPE_LABELS: Record<EntityType, string> = {
  industry: "Industry",
  skill: "Skill",
  role: "Role",
  location: "Location",
};

interface Props {
  chip: EntityChip;
  onRemove?: (id: string) => void;
  size?: "sm" | "md";
}

export default function EntityChipBadge({ chip, onRemove, size = "md" }: Props) {
  const colorClass = ENTITY_COLORS[chip.type] || "bg-slate-100 text-slate-700 border-slate-200";
  const sizeClass = size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5";

  return (
    <span
      className={`entity-chip border ${colorClass} ${sizeClass} animate-chip-pop`}
    >
      <span className="opacity-60 text-xs font-normal">{TYPE_LABELS[chip.type]}:</span>
      <span>{chip.value}</span>
      {onRemove && (
        <button
          onClick={() => onRemove(chip.id)}
          className="ml-0.5 rounded-full hover:opacity-70 transition-opacity focus:outline-none"
          aria-label={`Remove ${chip.value}`}
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}
