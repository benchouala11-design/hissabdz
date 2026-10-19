import Link from 'next/link';
import { ArrowRight, Link2, Calculator, Car, Home, Coins } from 'lucide-react';
import { i18n } from '../lib/i18n';

export default function InternalLinking({
  lang = 'fr',
  currentModule = 'salary',
  nearbyLinks = [], // 6 liens proches
  title = 'Paliers Proches & Simulations Associées',
}) {
  const t = i18n[lang] || i18n.fr;

  const crossTools = [
    {
      id: 'salary',
      href: `/${lang}/salaire-net/75000-da`,
      label: t.nav.salary,
      desc: lang === 'ar' ? 'حساب الراتب الصافي واقتطاع IRG' : 'Calculateur IRG 2024 et CNAS',
      icon: Calculator,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'customs',
      href: `/${lang}/douane-voiture/renault-clio-5`,
      label: t.nav.customs,
      desc: lang === 'ar' ? 'رسوم الجمركة وفق المادة 110' : 'Article 110, décote et taxes',
      icon: Car,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'notary',
      href: `/${lang}/frais-notaire/1000-millions-centimes`,
      label: t.nav.notary,
      desc: lang === 'ar' ? 'رسوم التسجيل والمحافظة العقارية' : 'Enregistrement, conservation et barème',
      icon: Home,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
    {
      id: 'currency',
      href: `/${lang}/devise-square/100-euros`,
      label: t.nav.currency,
      desc: lang === 'ar' ? 'سعر الصرف في السكوار وبنك الجزائر' : 'Taux officiel vs Square Port-Saïd',
      icon: Coins,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ].filter((item) => item.id !== currentModule);

  return (
    <div className="my-12 space-y-10 pt-8 border-t border-slate-200">
      {/* 6 Liens paliers proches */}
      {nearbyLinks && nearbyLinks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Link2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {nearbyLinks.slice(0, 6).map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="overflow-hidden">
                  <span className="block text-xs font-semibold text-slate-800 group-hover:text-emerald-700 truncate">
                    {item.label}
                  </span>
                  {item.sub && (
                    <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                      {item.sub}
                    </span>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Liens croisés vers les autres outils */}
      <section>
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          {t.common.crossTools}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {crossTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex items-start gap-3.5"
              >
                <div className={`p-2.5 rounded-xl border ${tool.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {tool.label}
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
