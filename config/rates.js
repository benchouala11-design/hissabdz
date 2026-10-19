/**
 * Configuration centrale des taux et paramètres de HissabDZ
 * Mise à jour mensuelle des taux officiels (Banque d'Algérie) et marché parallèle (Square Port-Saïd)
 */
export const RATES_CONFIG = {
  // Taux de change EUR/DZD
  TAUX_BANQUE_EUR: 154.0,
  TAUX_SQUARE_EUR: 255.0,

  // Taux de change USD/DZD
  TAUX_BANQUE_USD: 139.0,
  TAUX_SQUARE_USD: 235.0,

  // Forfait transport standard pour dédouanement auto (<3 ans)
  TRANSPORT_FORFAIT_EUR: 700,

  // Frais fixes notaire / timbres fiscaux
  NOTAIRE_FRAIS_DOSSIER_DA: 15000,

  // Interrupteur de phase d'approbation Google AdSense / Ezoic
  // true = Génère 40 pages prioritaires ciblées (10 par module) + guides pour validation rapide
  // false = Génère l'intégralité du catalogue (+2 500 pages par langue)
  PHASE_APPROBATION_ADSENSE: true,

  // Emplacements publicitaires (désactivés par défaut jusqu'à approbation AdSense)
  ADSENSE_ACTIVE: false,
  ADSENSE_CLIENT_ID: "ca-pub-XXXXXXXXXXXXXXXX",

  // Metadata globales
  SITE_URL: "https://hissabdz.com",
  SITE_NAME: "HissabDZ",
  SITE_NAME_AR: "حساب ديزاد",
  LAST_UPDATED: "Octobre 2024",
  LAST_UPDATED_AR: "أكتوبر 2024",
};

export default RATES_CONFIG;
