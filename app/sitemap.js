import { RATES_CONFIG } from '../config/rates';
import salairesData from '../data/salaires.json';
import voituresData from '../data/voitures.json';
import notaireData from '../data/notaire.json';
import devisesData from '../data/devises.json';
import guidesData from '../data/guides.json';

export default function sitemap() {
  const baseUrl = RATES_CONFIG.SITE_URL;
  const languages = ['fr', 'ar'];
  const routes = [];

  // 1. Pages d'accueil
  for (const lang of languages) {
    routes.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  // 2. Pages Légales
  const legalPages = ['a-propos', 'confidentialite', 'contact'];
  for (const page of legalPages) {
    for (const lang of languages) {
      routes.push({
        url: `${baseUrl}/${lang}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  // 3. Guides complets
  for (const guide of guidesData) {
    for (const lang of languages) {
      routes.push({
        url: `${baseUrl}/${lang}/guides/${guide.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }
  }

  // 4. Salaires Programmatic SEO
  const salaires = RATES_CONFIG.PHASE_APPROBATION_ADSENSE
    ? salairesData.filter((s) => s.isAdsensePriority)
    : salairesData;

  for (const s of salaires) {
    for (const lang of languages) {
      routes.push({
        url: `${baseUrl}/${lang}/salaire-net/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // 5. Voitures Douane Programmatic SEO
  const voitures = RATES_CONFIG.PHASE_APPROBATION_ADSENSE
    ? voituresData.filter((v) => v.isAdsensePriority)
    : voituresData;

  for (const v of voitures) {
    for (const lang of languages) {
      routes.push({
        url: `${baseUrl}/${lang}/douane-voiture/${v.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // 6. Frais de Notaire Programmatic SEO
  const notaire = RATES_CONFIG.PHASE_APPROBATION_ADSENSE
    ? notaireData.filter((n) => n.isAdsensePriority)
    : notaireData;

  for (const n of notaire) {
    for (const lang of languages) {
      routes.push({
        url: `${baseUrl}/${lang}/frais-notaire/${n.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // 7. Devises Square Programmatic SEO
  const devises = RATES_CONFIG.PHASE_APPROBATION_ADSENSE
    ? devisesData.filter((d) => d.isAdsensePriority)
    : devisesData;

  for (const d of devises) {
    for (const lang of languages) {
      routes.push({
        url: `${baseUrl}/${lang}/devise-square/${d.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }

  return routes;
}
