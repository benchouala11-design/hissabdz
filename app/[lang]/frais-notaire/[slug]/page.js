import { notFound } from 'next/navigation';
import NotaryCalculator from '../../../../components/calculators/NotaryCalculator';
import ComparativeTable from '../../../../components/ComparativeTable';
import FaqSection from '../../../../components/FaqSection';
import InternalLinking from '../../../../components/InternalLinking';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import AdSlot from '../../../../components/AdSlot';
import { RATES_CONFIG } from '../../../../config/rates';
import { i18n, formatDA } from '../../../../lib/i18n';
import notaireData from '../../../../data/notaire.json';

export async function generateStaticParams() {
  const languages = ['fr', 'ar'];
  const items = RATES_CONFIG.PHASE_APPROBATION_ADSENSE
    ? notaireData.filter((n) => n.isAdsensePriority)
    : notaireData;

  const params = [];
  for (const lang of languages) {
    for (const item of items) {
      params.push({ lang, slug: item.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const item = notaireData.find((n) => n.slug === params?.slug);
  if (!item) return {};

  const isAr = lang === 'ar';
  const title = isAr ? item.titleAr : item.titleFr;
  const description = isAr ? item.descriptionAr : item.descriptionFr;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/frais-notaire/${item.slug}`,
      languages: {
        'fr-DZ': `/fr/frais-notaire/${item.slug}`,
        'ar-DZ': `/ar/frais-notaire/${item.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${RATES_CONFIG.SITE_URL}/${lang}/frais-notaire/${item.slug}`,
      type: 'article',
    },
  };
}

export default function NotarySlugPage({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const t = i18n[lang] || i18n.fr;
  const isAr = lang === 'ar';

  const item = notaireData.find((n) => n.slug === params?.slug);
  if (!item) notFound();

  // 6 Paliers proches pour le maillage interne
  const currentIndex = notaireData.findIndex((n) => n.slug === item.slug);
  const startIdx = Math.max(0, Math.min(currentIndex - 3, notaireData.length - 6));
  const nearbyItems = notaireData
    .filter((_, idx) => idx >= startIdx && idx < startIdx + 7 && idx !== currentIndex)
    .slice(0, 6)
    .map((n) => ({
      href: `/${lang}/frais-notaire/${n.slug}`,
      label: `${n.millionsCts} M centimes`,
      sub: `Frais : ${n.calc.totalFraisMillions} M cts`,
    }));

  // Données du tableau comparatif
  const tableHeaders = isAr
    ? ['بند المصاريف والرسوم', 'النسبة القانونية', 'المبلغ بالدينار', 'بملايين السنتيم']
    : ['Poste de Dépense', 'Taux Appliqué', 'Montant en Dinars', 'En Millions Cts'];

  const tableRows = item.comparatif.map((c) => [
    isAr ? c.posteAr : c.posteFr,
    c.taux,
    formatDA(c.montantDA, lang),
    `${c.montantMillions} M`,
  ]);

  // SoftwareApplication schema
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: isAr
      ? `حاسبة مصاريف الموثق لعقار ${item.millionsCts} مليون سنتيم`
      : `Calculateur Frais Notaire Algérie ${item.millionsCts} Millions Centimes`,
    operatingSystem: 'All',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'DZD',
    },
    description: isAr ? item.descriptionAr : item.descriptionFr,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      {/* Fil d'ariane */}
      <Breadcrumbs
        lang={lang}
        items={[
          { label: t.nav.notary, href: `/${lang}/frais-notaire/1000-millions-centimes` },
          { label: `${item.millionsCts} Millions Centimes` },
        ]}
      />

      {/* Titre SEO Principal */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isAr ? item.titleAr : item.titleFr}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isAr ? item.descriptionAr : item.descriptionFr}
        </p>
      </div>

      {/* 1. CALCULATEUR INTERACTIF PRÉ-REMPLI */}
      <NotaryCalculator initialPrixDA={item.montantDA} lang={lang} hideHeader />

      {/* Emplacement publicitaire */}
      <AdSlot slotId="notary-middle" />

      {/* 2. TABLEAU COMPARATIF DÉTAILLÉ */}
      <ComparativeTable
        title={t.notary.compareTableTitle}
        headers={tableHeaders}
        rows={tableRows}
        highlightRowIndex={0}
      />

      {/* 3. ANALYSE CONTEXTUELLE DYNAMIQUE */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {isAr
            ? `توزيع مصاريف شراء عقار بقيمة ${item.millionsCts} مليون سنتيم`
            : `Répartition légale des frais pour un bien de ${item.millionsCts} Millions de centimes`}
        </h3>

        <div className="text-sm text-slate-700 leading-relaxed space-y-3">
          <p>
            {isAr ? (
              <>
                عند إبرام عقد بيع عقاري رسمي بقيمة <strong className="text-slate-900">{formatDA(item.montantDA, lang)}</strong> (أي ما يعادل {item.millionsCts} مليون سنتيم)، ينص القانون الجزائري على تحصيل حقوق التسجيل الجبائي بنسبة 2.5% لصالح مصلحة الضرائب، وهو ما يعادل{' '}
                <strong className="text-emerald-700">{formatDA(item.calc.enregistrementDA, lang)}</strong>.
              </>
            ) : (
              <>
                Lors de la passation de l&apos;acte authentique de vente pour un bien évalué à <strong className="text-slate-900">{formatDA(item.montantDA, lang)}</strong> (soit {item.millionsCts} Millions de centimes), l&apos;administration fiscale perçoit un droit d&apos;enregistrement de 2.5%, représentant une contribution directe de{' '}
                <strong className="text-emerald-700">{formatDA(item.calc.enregistrementDA, lang)}</strong>.
              </>
            )}
          </p>

          <p>
            {isAr ? (
              <>
                تُضاف إلى ذلك رسوم المحافظة العقارية والإشهار بنسبة 1% بقيمة{' '}
                <strong className="text-blue-700">{formatDA(item.calc.conservationDA, lang)}</strong> لضمان حماية الملكية العقارية واستخراج الدفتر العقاري. أما أتعاب الموثق فتحسب وفق السلم التنازلي الإجباري مع رسم 19% لتصل إلى{' '}
                <strong className="text-indigo-700">{formatDA(item.calc.honorairesTTC, lang)}</strong>.
              </>
            ) : (
              <>
                S&apos;y ajoute la taxe de publicité foncière de 1% d&apos;un montant de{' '}
                <strong className="text-blue-700">{formatDA(item.calc.conservationDA, lang)}</strong>, indispensable à la publication auprès de la conservation foncière et à la délivrance du livret foncier. Les émoluments légaux du notaire s&apos;établissent quant à eux à{' '}
                <strong className="text-indigo-700">{formatDA(item.calc.honorairesTTC, lang)}</strong> TTC.
              </>
            )}
          </p>

          <p>
            {isAr ? (
              <>
                إجمالاً، يتعين على المشتري تحضير سيولة إضافية قدرها{' '}
                <strong className="text-emerald-700">{formatDA(item.calc.totalFraisDA, lang)}</strong> (أي{' '}
                <strong className="text-emerald-700">{item.calc.totalFraisMillions} مليون سنتيم</strong>)، لتبلغ التكلفة الكلية للشراء{' '}
                <strong className="text-slate-900">{formatDA(item.calc.coutTotalDA, lang)}</strong>.
              </>
            ) : (
              <>
                Au total, l&apos;acquéreur doit prévoir une enveloppe additionnelle de{' '}
                <strong className="text-emerald-700">{formatDA(item.calc.totalFraisDA, lang)}</strong> (soit{' '}
                <strong className="text-emerald-700">{item.calc.totalFraisMillions} Millions de centimes</strong>), portant l&apos;investissement global à{' '}
                <strong className="text-slate-900">{formatDA(item.calc.coutTotalDA, lang)}</strong>.
              </>
            )}
          </p>
        </div>
      </section>

      {/* 4. QUESTIONS FRÉQUENTES (FAQ AVEC SCHEMA RICH SNIPPETS) */}
      <FaqSection
        title={t.common.faq}
        faqs={isAr ? item.faqAr : item.faqFr}
        lang={lang}
      />

      {/* 5. MAILLAGE INTERNE & CROSS-LINKING */}
      <InternalLinking
        lang={lang}
        currentModule="notary"
        nearbyLinks={nearbyItems}
        title={t.notary.popularBrackets}
      />
    </div>
  );
}
