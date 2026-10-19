import '../globals.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { RATES_CONFIG } from '../../config/rates';
import { i18n } from '../../lib/i18n';

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const isAr = lang === 'ar';
  const t = i18n[lang] || i18n.fr;

  const title = isAr
    ? `${RATES_CONFIG.SITE_NAME_AR} | حاسبات الرواتب، الجمارك، الموثق والسكوار في الجزائر`
    : `${RATES_CONFIG.SITE_NAME} | Simulateurs Salaire IRG, Douane Auto, Notaire & Devises Algérie`;

  const description = t.siteDescription;

  return {
    title: {
      default: title,
      template: `%s | ${isAr ? RATES_CONFIG.SITE_NAME_AR : RATES_CONFIG.SITE_NAME}`,
    },
    description,
    keywords: [
      'calcul salaire net algerie',
      'irg 2024 algerie',
      'bareme irg algerie',
      'douane voiture moins 3 ans algerie',
      'article 110 douane algerie',
      'frais notaire algerie achat immobilier',
      'cours square port said euro dinar algerien',
      'حساب الراتب الصافي في الجزائر',
      'ضريبة الدخل الإجمالي IRG',
      'جمركة السيارات أقل من 3 سنوات',
      'مصاريف الموثق في الجزائر',
      'سعر اليورو في السكوار اليوم',
    ],
    metadataBase: new URL(RATES_CONFIG.SITE_URL),
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/icon.svg' },
      ],
      shortcut: ['/icon.svg'],
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'fr-DZ': '/fr',
        'ar-DZ': '/ar',
      },
    },
    openGraph: {
      title,
      description,
      url: `${RATES_CONFIG.SITE_URL}/${lang}`,
      siteName: isAr ? RATES_CONFIG.SITE_NAME_AR : RATES_CONFIG.SITE_NAME,
      locale: isAr ? 'ar_DZ' : 'fr_DZ',
      type: 'website',
      images: [
        {
          url: '/icon.svg',
          width: 128,
          height: 128,
          alt: 'HissabDZ Logo',
        },
      ],
    },
  };
}

export default function LangLayout({ children, params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&family=Tajawal:wght@700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`min-h-screen bg-slate-50 flex flex-col ${dir === 'rtl' ? 'font-arabic font-semibold' : 'font-sans'}`}>
        <Navbar lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
