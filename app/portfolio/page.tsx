"use client";

import { useState, useEffect, useRef } from "react";
import { FallingPattern } from "@/app/components/FallingPattern";

const PROJECTS = [
  {
    id: 1,
    title: "Resort Booking App",
    category: "uiux",
    year: "2024",
    tags: ["Mobile", "UI/UX"],
    description: "End-to-end booking experience for a Panglao beach resort.",
    color: "#1a1a2e",
  },
  {
    id: 2,
    title: "BoholX Platform",
    category: "uiux",
    year: "2024",
    tags: ["Web", "Product Design"],
    description: "AI-powered talent marketplace for Bohol professionals.",
    color: "#0d1117",
  },
  {
    id: 3,
    title: "Dive Shop Identity",
    category: "graphics",
    year: "2023",
    tags: ["Branding", "Print"],
    description: "Visual identity system for a Panglao marine dive shop.",
    color: "#0a1628",
  },
  {
    id: 4,
    title: "Cultural Fest Poster",
    category: "graphics",
    year: "2023",
    tags: ["Graphics", "Illustration"],
    description: "Event collateral for Bohol's annual cultural festival.",
    color: "#1a0a0a",
  },
  {
    id: 5,
    title: "Agri Dashboard",
    category: "uiux",
    year: "2023",
    tags: ["Dashboard", "Data Viz"],
    description: "Farm management dashboard for northern Bohol cooperatives.",
    color: "#0a1a0a",
  },
  {
    id: 6,
    title: "Tourism Brand System",
    category: "graphics",
    year: "2022",
    tags: ["Branding", "Guidelines"],
    description: "Comprehensive brand guide for a Loboc River eco-resort.",
    color: "#1a1200",
  },
];

const SKILLS = [
  "UI/UX Design",
  "Figma",
  "Product Thinking",
  "User Research",
  "Prototyping",
  "Design Systems",
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Computer Engineering",
];

const MARQUEE_ITEMS = [
  "Computer Engineer",
  "·",
  "UI/UX Designer",
  "·",
  "Open for Collaboration",
  "·",
  "Based in Bohol, PH",
  "·",
  "Computer Engineer",
  "·",
  "UI/UX Designer",
  "·",
  "Open for Collaboration",
  "·",
  "Based in Bohol, PH",
  "·",
];

