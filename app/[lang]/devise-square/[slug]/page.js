import { notFound } from 'next/navigation';
import CurrencyCalculator from '../../../../components/calculators/CurrencyCalculator';
import ComparativeTable from '../../../../components/ComparativeTable';
import FaqSection from '../../../../components/FaqSection';
import InternalLinking from '../../../../components/InternalLinking';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import AdSlot from '../../../../components/AdSlot';
import { RATES_CONFIG } from '../../../../config/rates';
import { i18n, formatDA } from '../../../../lib/i18n';
import devisesData from '../../../../data/devises.json';

export async function generateStaticParams() {
  const languages = ['fr', 'ar'];
  const items = RATES_CONFIG.PHASE_APPROBATION_ADSENSE
    ? devisesData.filter((d) => d.isAdsensePriority)
    : devisesData;

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
  const item = devisesData.find((d) => d.slug === params?.slug);
  if (!item) return {};

  const isAr = lang === 'ar';
  const title = isAr ? item.titleAr : item.titleFr;
  const description = isAr ? item.descriptionAr : item.descriptionFr;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/devise-square/${item.slug}`,
      languages: {
        'fr-DZ': `/fr/devise-square/${item.slug}`,
        'ar-DZ': `/ar/devise-square/${item.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${RATES_CONFIG.SITE_URL}/${lang}/devise-square/${item.slug}`,
      type: 'article',
    },
  };
}

export default function CurrencySlugPage({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const t = i18n[lang] || i18n.fr;
  const isAr = lang === 'ar';

  const item = devisesData.find((d) => d.slug === params?.slug);
  if (!item) notFound();

  // 6 Montants proches pour le maillage interne
  const currentIndex = devisesData.findIndex((d) => d.slug === item.slug);
  const startIdx = Math.max(0, Math.min(currentIndex - 3, devisesData.length - 6));
  const nearbyItems = devisesData
    .filter((_, idx) => idx >= startIdx && idx < startIdx + 7 && idx !== currentIndex)
    .slice(0, 6)
    .map((d) => ({
      href: `/${lang}/devise-square/${d.slug}`,
      label: `${d.montant} €`,
      sub: `Square : ${formatDA(d.calcEur.squareDA, lang)}`,
    }));

  // Données du tableau comparatif
  const tableHeaders = isAr
    ? ['سوق الصرف', 'سعر الصرف المعتمد', 'القيمة بالدينار', 'بملايين السنتيم', 'اللسان الدارج الجزائري']
    : ['Marché de Change', 'Taux Appliqué', 'Valeur en Dinars', 'En Millions Cts', 'Langage Populaire'];

  const tableRows = item.comparatif.map((c) => [
    isAr ? c.marcheAr : c.marcheFr,
    isAr ? c.tauxAr : c.tauxFr,
    formatDA(c.valeurDA, lang),
    `${c.valeurMillions} M`,
    isAr ? c.parleAr : c.parleFr,
  ]);

  // SoftwareApplication schema
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: isAr
      ? `محول عملات السكوار ${item.montant} يورو`
      : `Convertisseur Devises Square ${item.montant} Euros Algérie`,
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
          { label: t.nav.currency, href: `/${lang}/devise-square/100-euros` },
          { label: `${item.montant} €` },
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
      <CurrencyCalculator
        initialMontant={item.montant}
        initialDevise="EUR"
        lang={lang}
        hideHeader
      />

      {/* Emplacement publicitaire */}
      <AdSlot slotId="currency-middle" />

      {/* 2. TABLEAU COMPARATIF DÉTAILLÉ */}
      <ComparativeTable
        title={t.currency.compareTableTitle}
        headers={tableHeaders}
        rows={tableRows}
        highlightRowIndex={0}
      />

      {/* 3. ANALYSE CONTEXTUELLE DYNAMIQUE */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {isAr
            ? `تحليل حركة صرف مبلغ ${item.montant} يورو في السوق الجزائري`
            : `Analyse du change pour ${item.montant} Euros sur le marché algérien`}
        </h3>

        <div className="text-sm text-slate-700 leading-relaxed space-y-3">
          <p>
            {isAr ? (
              <>
                عند صرف مبلغ <strong className="text-slate-900">{item.montant} يورو</strong> في ساحة بورسعيد (السكوار)، يحصل المواطن على{' '}
                <strong className="text-amber-700">{formatDA(item.calcEur.squareDA, lang)}</strong> بالدينار الجزائري، أي ما يعادل بالدارجة الجزائرية المتداولة في الأسواق الشعبية:{' '}
                <strong className="text-slate-900">{item.calcEur.populaireAr}</strong>.
              </>
            ) : (
              <>
                Lors de la conversion de <strong className="text-slate-900">{item.montant} €</strong> sur le marché parallèle du Square Port-Saïd, la contre-valeur perçue s&apos;établit à{' '}
                <strong className="text-amber-700">{formatDA(item.calcEur.squareDA, lang)}</strong>, couramment exprimée en dialecte algérien par :{' '}
                <strong className="text-slate-900">{item.calcEur.populaireFr}</strong>.
              </>
            )}
          </p>

          <p>
            {isAr ? (
              <>
                في المقابل، يُسجل السعر البنكي الرسمي الصادر عن بنك الجزائر قيمة قدرها{' '}
                <strong className="text-slate-900">{formatDA(item.calcEur.banqueDA, lang)}</strong>، مما يُفرز فارقاً مالياً مباشراً قدره{' '}
                <strong className="text-rose-700">+{formatDA(item.calcEur.ecartDA, lang)}</strong> لصالح السوق الموازي.
              </>
            ) : (
              <>
                À titre de comparaison, le cours bancaire officiel de la Banque d&apos;Algérie valorise ce même montant à{' '}
                <strong className="text-slate-900">{formatDA(item.calcEur.banqueDA, lang)}</strong>, générant un écart positif direct de{' '}
                <strong className="text-rose-700">+{formatDA(item.calcEur.ecartDA, lang)}</strong> au profit du marché informel.
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
        currentModule="currency"
        nearbyLinks={nearbyItems}
        title={t.currency.popularAmounts}
      />
    </div>
  );
}
