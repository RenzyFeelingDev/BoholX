"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { EntityChip, SearchTab } from "@/app/types";
import { parseEntities } from "@/app/lib/nlp";
import EntityChipBadge from "./EntityChipBadge";
import { POPULAR_TAGS } from "@/app/lib/mockData";

const TAB_PLACEHOLDERS: Record<SearchTab, string> = {
  project: "e.g. I need a web developer for my tourism startup in Panglao",
  people: "e.g. Joven, full-stack developer, Panglao",
};

interface Props {
  initialQuery?: string;
  initialTab?: SearchTab;
  autoFocus?: boolean;
  onSearch?: (query: string, entities: EntityChip[], tab: SearchTab) => void;
  compact?: boolean;
}

export default function ConversationalSearch({
  initialQuery = "",
  initialTab = "project",
  autoFocus = false,
  onSearch,
  compact = false,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<SearchTab>(initialTab);
  const [entities, setEntities] = useState<EntityChip[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const parseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runParse = useCallback(
    (q: string) => {
      if (parseTimerRef.current) clearTimeout(parseTimerRef.current);
      parseTimerRef.current = setTimeout(() => {
        const chips = parseEntities(q);
        setEntities(chips);
      }, 300);
    },
    []
  );

  useEffect(() => {
    if (initialQuery) {
      runParse(initialQuery);
    }
  }, [initialQuery, runParse]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    runParse(val);
  };

  const removeChip = (id: string) => {
    setEntities((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    const finalEntities = entities.length ? entities : parseEntities(query);
    if (onSearch) {
      onSearch(query, finalEntities, tab);
    } else {
      const params = new URLSearchParams({
        q: query,
        tab,
        entities: JSON.stringify(finalEntities),
      });
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleTagClick = (tagQuery: string) => {
    setQuery(tagQuery);
    const chips = parseEntities(tagQuery);
    setEntities(chips);
    if (inputRef.current) inputRef.current.focus();
    // Auto-submit after short delay for instant feel
    setTimeout(() => {
      const params = new URLSearchParams({
        q: tagQuery,
        tab,
        entities: JSON.stringify(chips),
      });
      router.push(`/search?${params.toString()}`);
    }, 200);
  };

  return (
    <div className={`w-full ${compact ? "" : "max-w-3xl mx-auto"}`}>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3">
        {(["project", "people"] as SearchTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              tab === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {t === "project" ? "Project Need" : "Search People"}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div
        className={`relative flex items-center bg-white rounded-2xl border-2 transition-all duration-200 shadow-sm ${
          isFocused
            ? "border-indigo-500 shadow-indigo-100 shadow-lg"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <Search
          size={18}
          className={`absolute left-4 flex-shrink-0 transition-colors ${
            isFocused ? "text-indigo-500" : "text-slate-400"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={`What's on your mind? (${TAB_PLACEHOLDERS[tab]})`}
          autoFocus={autoFocus}
          className={`w-full bg-transparent pl-11 pr-16 py-4 text-slate-900 placeholder-slate-400 focus:outline-none ${
            compact ? "text-sm py-3" : "text-base"
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setEntities([]);
              inputRef.current?.focus();
            }}
            className="absolute right-14 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          className="absolute right-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
          aria-label="Search"
        >
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Entity chips */}
      {entities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
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

      {/* Popular tags */}
      {!compact && (
        <div className="mt-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide flex-shrink-0">
              Try:
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => handleTagClick(tag.query)}
                  className="text-xs text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-transparent hover:border-indigo-200 px-3 py-1.5 rounded-full font-medium transition-all duration-150"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