type Category = "all" | "uiux" | "graphics";

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const filtered = PROJECTS.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  const filters: { key: Category; label: string }[] = [
    { key: "all", label: "/All Projects" },
    { key: "uiux", label: "/ UI UX Design" },
    { key: "graphics", label: "/ Graphics Design" },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-kanit overflow-x-hidden">
      {/* Custom cursor glow */}
      {showCursor && (
        <div
          className="fixed pointer-events-none z-50 w-6 h-6 rounded-full border border-white/40 mix-blend-difference transition-transform duration-75"
          style={{ left: cursorPos.x - 12, top: cursorPos.y - 12 }}
        />
      )}

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6">
        <span className="text-sm font-light tracking-[0.2em] text-white/60 uppercase">
          Portfolio
        </span>
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-2 py-2">
          {[
            { label: "Work", href: "#work" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-5 py-2 rounded-full text-sm font-light text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="mailto:email@gmail.com"
          className="text-sm font-light tracking-[0.1em] text-white/60 hover:text-white transition-colors duration-200"
        >
          email@gmail.com
        </a>
      </nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center"
        onMouseEnter={() => setShowCursor(true)}
        onMouseLeave={() => setShowCursor(false)}
      >
        {/* FallingPattern background — fills the entire hero */}
        <div className="absolute inset-0 z-0">
          <FallingPattern
            color="rgba(255,255,255,0.55)"
            backgroundColor="#0a0a0a"
            duration={150}
            blurIntensity="1em"
            density={1}
            className="h-full w-full"
          />
        </div>

        {/* Centered content — sits above the pattern */}
        <div
          className={`relative z-10 text-center transition-all duration-1000 px-8 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Main name — single line to match screenshot */}
          <h1
            className="font-black leading-none tracking-tight text-white uppercase"
            style={{ fontSize: "clamp(52px, 8.5vw, 130px)", letterSpacing: "-0.02em" }}
          >
            RENALD B. SALIN
          </h1>

          {/* Role line */}
          <p className="mt-5 text-sm font-light tracking-[0.3em] text-white/35 uppercase">
            Computer Engineer&nbsp;&nbsp;/&nbsp;&nbsp;UI UX Designer
          </p>

          {/* Available badge */}
          <div className="mt-5 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-xs font-light tracking-[0.2em] text-white/50 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for work
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <div className="w-px h-14 bg-gradient-to-b from-white/25 to-transparent" />
          <span className="text-[9px] tracking-[0.3em] text-white/20 uppercase">Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-white/5 py-5 overflow-hidden bg-white/[0.02]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`inline-block mx-6 text-sm font-light tracking-[0.15em] uppercase ${
                item === "·" ? "text-white/20" : "text-white/40"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── WORK ── */}
      <section id="work" className="px-8 py-24 max-w-[1440px] mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-3">Selected Work</p>
            <h2 className="text-5xl font-black uppercase leading-none">Projects</h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-6">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`text-sm font-light tracking-wide transition-colors duration-200 ${
                  activeFilter === f.key
                    ? "text-white"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((project, idx) => (
            <div
              key={project.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                transitionDelay: `${idx * 40}ms`,
              }}
            >
              {/* Image area */}
              <div
                className="relative h-[380px] rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-white/10"
                style={{ background: project.color }}
              >
                {/* Noise texture overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Placeholder icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-white/20"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Tags top-right */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-light tracking-[0.15em] uppercase bg-black/40 backdrop-blur-sm border border-white/10 text-white/60 rounded-full px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div>
                  <h3 className="text-xl font-black uppercase leading-tight group-hover:text-white/80 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-sm font-light text-white/30 mt-0.5 leading-snug">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-sm font-light text-white/30">{project.year}</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-200">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-white/40 group-hover:text-white transition-colors duration-200"
                    >
                      <path d="M2 6h8M6 2l4 4-4 4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE 2 (reverse) ── */}
      <div className="border-y border-white/5 py-5 overflow-hidden bg-white/[0.02]">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`inline-block mx-6 text-sm font-light tracking-[0.15em] uppercase ${
                item === "·" ? "text-white/20" : "text-white/40"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="px-8 py-24 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Photo grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { h: "h-64", bg: "#111" },
              { h: "h-48 mt-8", bg: "#0d1117" },
              { h: "h-48", bg: "#0a1628" },
              { h: "h-64 -mt-4", bg: "#1a0a0a" },
            ].map((card, i) => (
              <div
                key={i}
                className={`${card.h} rounded-2xl border border-white/5 flex items-center justify-center`}
                style={{ background: card.bg }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/10"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            ))}
          </div>

          {/* Right: Bio */}
          <div>
            <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-6">About Me</p>
            <h2 className="text-5xl font-black uppercase leading-none mb-8">
              Crafting
              <br />
              <span className="text-white/20">digital</span>
              <br />
              experiences
            </h2>
            <p className="text-base font-light text-white/50 leading-relaxed mb-6">
              I&apos;m Renald Butlig Salin — a Computer Engineer and UI/UX Designer based in
              Bohol, Philippines. I bridge the gap between engineering and design, building
              products that are both technically sound and delightful to use.
            </p>
            <p className="text-base font-light text-white/50 leading-relaxed mb-10">
              With a background spanning product design, frontend engineering, and systems
              thinking, I work best at the intersection of form and function — where clean
              code meets thoughtful design.
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-light tracking-[0.1em] uppercase border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 rounded-full px-4 py-1.5 transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="border-t border-white/5 bg-white/[0.01] px-8 pt-20 pb-12"
      >
        <div className="max-w-[1440px] mx-auto">
          {/* Big name */}
          <div className="overflow-hidden mb-12">
            <h2
              className="font-black uppercase text-white/5 leading-none select-none"
              style={{ fontSize: "clamp(60px, 10vw, 160px)", letterSpacing: "-0.02em" }}
            >
              Renald Butlig Salin
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            {/* Left: CTA */}
            <div>
              <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-6">
                Get in touch
              </p>
              <h3 className="text-4xl font-black uppercase leading-tight mb-6">
                Open for
                <br />
                collaboration.
              </h3>
              <p className="text-base font-light text-white/40 leading-relaxed mb-8 max-w-sm">
                Computer Engineer, UI/UX Designer. Let&apos;s build something remarkable
                together.
              </p>
              <a
                href="mailto:email@gmail.com"
                className="inline-flex items-center gap-3 bg-white text-black font-black text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-full hover:bg-white/90 transition-colors duration-200"
              >
                Say Hello
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
              </a>
            </div>

            {/* Right: Links */}
            <div className="flex flex-col items-start lg:items-end gap-4">
              <a
                href="mailto:email@gmail.com"
                className="text-lg font-light text-white/40 hover:text-white transition-colors duration-200 tracking-wide"
              >
                email@gmail.com
              </a>
              <div className="flex items-center gap-6 mt-2">
                {[
                  {
                    label: "Facebook",
                    href: "#",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Instagram",
                    href: "#",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                      </svg>
                    ),
                  },
                  {
                    label: "LinkedIn",
                    href: "#",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div className="mt-20 pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-light tracking-[0.2em] text-white/20 uppercase">
              © 2024 Renald Butlig Salin
            </span>
            <span className="text-xs font-light tracking-[0.2em] text-white/20 uppercase">
              Bohol, Philippines
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
