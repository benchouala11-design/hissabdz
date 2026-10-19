'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  Car,
  Home,
  Coins,
  BookOpen,
  Menu,
  X,
  Languages,
  CheckCircle2,
} from 'lucide-react';
import { i18n } from '../lib/i18n';

export default function Navbar({ lang = 'fr' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || `/${lang}`;
  const t = i18n[lang] || i18n.fr;
  const isRtl = lang === 'ar';

  // Calcul du lien vers l'autre langue en préservant le chemin actuel
  const otherLang = lang === 'fr' ? 'ar' : 'fr';
  let targetPath = `/${otherLang}`;
  if (pathname.startsWith(`/${lang}`)) {
    targetPath = pathname.replace(`/${lang}`, `/${otherLang}`);
  } else if (!pathname.startsWith('/fr') && !pathname.startsWith('/ar')) {
    targetPath = `/${otherLang}${pathname === '/' ? '' : pathname}`;
  }

  const navLinks = [
    {
      href: `/${lang}/salaire-net/75000-da`,
      label: t.nav.salary,
      icon: Calculator,
    },
    {
      href: `/${lang}/douane-voiture/renault-clio-5`,
      label: t.nav.customs,
      icon: Car,
    },
    {
      href: `/${lang}/frais-notaire/1000-millions-centimes`,
      label: t.nav.notary,
      icon: Home,
    },
    {
      href: `/${lang}/devise-square/100-euros`,
      label: t.nav.currency,
      icon: Coins,
    },
    {
      href: `/${lang}/guides/bareme-irg-algerie`,
      label: t.nav.guides,
      icon: BookOpen,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                Hissab<span className="text-emerald-600">DZ</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium -mt-1">
                {isRtl ? 'حساب ديزاد • حاسبات دقيقة' : 'Simulateurs Financiers Algérie'}
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href.split('/').slice(0, 3).join('/'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Langue & Mobile Trigger */}
          <div className="flex items-center gap-2">
            {/* Bouton de bascule de langue */}
            <Link
              href={targetPath}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all hover:border-emerald-300"
              title={isRtl ? 'Passer en Français' : 'التحويل إلى العربية'}
            >
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>{t.otherLang}</span>
            </Link>

            {/* Menu burger mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label={t.nav.menu}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href.split('/').slice(0, 3).join('/'));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-600'
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-600" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
            <span>{t.common.official}</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 2024
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
