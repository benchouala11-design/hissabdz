import { RATES_CONFIG } from '../config/rates';

/**
 * Composant d'emplacement publicitaire AdSense / Ezoic
 * Contrôlé centralement par RATES_CONFIG.ADSENSE_ACTIVE
 */
export default function AdSlot({
  slotId = '0000000000',
  format = 'auto',
  responsive = 'true',
  className = '',
  label = 'Espace Partenaire',
}) {
  if (!RATES_CONFIG.ADSENSE_ACTIVE) {
    // Si AdSense n'est pas encore actif, on retourne null pour ne pas polluer l'expérience utilisateur
    return null;
  }

  return (
    <div className={`my-8 text-center overflow-hidden ${className}`}>
      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
        {label}
      </span>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[100px] flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={RATES_CONFIG.ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </div>
  );
}
