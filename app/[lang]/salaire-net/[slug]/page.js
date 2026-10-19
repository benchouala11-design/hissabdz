import { notFound } from 'next/navigation';
import SalaryCalculator from '../../../../components/calculators/SalaryCalculator';
import ComparativeTable from '../../../../components/ComparativeTable';
import FaqSection from '../../../../components/FaqSection';
import InternalLinking from '../../../../components/InternalLinking';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import AdSlot from '../../../../components/AdSlot';
import { RATES_CONFIG } from '../../../../config/rates';
import { i18n, formatDA, formatMillionsCentimes } from '../../../../lib/i18n';
import salairesData from '../../../../data/salaires.json';

export async function generateStaticParams() {
  const languages = ['fr', 'ar'];
  const items = RATES_CONFIG.PHASE_APPROBATION_ADSENSE
    ? salairesData.filter((s) => s.isAdsensePriority)
    : salairesData;

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
  const item = salairesData.find((s) => s.slug === params?.slug);
  if (!item) return {};

  const isAr = lang === 'ar';
  const title = isAr ? item.titleAr : item.titleFr;
  const description = isAr ? item.descriptionAr : item.descriptionFr;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/salaire-net/${item.slug}`,
      languages: {
        'fr-DZ': `/fr/salaire-net/${item.slug}`,
        'ar-DZ': `/ar/salaire-net/${item.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${RATES_CONFIG.SITE_URL}/${lang}/salaire-net/${item.slug}`,
      type: 'article',
    },
  };
}

export default function SalarySlugPage({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const t = i18n[lang] || i18n.fr;
  const isAr = lang === 'ar';

  const item = salairesData.find((s) => s.slug === params?.slug);
  if (!item) notFound();

  // 6 Paliers proches pour le maillage interne
  const currentIndex = salairesData.findIndex((s) => s.slug === item.slug);
  const startIdx = Math.max(0, Math.min(currentIndex - 3, salairesData.length - 6));
  const nearbyItems = salairesData
    .filter((_, idx) => idx >= startIdx && idx < startIdx + 7 && idx !== currentIndex)
    .slice(0, 6)
    .map((s) => ({
      href: `/${lang}/salaire-net/${s.slug}`,
      label: `${s.brut.toLocaleString('fr-FR')} ${t.common.da}`,
      sub: `Net : ${s.calc.net.toLocaleString('fr-FR')} ${t.common.da}`,
    }));

  // Données du tableau comparatif
  const tableHeaders = isAr
    ? ['النظام المطبق', 'الراتب الخام', 'الضمان الاجتماعي (9%)', 'الضريبة (IRG)', 'الراتب الصافي', 'بملايين السنتيم']
    : ['Régime de Travail', 'Salaire Brut', 'Cotisation CNAS (9%)', 'Impôt IRG', 'Salaire Net', 'En Millions Cts'];

  const tableRows = item.comparatif.map((c) => [
    isAr ? c.regimeAr : c.regimeFr,
    formatDA(c.brutDA, lang),
    `-${formatDA(c.cnasDA, lang)}`,
    `-${formatDA(c.irgDA, lang)}`,
    formatDA(c.netDA, lang),
    `${c.netMillions} M`,
  ]);

  // Schema SoftwareApplication pour Google Rich Snippets
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: isAr ? `حاسبة الراتب الصافي ${item.brut} دج` : `Calculateur Salaire Net Algérie ${item.brut} DA`,
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
          { label: t.nav.salary, href: `/${lang}/salaire-net/75000-da` },
          { label: `${item.brut.toLocaleString('fr-FR')} ${t.common.da}` },
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
      <SalaryCalculator initialBrut={item.brut} lang={lang} hideHeader />

      {/* Emplacement publicitaire */}
      <AdSlot slotId="salary-middle" />

      {/* 2. TABLEAU COMPARATIF UNIQUE */}
      <ComparativeTable
        title={t.salary.compareTableTitle}
        headers={tableHeaders}
        rows={tableRows}
        highlightRowIndex={0}
      />

      {/* 3. ANALYSE CONTEXTUELLE DYNAMIQUE */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {isAr
            ? `تحليل مفصل لاقتطاعات راتب ${item.brut.toLocaleString('fr-FR')} دج`
            : `Analyse détaillée des retenues sur un salaire brut de ${item.brut.toLocaleString('fr-FR')} DA`}
        </h3>

        <div className="text-sm text-slate-700 leading-relaxed space-y-3">
          <p>
            {isAr ? (
              <>
                بالنسبة لأجير يتقاضى راتب منصب خام قدره{' '}
                <strong className="text-slate-900">{formatDA(item.brut, lang)}</strong>، فإن أول اقتطاع قانوني يتمثل في اشتراك الصندوق الوطني للضمان الاجتماعي (CNAS) بنسبة 9%، وهو ما يعادل{' '}
                <strong className="text-blue-700">{formatDA(item.calc.cnas, lang)}</strong> شهرياً.
              </>
            ) : (
              <>
                Pour un travailleur percevant un salaire de poste brut de{' '}
                <strong className="text-slate-900">{formatDA(item.brut, lang)}</strong>, la première déduction légale concerne la cotisation à la Sécurité Sociale (CNAS) à hauteur de 9%, soit un prélèvement mensuel direct de{' '}
                <strong className="text-blue-700">{formatDA(item.calc.cnas, lang)}</strong>.
              </>
            )}
          </p>

          <p>
            {isAr ? (
              <>
                بعد خصم الضمان الاجتماعي، يستقر الراتب الخاضع للضريبة عند{' '}
                <strong className="text-slate-900">{formatDA(item.calc.salaireImposable, lang)}</strong>. يخضع هذا المبلغ لسلم الضريبة على الدخل الإجمالي (IRG) المعمول به بموجب قانون المالية الجزائري، مع الاستفادة من التخفيض الجزافي العام البالغ 40% (المحصور بين 1000 و1500 دج).
              </>
            ) : (
              <>
                Une fois la sécurité sociale retranchée, le salaire net imposable ressort à{' '}
                <strong className="text-slate-900">{formatDA(item.calc.salaireImposable, lang)}</strong>. Ce montant est alors soumis au barème progressif par tranches de l&apos;IRG en vigueur en Algérie, après déduction de l&apos;abattement général de 40% plafonné à 1 500 DA.
              </>
            )}
          </p>

          <p>
            {isAr ? (
              <>
                في المحصلة، يتقاضى الأجير في ولايات الشمال راتباً صافياً للقبض قدره{' '}
                <strong className="text-emerald-700">{formatDA(item.calc.net, lang)}</strong> (أي{' '}
                <strong className="text-emerald-700">{formatMillionsCentimes(item.calc.net, lang)}</strong>). أما في حال العمل بولايات الجنوب الكبير، فإن التخفيض الخاص بنسبة 50% يرفع الراتب الصافي إلى{' '}
                <strong className="text-emerald-700">{formatDA(item.calcSud.net, lang)}</strong>.
              </>
            ) : (
              <>
                Au final, le salarié perçoit dans le Régime Nord un salaire net en poche de{' '}
                <strong className="text-emerald-700">{formatDA(item.calc.net, lang)}</strong> (soit{' '}
                <strong className="text-emerald-700">{formatMillionsCentimes(item.calc.net, lang)}</strong>). En revanche, s&apos;il exerce dans une wilaya du Grand Sud éligible, l&apos;abattement fiscal supplémentaire de 50% porte son net à{' '}
                <strong className="text-emerald-700">{formatDA(item.calcSud.net, lang)}</strong>.
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
        currentModule="salary"
        nearbyLinks={nearbyItems}
        title={t.common.relatedCalculations}
      />
    </div>
  );
}
