'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection({
  faqs = [],
  title = 'Questions Fréquentes (FAQ)',
  lang = 'fr',
}) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) return null;

  // Schéma JSON-LD pour les Rich Snippets Google FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <section className="my-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-200 hover:border-slate-300 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-slate-800 hover:text-emerald-700 transition-colors"
              >
                <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in-50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
