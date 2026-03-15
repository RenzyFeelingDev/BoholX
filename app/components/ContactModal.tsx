"use client";

import { X, Mail, Phone, ExternalLink } from "lucide-react";
import { TalentProfile } from "@/app/types";

interface Props {
  talent: TalentProfile;
  onClose: () => void;
}

export default function ContactModal({ talent, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">{talent.name}</h3>
            <p className="text-sm text-slate-500">{talent.municipality}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contact info */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail size={16} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Email</p>
              <a
                href={`mailto:${talent.email}`}
                className="text-slate-900 font-medium hover:text-indigo-600 transition-colors text-sm"
              >
                {talent.email}
              </a>
            </div>
          </div>

          {talent.phone && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Phone</p>
                <a
                  href={`tel:${talent.phone}`}
                  className="text-slate-900 font-medium hover:text-emerald-600 transition-colors text-sm"
                >
                  {talent.phone}
                </a>
              </div>
            </div>
          )}

          {talent.externalLinks.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">Links</p>
              <div className="flex flex-wrap gap-2">
                {talent.externalLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <ExternalLink size={12} />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <p className="text-xs text-slate-400 text-center">
            Contact revealed. This interaction has been logged as an engagement event.
          </p>
        </div>
      </div>
    </div>
  );
}
