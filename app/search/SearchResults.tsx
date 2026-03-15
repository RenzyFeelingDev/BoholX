"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Search,
  AlertCircle,
  MailPlus,
  SlidersHorizontal,
} from "lucide-react";
import { EntityChip, TalentProfile, SearchTab } from "@/app/types";
import { MOCK_TALENT } from "@/app/lib/mockData";
import { parseEntities, scoreMatch } from "@/app/lib/nlp";
import ConversationalSearch from "@/app/components/ConversationalSearch";
import EntityChipBadge from "@/app/components/EntityChipBadge";
import TalentCard from "@/app/components/TalentCard";

type SortedTalent = TalentProfile & { computedScore: number };

function computeResults(
  query: string,
  entities: EntityChip[]
): SortedTalent[] {
  if (!query.trim() && !entities.length) return [];

  return MOCK_TALENT.map((t) => {
    const score =
      t.matchScore !== undefined
        ? t.matchScore
        : scoreMatch(
            {
              aiTags: t.aiTags,
              skills: t.skills,
              municipality: t.municipality,
              availability: t.availability,
            },
            entities
          );
    return { ...t, computedScore: score };
  })
    .filter((t) => t.computedScore > 0)
    .sort((a, b) => b.computedScore - a.computedScore);
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [tab, setTab] = useState<SearchTab>(
    (searchParams.get("tab") as SearchTab) ?? "project"
  );
  const [entities, setEntities] = useState<EntityChip[]>(() => {
    try {
      return JSON.parse(searchParams.get("entities") ?? "[]");
    } catch {
      return [];
    }
  });
  const [results, setResults] = useState<SortedTalent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback((q: string, chips: EntityChip[]) => {
    setIsLoading(true);
    setHasSearched(true);
    // Simulate async NLP processing
    setTimeout(() => {
      const computed = computeResults(q, chips);
      setResults(computed);
      setIsLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    let chips: EntityChip[] = [];
    try {
      chips = JSON.parse(searchParams.get("entities") ?? "[]");
    } catch {}
    if (!chips.length && q) chips = parseEntities(q);
    setQuery(q);
    setEntities(chips);
    if (q) runSearch(q, chips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (
    newQuery: string,
    newEntities: EntityChip[],
    newTab: SearchTab
  ) => {
    setQuery(newQuery);
    setEntities(newEntities);
    setTab(newTab);
    runSearch(newQuery, newEntities);
    // Update URL without navigation
    const params = new URLSearchParams({
      q: newQuery,
      tab: newTab,
      entities: JSON.stringify(newEntities),
    });
    window.history.replaceState({}, "", `/search?${params.toString()}`);
  };

  const removeChip = (id: string) => {
    const newEntities = entities.filter((c) => c.id !== id);
    setEntities(newEntities);
    runSearch(query, newEntities);
  };

  const handleTagClick = (tag: string) => {
    const newQuery = `Show me ${tag} talent`;
    const newEntities = parseEntities(newQuery);
    handleSearch(newQuery, newEntities, tab);
  };

  const locationEntity = entities.find((e) => e.type === "location");
  const locationLabel = locationEntity ? `in ${locationEntity.value}` : "in Bohol";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky search header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex items-center gap-4 py-4">
            <Link
              href="/"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back to home"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight hidden sm:block">
                BoholX
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <ConversationalSearch
                initialQuery={query}
                initialTab={tab}
                onSearch={handleSearch}
                compact
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-8xl mx-auto w-full px-6 py-8">
        {/* Active chips + result count */}
        {hasSearched && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Result count */}
              <div className="flex items-center gap-2 text-slate-900">
                <Search size={15} className="text-indigo-500" />
                {isLoading ? (
                  <span className="text-sm text-slate-400 animate-pulse">
                    Searching…
                  </span>
                ) : (
                  <span className="text-sm font-semibold">
                    <span className="text-indigo-600">{results.length} match{results.length !== 1 ? "es" : ""}</span>
                    {" found "}
                    <span className="font-normal text-slate-500">{locationLabel}</span>
                  </span>
                )}
              </div>

              {/* Active entity chips */}
              {entities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entities.map((chip) => (
                    <EntityChipBadge
                      key={chip.id}
                      chip={chip}
                      onRemove={removeChip}
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>

            {results.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <SlidersHorizontal size={13} />
                <span>Sorted by match score</span>
              </div>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl shimmer-bg border border-slate-100"
              />
            ))}
          </div>
        )}

        {/* Results grid */}
        {!isLoading && hasSearched && results.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {results.map((talent) => (
              <TalentCard
                key={talent.id}
                talent={{ ...talent, matchScore: talent.computedScore }}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        )}

        {/* Zero results — 3-stage fallback */}
        {!isLoading && hasSearched && results.length === 0 && (
          <ZeroResultsFallback
            query={query}
            entities={entities}
            onTryBroader={() => {
              const broaderEntities = entities.filter(
                (e) => e.type !== "industry"
              );
              const broaderQuery = query
                .replace(/\b(restaurant|catering|food|hospitality|tourism)\b/gi, "")
                .trim();
              handleSearch(
                broaderQuery || "skilled professional in Bohol",
                broaderEntities,
                tab
              );
            }}
            onTryRelated={() => {
              handleSearch("versatile freelancer creative Bohol", [], tab);
            }}
          />
        )}

        {/* Empty initial state */}
        {!hasSearched && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-5">
              <Search size={28} className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Describe what you need
            </h2>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
              Use the search bar above. BoholX extracts skills, industries, roles, and locations from your natural language query.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function ZeroResultsFallback({
  query,
  entities,
  onTryBroader,
  onTryRelated,
}: {
  query: string;
  entities: EntityChip[];
  onTryBroader: () => void;
  onTryRelated: () => void;
}) {
  const [stage, setStage] = useState(1);

  const industryEntities = entities.filter((e) => e.type === "industry");
  const skillEntities = entities.filter((e) => e.type === "skill");

  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      {/* Icon */}
      <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <AlertCircle size={24} className="text-amber-600" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        No exact matches found
      </h2>
      <p className="text-sm text-slate-500 mb-8">
        We couldn&apos;t find talent matching{" "}
        <span className="font-medium text-slate-700">&ldquo;{query}&rdquo;</span>.
        Let&apos;s try a few alternatives.
      </p>

      {/* Stage indicators */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === stage
                ? "w-8 bg-indigo-600"
                : s < stage
                ? "w-4 bg-indigo-300"
                : "w-4 bg-slate-200"
            }`}
          />
        ))}
      </div>

      {stage === 1 && (
        <div className="animate-fade-in">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
            <p className="text-sm font-semibold text-amber-900 mb-1">
              Stage 1: Broaden search
            </p>
            <p className="text-sm text-amber-700 leading-relaxed">
              {industryEntities.length > 0
                ? `Drop the "${industryEntities[0].value}" industry filter and search by role or skill only.`
                : "Widen to all of Bohol, not just one municipality."}
            </p>
          </div>
          <button
            onClick={() => {
              onTryBroader();
              setStage(2);
            }}
            className="btn-primary w-full"
          >
            Try broader search
          </button>
          <button
            onClick={() => setStage(2)}
            className="mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip to related skills →
          </button>
        </div>
      )}

      {stage === 2 && (
        <div className="animate-fade-in">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-5">
            <p className="text-sm font-semibold text-sky-900 mb-1">
              Stage 2: Related skills
            </p>
            <p className="text-sm text-sky-700 leading-relaxed">
              {skillEntities.length > 0
                ? `We\u2019re searching for skills related to \u201c${skillEntities[0].value}\u201d \u2014 similar roles that could cover your need.`
                : "Expanding to adjacent skills and disciplines across Bohol."}
            </p>
          </div>
          <button
            onClick={() => {
              onTryRelated();
              setStage(3);
            }}
            className="btn-primary w-full"
          >
            Show related talent
          </button>
          <button
            onClick={() => setStage(3)}
            className="mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Join waitlist instead →
          </button>
        </div>
      )}

      {stage === 3 && (
        <div className="animate-fade-in">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-5">
            <p className="text-sm font-semibold text-indigo-900 mb-1">
              Stage 3: We&apos;ll find them for you
            </p>
            <p className="text-sm text-indigo-700 leading-relaxed">
              This specific profile doesn&apos;t exist yet in BoholX. Join the waitlist and we&apos;ll notify you when a matching talent onboards.
            </p>
          </div>
          <button
            onClick={() => {}}
            className="inline-flex items-center gap-2 btn-primary w-full justify-center"
          >
            <MailPlus size={16} />
            Join waitlist for this search
          </button>
          <Link
            href="/onboard"
            className="mt-3 block text-sm text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Know someone who fits? Send them here →
          </Link>
        </div>
      )}
    </div>
  );
}
