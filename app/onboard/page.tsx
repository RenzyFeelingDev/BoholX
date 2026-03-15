import Link from "next/link";
import { ArrowLeft, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export default function OnboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5">
            <Sparkles size={12} />
            AI-powered onboarding
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Submit your profile
          </h1>
          <p className="text-slate-500 leading-relaxed">
            Tell us about yourself. BoholX&apos;s AI pipeline will clean, format, and tag your profile — then show you the result before publishing.
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {[
            { label: "Submit", active: true },
            { label: "AI Review", active: false },
            { label: "Approve", active: false },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.active
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-xs text-slate-500 mt-1.5 font-medium">
                  {step.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-16 h-0.5 mx-2 mb-5 ${step.active ? "bg-indigo-200" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <p className="text-sm text-slate-500 mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <strong className="text-amber-800">Coming soon:</strong> The full onboarding form with AI consent gate, side-by-side raw vs. polished preview, and shimmer animation is in development. For now, fill in the Google Form linked below.
          </p>

          {/* Form fields placeholder */}
          <div className="space-y-5">
            {[
              { label: "Full Name *", placeholder: "Your chosen display name" },
              { label: "Bio *", placeholder: "Tell us about your work, background, and what makes you unique", textarea: true },
              { label: "Skills *", placeholder: "e.g. Web Development, Photography, Event Planning (comma-separated)" },
              { label: "External Links *", placeholder: "https://your-portfolio.com" },
              { label: "Municipality *", placeholder: "e.g. Tagbilaran, Panglao, Carmen" },
              { label: "Availability *", placeholder: "Available now / Open to offers / Busy until [date]" },
              { label: "Email *", placeholder: "you@example.com" },
              { label: "Phone (optional)", placeholder: "+63 9XX XXX XXXX" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {field.label}
                </label>
                {field.textarea ? (
                  <textarea
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>

          {/* AI pipeline notice */}
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-800">
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>AI Pipeline:</strong> Your submission goes through 4 stages — Clean → Format → Tag Extract → Polish voice. You&apos;ll review and approve before it goes live.
              </div>
            </div>
          </div>

          <button
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 text-base py-3.5"
            disabled
          >
            Continue to AI Review
            <ArrowRight size={16} />
          </button>

          <p className="text-xs text-slate-400 text-center mt-3">
            By submitting, you consent to BoholX displaying your profile to potential clients.
          </p>
        </div>

        {/* Checklist */}
        <div className="mt-8 p-5 bg-white rounded-2xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">What happens next</p>
          <div className="space-y-2">
            {[
              "AI cleans and formats your bio",
              "System generates tags — you don't pick them",
              "Side-by-side review: raw vs. AI-polished",
              "Approve (✦ AI-Processed) or reject (Self-written)",
              "Confirmation email + profile goes live",
            ].map((step) => (
              <div key={step} className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
