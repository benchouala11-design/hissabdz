import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { RATES_CONFIG } from '../config/rates';

export default function Breadcrumbs({ items = [], lang = 'fr' }) {
  if (!items || items.length === 0) return null;

  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'ar' ? 'الرئيسية' : 'Accueil',
        item: `${RATES_CONFIG.SITE_URL}/${lang}`,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href ? `${RATES_CONFIG.SITE_URL}${item.href}` : undefined,
      })),
    ],
  };

  return (
    <nav aria-label="Fil d'ariane" className="my-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
        <li>
          <Link
            href={`/${lang}`}
            className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'الرئيسية' : 'Accueil'}</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {isLast || !item.href ? (
                <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-emerald-700 transition-colors truncate max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
