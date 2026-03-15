import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  ExternalLink,
  CheckCircle,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { MOCK_TALENT } from "@/app/lib/mockData";

interface Props {
  params: { id: string };
}

export default function TalentProfilePage({ params }: Props) {
  const talent = MOCK_TALENT.find((t) => t.id === params.id);
  if (!talent) notFound();

  const availabilityLabel =
    talent.availability === "available"
      ? "Available now"
      : talent.availability === "open-to-offers"
      ? "Open to offers"
      : "Currently busy";

  const availabilityColor =
    talent.availability === "available"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : talent.availability === "open-to-offers"
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-slate-600 bg-slate-50 border-slate-200";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            href="/search"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Back to search"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              BoholX
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        {/* Profile card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Top bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />

          <div className="p-8">
            {/* Identity */}
            <div className="flex items-start gap-5 mb-7">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xl flex-shrink-0">
                {talent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                      {talent.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <MapPin size={14} />
                        <span>{talent.municipality}</span>
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${availabilityColor}`}
                      >
                        {availabilityLabel}
                      </span>
                    </div>
                  </div>
                  {/* AI badge */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {talent.badgeSource === "ai" ? (
                      <>
                        <Sparkles size={11} />
                        ✦ AI-Processed
                      </>
                    ) : (
                      <>
                        <User size={11} />
                        Self-written
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* AI transparency notice */}
            {talent.badgeSource === "ai" && (
              <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-7 text-sm text-indigo-800">
                <Sparkles size={15} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <p>
                  <span className="font-semibold">✦ AI-Processed profile.</span>{" "}
                  This bio has been cleaned, formatted, and voice-polished by BoholX&apos;s AI pipeline. Tags are system-generated and reviewed for accuracy.
                </p>
              </div>
            )}

            {/* Bio */}
            <div className="mb-7">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">About</h2>
              <p className="text-slate-700 leading-relaxed">{talent.bio}</p>
            </div>

            {/* Skills */}
            <div className="mb-7">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill) => (
                  <Link
                    key={skill}
                    href={`/search?q=${encodeURIComponent(`I need ${skill} expertise`)}&tab=project`}
                    className="text-sm bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 px-3 py-1.5 rounded-full font-medium transition-colors border border-transparent hover:border-indigo-200"
                  >
                    {skill}
                  </Link>
                ))}
              </div>
            </div>

            {/* AI tags */}
            <div className="mb-7">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                AI-Generated Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {talent.aiTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}&tab=project`}
                    className="text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full font-medium hover:bg-indigo-100 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Verified badges */}
            {talent.verifiedBadges && talent.verifiedBadges.length > 0 && (
              <div className="mb-7">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Verified Projects
                </h2>
                <div className="flex flex-wrap gap-2">
                  {talent.verifiedBadges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full font-medium"
                    >
                      <CheckCircle size={13} />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External links */}
            {talent.externalLinks.length > 0 && (
              <div className="mb-7">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Links</h2>
                <div className="flex flex-wrap gap-3">
                  {talent.externalLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl border border-indigo-100 transition-colors"
                    >
                      <ExternalLink size={13} />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-100 pt-6">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl flex-1">
                  <Mail size={16} className="text-slate-400" />
                  <a
                    href={`mailto:${talent.email}`}
                    className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                  >
                    {talent.email}
                  </a>
                </div>
                {talent.phone && (
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl flex-1">
                    <Phone size={16} className="text-slate-400" />
                    <a
                      href={`tel:${talent.phone}`}
                      className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                    >
                      {talent.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Link
            href="/search"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            Back to search results
          </Link>
        </div>
      </main>
    </div>
  );
}

export function generateStaticParams() {
  return MOCK_TALENT.map((t) => ({ id: t.id }));
}
