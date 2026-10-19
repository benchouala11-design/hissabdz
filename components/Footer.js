import Link from 'next/link';
import { Calculator, ShieldCheck, FileText, Mail, Heart } from 'lucide-react';
import { i18n } from '../lib/i18n';
import { RATES_CONFIG } from '../config/rates';

export default function Footer({ lang = 'fr' }) {
  const t = i18n[lang] || i18n.fr;
  const isRtl = lang === 'ar';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Marque & Présentation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Hissab<span className="text-emerald-400">DZ</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">
                {t.common.updated} :
              </span>{' '}
              {isRtl ? RATES_CONFIG.LAST_UPDATED_AR : RATES_CONFIG.LAST_UPDATED}
            </div>
          </div>

          {/* Col 2: Simulateurs */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t.footer.toolsTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${lang}/salaire-net/75000-da`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.salary}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/douane-voiture/renault-clio-5`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.customs}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/frais-notaire/1000-millions-centimes`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.notary}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/devise-square/100-euros`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.currency}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Guides & Décrets */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t.footer.guidesTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${lang}/guides/bareme-irg-algerie`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isRtl ? 'دليل سلم ضريبة الدخل IRG' : 'Guide Barème IRG 2024'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/guides/article-110-douane-voiture-moins-3-ans`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isRtl ? 'المادة 110: جمركة السيارات' : 'Article 110 : Douane Auto'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/guides/frais-notaire-achat-immobilier-algerie`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isRtl ? 'مصاريف الموثق والعقارات' : 'Frais de Notaire Immobilier'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/guides/declaration-cnas-salaires-algerie`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isRtl ? 'اشتراك الضمان الاجتماعي CNAS' : 'Cotisation CNAS 9%'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Mentions légales & AdSense */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t.footer.legalTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${lang}/a-propos`}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{t.footer.aboutUs}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/confidentialite`}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>{t.footer.privacy}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span>{t.footer.contact}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer officiel */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-400 leading-relaxed text-center">
          <p>{t.common.disclaimer}</p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} HissabDZ ({RATES_CONFIG.SITE_NAME_AR}). {t.footer.rightsReserved}
          </p>
          <p className="flex items-center gap-1">
            <span>Conçu avec rigueur pour l&apos;Algérie</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
