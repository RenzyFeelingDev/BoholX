import { MapPin, Users, ArrowRight, Sparkles } from "lucide-react";
import ConversationalSearch from "@/app/components/ConversationalSearch";
import { FEATURED_MUNICIPALITIES } from "@/app/lib/mockData";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              BoholX
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="/onboard"
              className="text-sm text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Submit Profile
            </Link>
            <Link href="/search" className="btn-primary text-sm">
              Find Talent
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 to-white pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative max-w-8xl mx-auto px-6 pt-24 pb-20">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                <MapPin size={12} />
                Serving all 48 municipalities of Bohol
              </span>
            </div>

            {/* Headline */}
            <div className="text-center mb-12">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
                Find Boholano talent
                <br />
                <span className="text-indigo-600">for your project.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
                Describe what you need in plain language. BoholX understands context, skills, and location — and surfaces the right match.
              </p>
            </div>

            {/* Search */}
            <ConversationalSearch autoFocus />

            {/* Social proof counters */}
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-slate-900">340+</div>
                <div className="text-sm text-slate-500 mt-0.5">Active talent</div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <div className="text-3xl font-extrabold text-slate-900">1,200+</div>
                <div className="text-sm text-slate-500 mt-0.5">Completed projects</div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <div className="text-3xl font-extrabold text-slate-900">48</div>
                <div className="text-sm text-slate-500 mt-0.5">Municipalities</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-8xl mx-auto px-6 py-16 border-t border-slate-100">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              How BoholX works
            </h2>
            <p className="text-slate-500">
              Conversational search is the only way to discover talent — no directories, no filters.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                step: "01",
                icon: "💬",
                title: "Describe your need",
                desc: "Type naturally — your project, the skills, the location. BoholX extracts what matters.",
              },
              {
                step: "02",
                icon: "✦",
                title: "AI matches talent",
                desc: "Each profile is scored on skill fit, industry experience, and availability.",
              },
              {
                step: "03",
                icon: "🤝",
                title: "Connect directly",
                desc: "Reveal contact info and start the conversation. No middlemen.",
              },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="text-xs font-bold text-indigo-400 mb-3 tracking-wider">{item.step}</div>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured municipalities */}
        <section className="bg-slate-50 border-y border-slate-100 py-16">
          <div className="max-w-8xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Featured municipalities
                </h2>
                <p className="text-slate-500 text-sm">
                  Talent from across Bohol&apos;s most active communities
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {FEATURED_MUNICIPALITIES.map((muni) => (
                <MunicipalityCard key={muni.name} {...muni} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="max-w-8xl mx-auto px-6 py-20">
          <div className="relative bg-indigo-600 rounded-3xl overflow-hidden p-10 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5">
                <Sparkles size={12} />
                AI-powered talent onboarding
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Are you a Boholano professional?
              </h2>
              <p className="text-indigo-100 mb-8 max-w-md mx-auto text-lg">
                Submit your profile and let BoholX match you with the right projects — automatically.
              </p>
              <Link
                href="/onboard"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-7 py-3.5 rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Submit Your Profile
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-8xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">BoholX</span>
          </div>
          <p className="text-xs text-slate-400">
            The Bohol talent marketplace. Conversational search only.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
              Find Talent
            </Link>
            <Link href="/onboard" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
              Submit Profile
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MunicipalityCard({
  name,
  description,
  count,
}: {
  name: string;
  description: string;
  count: number;
}) {
  const gradients: Record<string, string> = {
    Panglao: "from-sky-50 to-blue-100 border-sky-200",
    Carmen: "from-emerald-50 to-green-100 border-emerald-200",
    Tagbilaran: "from-indigo-50 to-violet-100 border-indigo-200",
    Loboc: "from-amber-50 to-orange-100 border-amber-200",
  };
  const icons: Record<string, string> = {
    Panglao: "🏝️",
    Carmen: "🌿",
    Tagbilaran: "🏙️",
    Loboc: "🛶",
  };

  return (
    <Link
      href={`/search?q=talent+in+${name.toLowerCase()}&tab=project&entities=${encodeURIComponent(
        JSON.stringify([{ id: `loc-${name}`, type: "location", value: name }])
      )}`}
      className={`p-5 rounded-2xl border bg-gradient-to-br ${gradients[name] ?? "from-slate-50 to-slate-100 border-slate-200"} hover:shadow-md transition-shadow duration-200 group`}
    >
      <div className="text-2xl mb-3">{icons[name] ?? "📍"}</div>
      <h3 className="font-semibold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">
        {name}
      </h3>
      <p className="text-xs text-slate-500 mt-0.5 mb-3">{description}</p>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <Users size={12} />
        {count} profiles
      </div>
    </Link>
  );
}
