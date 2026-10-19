import Link from 'next/link';
import {
  Calculator,
  Car,
  Home as HomeIcon,
  Coins,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { i18n } from '../../lib/i18n';
import { RATES_CONFIG } from '../../config/rates';
import SalaryCalculator from '../../components/calculators/SalaryCalculator';
import AdSlot from '../../components/AdSlot';

import salairesData from '../../data/salaires.json';
import voituresData from '../../data/voitures.json';
import notaireData from '../../data/notaire.json';
import devisesData from '../../data/devises.json';
import guidesData from '../../data/guides.json';

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const isAr = lang === 'ar';
  const t = i18n[lang] || i18n.fr;

  return {
    title: isAr
      ? 'حساب ديزاد | بوابة محاكاة الرواتب، الجمارك، الموثق والعملات في الجزائر'
      : 'HissabDZ | Simulateurs Salaire Net IRG, Douane Auto, Frais de Notaire & Square Algérie',
    description: t.siteDescription,
  };
}

export default function HomePage({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const t = i18n[lang] || i18n.fr;
  const isAr = lang === 'ar';

  const tools = [
    {
      id: 'salary',
      href: `/${lang}/salaire-net/75000-da`,
      icon: Calculator,
      color: 'from-emerald-500 to-teal-700',
      badge: isAr ? 'سلم 2024 الجديد' : 'Barème IRG 2024',
      title: isAr ? 'الراتب الصافي والضريبة IRG' : 'Salaire Net & Impôt IRG',
      desc: isAr
        ? 'حساب اقتطاع الضمان الاجتماعي 9%، ضريبة الدخل الإجمالي ومقارنة نظام الشمال ونظام الجنوب.'
        : 'Déduction CNAS (9%), barème progressif IRG, abattement de 40% et régime Grand Sud (-50%).',
      stat: isAr ? '26 شريحة رواتب' : '26 paliers certifiés',
    },
    {
      id: 'customs',
      href: `/${lang}/douane-voiture/renault-clio-5`,
      icon: Car,
      color: 'from-blue-600 to-indigo-800',
      badge: isAr ? 'المادة 110 رسمية' : 'Article 110 Officiel',
      title: isAr ? 'جمركة السيارات (< 3 سنوات)' : 'Douane Auto (< 3 Ans)',
      desc: isAr
        ? 'تقدير حقوق الجمارك، تخفيض القدم الجمركي 10% إلى 30%، وتكلفة العملة بالسكوار.'
        : 'Valeur CIF, décote pour vétusté, abattements 80%/50%/20% et coût de revient au Square.',
      stat: isAr ? '30 سيارة شائعة' : '30 modèles populaires',
    },
    {
      id: 'notary',
      href: `/${lang}/frais-notaire/1000-millions-centimes`,
      icon: HomeIcon,
      color: 'from-teal-600 to-emerald-900',
      badge: isAr ? 'السلم التنازلي' : 'Barème Légal',
      title: isAr ? 'مصاريف الموثق العقاري' : 'Frais de Notaire Immobilier',
      desc: isAr
        ? 'حقوق التسجيل 2.5%، المحافظة العقارية 1%، أتعاب الموثق والتكاليف بملايين السنتيم.'
        : 'Droits d\'enregistrement (2.5%), publicité foncière (1%) et honoraires légaux en Dinars et Millions.',
      stat: isAr ? '14 فئة عقارية' : '14 tranches de prix',
    },
    {
      id: 'currency',
      href: `/${lang}/devise-square/100-euros`,
      icon: Coins,
      color: 'from-amber-500 to-yellow-700',
      badge: isAr ? 'تحديث شهري' : 'Double Taux Mensuel',
      title: isAr ? 'محول السكوار وبنك الجزائر' : 'Devises : Square vs Banque',
      desc: isAr
        ? 'مقارنة مباشرة بين سعر ساحة بورسعيد والسعر البنكي مع اللسان الدارج الجزائري.'
        : 'Comparateur instantané EUR/USD : cours informel Port-Saïd, Banque d\'Algérie et parlé algérien.',
      stat: `1 € = ${RATES_CONFIG.TAUX_SQUARE_EUR} DA`,
    },
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-sm animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {isAr ? 'البوابة الرسمية الأولى لمحاكاة الحسابات في الجزائر' : 'Portail n°1 des simulateurs financiers et administratifs en Algérie'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          {isAr ? (
            <>
              احسب كل أمورك المالية بدقة مع{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
                حساب ديزاد
              </span>
            </>
          ) : (
            <>
              Tous vos calculs financiers & administratifs avec{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
                HissabDZ
              </span>
            </>
          )}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t.siteDescription}
        </p>

        {/* Badges de confiance */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {t.common.official}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {isAr ? 'حسابات فورية مجانية 100%' : '100% Gratuit & Sans Inscription'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            {t.common.updated} : {isAr ? RATES_CONFIG.LAST_UPDATED_AR : RATES_CONFIG.LAST_UPDATED}
          </span>
        </div>
      </section>

      {/* 2. GRILLE DES 4 OUTILS MAJEURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-emerald-700">
                  <span className="text-emerald-700 font-bold">{tool.stat}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Emplacement publicitaire standard (désactivé tant que ADSENSE_ACTIVE = false) */}
      <div className="max-w-7xl mx-auto px-4">
        <AdSlot slotId="home-top" label="Annonce sponsorisée" />
      </div>

      {/* 3. SIMULATEUR SALAIRE EN DIRECT SUR L'ACCUEIL */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isAr ? 'تجربة حية وسريعة' : 'Test Rapide en Direct'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {isAr ? 'جرّب حاسبة الراتب الصافي والضريبة الآن' : 'Simulez votre salaire net en quelques secondes'}
          </h2>
        </div>
        <SalaryCalculator initialBrut={75000} lang={lang} />
      </section>

      {/* 4. RECHERCHES & PALIERS POPULAIRES (PROGRAMMATIC SEO HUB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="border-t border-slate-200 pt-12">
          <div className="flex items-center gap-2 mb-8 justify-center text-center">
            <Layers className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {isAr ? 'عمليات المحاكاة والصفحات الأكثر زيارة' : 'Simulations & Paliers les Plus Consultés'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Salaires */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>{t.salary.popularBrackets}</span>
              </h4>
              <ul className="space-y-2 text-xs">
                {salairesData.slice(0, 6).map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/${lang}/salaire-net/${item.slug}`}
                      className="hover:text-emerald-700 flex items-center justify-between text-slate-600 py-1 border-b border-slate-50 hover:bg-slate-50 px-1 rounded transition-colors"
                    >
                      <span className="font-semibold">{item.brut.toLocaleString('fr-FR')} {t.common.da}</span>
                      <span className="text-emerald-700 font-bold">Net: {item.calc.net.toLocaleString('fr-FR')} {t.common.da}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Voitures */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span>{t.customs.popularCars}</span>
              </h4>
              <ul className="space-y-2 text-xs">
                {voituresData.slice(0, 6).map((car) => (
                  <li key={car.slug}>
                    <Link
                      href={`/${lang}/douane-voiture/${car.slug}`}
                      className="hover:text-blue-700 flex items-center justify-between text-slate-600 py-1 border-b border-slate-50 hover:bg-slate-50 px-1 rounded transition-colors"
                    >
                      <span className="font-semibold truncate max-w-[140px]">{car.modele}</span>
                      <span className="text-blue-700 font-bold">{car.calc2ans.prixRevientMillions} M</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notaire */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-teal-600" />
                <span>{t.notary.popularBrackets}</span>
              </h4>
              <ul className="space-y-2 text-xs">
                {notaireData.slice(0, 6).map((n) => (
                  <li key={n.slug}>
                    <Link
                      href={`/${lang}/frais-notaire/${n.slug}`}
                      className="hover:text-teal-700 flex items-center justify-between text-slate-600 py-1 border-b border-slate-50 hover:bg-slate-50 px-1 rounded transition-colors"
                    >
                      <span className="font-semibold">{n.millionsCts} M cts</span>
                      <span className="text-teal-700 font-bold">{n.calc.totalFraisMillions} M</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Devises */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>{t.currency.popularAmounts}</span>
              </h4>
              <ul className="space-y-2 text-xs">
                {devisesData.slice(0, 6).map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/${lang}/devise-square/${d.slug}`}
                      className="hover:text-amber-700 flex items-center justify-between text-slate-600 py-1 border-b border-slate-50 hover:bg-slate-50 px-1 rounded transition-colors"
                    >
                      <span className="font-semibold">{d.montant} €</span>
                      <span className="text-amber-700 font-bold">{d.calcEur.squareDA.toLocaleString('fr-FR')} {t.common.da}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GUIDES DE FOND POUR ADSENSE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                {t.nav.guides}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
                {t.guidesPage.title}
              </h2>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                {t.guidesPage.subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidesData.map((guide) => (
              <Link
                key={guide.slug}
                href={`/${lang}/guides/${guide.slug}`}
                className="group bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span>{guide.readingTime} de lecture</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2">
                    {isAr ? guide.titleAr : guide.titleFr}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {isAr ? guide.summaryAr : guide.summaryFr}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-300">
                  <span>{guide.updatedAt}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
