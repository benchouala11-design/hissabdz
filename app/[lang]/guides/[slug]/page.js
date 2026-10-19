import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import AdSlot from '../../../../components/AdSlot';
import { RATES_CONFIG } from '../../../../config/rates';
import { i18n } from '../../../../lib/i18n';
import guidesData from '../../../../data/guides.json';

export async function generateStaticParams() {
  const languages = ['fr', 'ar'];
  const params = [];
  for (const lang of languages) {
    for (const guide of guidesData) {
      params.push({ lang, slug: guide.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const guide = guidesData.find((g) => g.slug === params?.slug);
  if (!guide) return {};

  const isAr = lang === 'ar';
  const title = isAr ? guide.titleAr : guide.titleFr;
  const description = isAr ? guide.summaryAr : guide.summaryFr;

  return {
    title: `${title} | ${isAr ? RATES_CONFIG.SITE_NAME_AR : RATES_CONFIG.SITE_NAME}`,
    description,
    alternates: {
      canonical: `/${lang}/guides/${guide.slug}`,
      languages: {
        'fr-DZ': `/fr/guides/${guide.slug}`,
        'ar-DZ': `/ar/guides/${guide.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${RATES_CONFIG.SITE_URL}/${lang}/guides/${guide.slug}`,
      type: 'article',
      publishedTime: '2024-10-01T00:00:00Z',
    },
  };
}

export default function GuideSlugPage({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const t = i18n[lang] || i18n.fr;
  const isAr = lang === 'ar';

  const guide = guidesData.find((g) => g.slug === params?.slug);
  if (!guide) notFound();

  const sections = isAr ? guide.sectionsAr : guide.sectionsFr;

  // Schéma Schema.org Article pour AdSense et Google Rich Snippets
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isAr ? guide.titleAr : guide.titleFr,
    description: isAr ? guide.summaryAr : guide.summaryFr,
    author: {
      '@type': 'Organization',
      name: 'HissabDZ Rédaction Juridique & Fiscale',
      url: RATES_CONFIG.SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'HissabDZ',
      url: RATES_CONFIG.SITE_URL,
    },
    datePublished: '2024-10-01',
    dateModified: '2024-10-15',
    inLanguage: isAr ? 'ar' : 'fr',
    mainEntityOfPage: `${RATES_CONFIG.SITE_URL}/${lang}/guides/${guide.slug}`,
  };

  const otherGuides = guidesData
    .filter((g) => g.slug !== guide.slug)
    .slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Fil d'ariane */}
      <Breadcrumbs
        lang={lang}
        items={[
          { label: t.nav.guides, href: `/${lang}/guides/bareme-irg-algerie` },
          { label: isAr ? guide.titleAr : guide.titleFr },
        ]}
      />

      {/* En-tête de l'article */}
      <header className="space-y-4 border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAr ? 'دليل قانوني معتمد' : 'Guide Pratique Législatif'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {isAr ? guide.titleAr : guide.titleFr}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
          {isAr ? guide.summaryAr : guide.summaryFr}
        </p>

        {/* Métadonnées auteur et date */}
        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            <span>{guide.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{guide.updatedAt}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{guide.readingTime} de lecture</span>
          </div>
        </div>
      </header>

      {/* Publicité sous le titre */}
      <AdSlot slotId="guide-top" />

      {/* Corps du Guide avec sections riches */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
        {sections.map((sec, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>{sec.heading}</span>
            </h2>
            <p className="leading-relaxed">{sec.content}</p>

            {sec.list && sec.list.length > 0 && (
              <ul className="space-y-2 pt-2 pr-2 pl-2">
                {sec.list.map((item, lIdx) => (
                  <li key={lIdx} className="flex items-start gap-2.5 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/* Encadré d'expertise légale */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 flex items-start gap-3.5">
        <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 space-y-1">
          <strong className="block text-sm font-bold text-emerald-900">
            {isAr ? 'ضمان الدقة القانونية' : 'Garantie de Conformité Juridique'}
          </strong>
          <p>
            {isAr
              ? 'تتم مراجعة كافة المقالات والدلائل التشريعية في حساب ديزاد بالرجوع المباشر للجريدة الرسمية للجمهورية الجزائرية الديمقراطية الشعبية وقوانين المالية التكميلية.'
              : 'Tous les guides édités par HissabDZ sont vérifiés en référence directe avec le Journal Officiel de la République Algérienne Démocratique et Populaire et les instructions fiscales de la DGI.'}
          </p>
        </div>
      </div>

      {/* Guides associés */}
      <div className="pt-8 border-t border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          {isAr ? 'دلائل ومقالات أخرى مفيدة' : 'Autres Guides Recommandés'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherGuides.map((g) => (
            <Link
              key={g.slug}
              href={`/${lang}/guides/${g.slug}`}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] text-emerald-600 font-bold block mb-1">
                  {g.readingTime}
                </span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {isAr ? g.titleAr : g.titleFr}
                </h4>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-emerald-600 font-medium inline-flex items-center gap-1 mt-3">
                {t.guidesPage.readGuide}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
