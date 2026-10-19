import { notFound } from 'next/navigation';
import CustomsCalculator from '../../../../components/calculators/CustomsCalculator';
import ComparativeTable from '../../../../components/ComparativeTable';
import FaqSection from '../../../../components/FaqSection';
import InternalLinking from '../../../../components/InternalLinking';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import AdSlot from '../../../../components/AdSlot';
import { RATES_CONFIG } from '../../../../config/rates';
import { i18n, formatDA, formatEUR } from '../../../../lib/i18n';
import voituresData from '../../../../data/voitures.json';

export async function generateStaticParams() {
  const languages = ['fr', 'ar'];
  const items = RATES_CONFIG.PHASE_APPROBATION_ADSENSE
    ? voituresData.filter((v) => v.isAdsensePriority)
    : voituresData;

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
  const item = voituresData.find((v) => v.slug === params?.slug);
  if (!item) return {};

  const isAr = lang === 'ar';
  const title = isAr ? item.titleAr : item.titleFr;
  const description = isAr ? item.descriptionAr : item.descriptionFr;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/douane-voiture/${item.slug}`,
      languages: {
        'fr-DZ': `/fr/douane-voiture/${item.slug}`,
        'ar-DZ': `/ar/douane-voiture/${item.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${RATES_CONFIG.SITE_URL}/${lang}/douane-voiture/${item.slug}`,
      type: 'article',
    },
  };
}

export default function CarCustomsSlugPage({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const t = i18n[lang] || i18n.fr;
  const isAr = lang === 'ar';

  const item = voituresData.find((v) => v.slug === params?.slug);
  if (!item) notFound();

  // 6 Modèles proches pour le maillage interne
  const currentIndex = voituresData.findIndex((v) => v.slug === item.slug);
  const startIdx = Math.max(0, Math.min(currentIndex - 3, voituresData.length - 6));
  const nearbyItems = voituresData
    .filter((_, idx) => idx >= startIdx && idx < startIdx + 7 && idx !== currentIndex)
    .slice(0, 6)
    .map((v) => ({
      href: `/${lang}/douane-voiture/${v.slug}`,
      label: `${v.marque} ${v.modele}`,
      sub: `Revient : ${v.calc2ans.prixRevientMillions} M cts`,
    }));

  // Données du tableau comparatif 1 an / 2 ans / 3 ans
  const tableHeaders = isAr
    ? ['عمر المركبة', 'القيمة الجمركية CIF', 'الرسوم الجمركية', 'شراء العملة بالسكوار', 'التكلفة الإجمالية', 'بملايين السنتيم']
    : ['Âge du Véhicule', 'Valeur CIF Dédouanée', 'Droits & Taxes Douane', 'Achat Devises Square', 'Coût Total de Revient', 'En Millions Cts'];

  const tableRows = item.comparatif.map((c) => [
    isAr ? c.ageAr : c.ageFr,
    formatEUR(c.valeurCifEur),
    formatDA(c.taxesDouaneDA, lang),
    formatDA(c.coutSquareDA, lang),
    formatDA(c.prixRevientTotalDA, lang),
    `${c.prixRevientMillions} M`,
  ]);

  // SoftwareApplication schema
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: isAr
      ? `حاسبة جمركة ${item.marque} ${item.modele} في الجزائر`
      : `Simulateur Dédouanement ${item.marque} ${item.modele} Algérie`,
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
          { label: t.nav.customs, href: `/${lang}/douane-voiture/renault-clio-5` },
          { label: `${item.marque} ${item.modele}` },
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
      <CustomsCalculator
        initialPrixEur={item.prix2024}
        initialAge={2}
        initialCategorie={item.categorie}
        lang={lang}
        hideHeader
      />

      {/* Emplacement publicitaire */}
      <AdSlot slotId="car-middle" />

      {/* 2. TABLEAU COMPARATIF DÉCOTE 1 AN VS 2 ANS VS 3 ANS */}
      <ComparativeTable
        title={t.customs.compareTableTitle}
        headers={tableHeaders}
        rows={tableRows}
        highlightRowIndex={1}
      />

      {/* 3. ANALYSE CONTEXTUELLE DYNAMIQUE */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {isAr
            ? `المواصفات الجمركية لسيارة ${item.marque} ${item.modele}`
            : `Fiche technique et fiscale : ${item.marque} ${item.modele}`}
        </h3>

        <div className="text-sm text-slate-700 leading-relaxed space-y-3">
          <p>
            {isAr ? (
              <>
                تعتبر سيارة <strong className="text-slate-900">{item.marque} {item.modele}</strong> المزودة بمحرك سعة{' '}
                <strong className="text-blue-700">{item.cylindree > 0 ? `${item.cylindree} سم³` : 'كهربائي'}</strong> من أكثر الموديلات طلباً في سوق الاستيراد لأقل من 3 سنوات في الجزائر. يبلغ متوسط سعر اقتنائها في الأسواق الأوروبية حوالي{' '}
                <strong className="text-slate-900">{formatEUR(item.prix2024)}</strong>.
              </>
            ) : (
              <>
                La <strong className="text-slate-900">{item.marque} {item.modele}</strong> équipée de sa motorisation de{' '}
                <strong className="text-blue-700">{item.cylindree > 0 ? `${item.cylindree} cm³` : '100% électrique'}</strong> figure parmi les modèles les plus convoités par les acheteurs algériens. Son prix d&apos;achat moyen sur le marché européen de l&apos;occasion récente se situe autour de{' '}
                <strong className="text-slate-900">{formatEUR(item.prix2024)}</strong>.
              </>
            )}
          </p>

          <p>
            {isAr ? (
              <>
                تستفيد هذه المركبة من تخفيض القدم الجمركي وفق المادة 110 بنسبة 10% إذا كان عمرها سنة، 20% لسنتين، و30% لثلاث سنوات كاملة. وتُحول القيمة المتبقية مضافاً إليها 700 يورو شحن إلى الدينار الجزائري وفق السعر الرسمي لبنك الجزائر ({RATES_CONFIG.TAUX_BANQUE_EUR} دج/يورو) لتحديد الوعاء الجمركي CIF.
              </>
            ) : (
              <>
                Ce véhicule bénéficie de la décote légale pour vétusté de 10% à 1 an, 20% à 2 ans et 30% à 3 ans. La valeur résiduelle majorée du forfait transport (700 €) est convertie au taux officiel de la Banque d&apos;Algérie ({RATES_CONFIG.TAUX_BANQUE_EUR} DA / €) pour établir l&apos;assiette CIF taxable.
              </>
            )}
          </p>

          <p>
            {isAr ? (
              <>
                لحساب التكلفة الحقيقية الكاملة، يتم احتساب العملة الصعبة بسعر السكوار ({RATES_CONFIG.TAUX_SQUARE_EUR} دج/يورو)، لتصل التكلفة الشاملة للسيارة (2 سنوات) إلى حوالي{' '}
                <strong className="text-emerald-700">{formatDA(item.calc2ans.prixRevientTotalDA, lang)}</strong> (أي{' '}
                <strong className="text-emerald-700">{item.calc2ans.prixRevientMillions} مليون سنتيم</strong>).
              </>
            ) : (
              <>
                En intégrant l&apos;achat des devises au marché informel du Square Port-Saïd ({RATES_CONFIG.TAUX_SQUARE_EUR} DA / €), le prix de revient total clé en main pour un exemplaire de 2 ans s&apos;établit à{' '}
                <strong className="text-emerald-700">{formatDA(item.calc2ans.prixRevientTotalDA, lang)}</strong> (soit environ{' '}
                <strong className="text-emerald-700">{item.calc2ans.prixRevientMillions} Millions de centimes</strong>).
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
        currentModule="customs"
        nearbyLinks={nearbyItems}
        title={t.customs.popularCars}
      />
    </div>
  );
}
