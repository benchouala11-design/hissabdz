import { RATES_CONFIG } from '../config/rates';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${RATES_CONFIG.SITE_URL}/sitemap.xml`,
  };
}
