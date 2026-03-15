"use client";

import { useState } from "react";
import { ExternalLink, MapPin, Sparkles, User, CheckCircle } from "lucide-react";
import { TalentProfile } from "@/app/types";
import MatchScoreBadge from "./MatchScoreBadge";
import ContactModal from "./ContactModal";
import { useRouter } from "next/navigation";

interface Props {
  talent: TalentProfile;
  onTagClick?: (tag: string) => void;
}

export default function TalentCard({ talent, onTagClick }: Props) {
  const [showContact, setShowContact] = useState(false);
  const router = useRouter();

  const availabilityColor =
    talent.availability === "available"
      ? "text-emerald-600 bg-emerald-50"
      : talent.availability === "open-to-offers"
      ? "text-amber-600 bg-amber-50"
      : "text-slate-500 bg-slate-50";

  const availabilityLabel =
    talent.availability === "available"
      ? "Available now"
      : talent.availability === "open-to-offers"
      ? "Open to offers"
      : "Currently busy";

  return (
    <>
      <article className="card p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0 font-semibold text-indigo-700 text-sm">
              {talent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-base leading-tight truncate">
                {talent.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-500">{talent.municipality}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {talent.matchScore !== undefined && (
              <MatchScoreBadge score={talent.matchScore} reason={talent.matchReason} />
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${availabilityColor}`}>
              {availabilityLabel}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {talent.bio}
        </p>

        {/* AI Tags */}
        <div className="flex flex-wrap gap-1.5">
          {talent.aiTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-medium hover:bg-indigo-100 transition-colors"
            >
              {tag}
            </button>
          ))}
          {talent.verifiedBadges?.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-medium"
            >
              <CheckCircle size={10} />
              {badge}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
          <div className="flex items-center gap-3">
            {/* AI/Self badge */}
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              {talent.badgeSource === "ai" ? (
                <>
                  <Sparkles size={11} className="text-indigo-500" />
                  <span className="text-indigo-600 font-medium">AI-Processed</span>
                </>
              ) : (
                <>
                  <User size={11} className="text-slate-400" />
                  <span className="text-slate-500">Self-written</span>
                </>
              )}
            </span>

            {/* External links */}
            <div className="flex gap-2">
              {talent.externalLinks.slice(0, 2).map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={11} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowContact(true)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Show Contact
            </button>
            <button
              onClick={() => router.push(`/talent/${talent.id}`)}
              className="btn-primary text-sm py-1.5 px-4"
            >
              Connect
            </button>
          </div>
        </div>
      </article>

      {showContact && (
        <ContactModal talent={talent} onClose={() => setShowContact(false)} />
      )}
    </>
  );
}
