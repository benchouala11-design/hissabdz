'use client';

import { useState } from 'react';
import {
  Car,
  Ship,
  Sparkles,
  Check,
  Share2,
  Calendar,
  Gauge,
  Percent,
} from 'lucide-react';
import { calculateCarCustoms, CAR_CATEGORIES } from '../../lib/formulas';
import { i18n, formatDA, formatEUR, formatMillionsCentimes } from '../../lib/i18n';
import { RATES_CONFIG } from '../../config/rates';

export default function CustomsCalculator({
  initialPrixEur = 15000,
  initialAge = 2,
  initialCategorie = 'electrique_ou_petit_essence',
  lang = 'fr',
  hideHeader = false,
}) {
  const [prixEur, setPrixEur] = useState(initialPrixEur);
  const [transportEur, setTransportEur] = useState(RATES_CONFIG.TRANSPORT_FORFAIT_EUR);
  const [age, setAge] = useState(initialAge);
  const [categorie, setCategorie] = useState(initialCategorie);
  const [copied, setCopied] = useState(false);

  const t = i18n[lang] || i18n.fr;
  const isRtl = lang === 'ar';

  const res = calculateCarCustoms({
    prixEur,
    transportEur,
    age,
    categorie,
  });

  const pricePresets = [10000, 13500, 15000, 18000, 22000, 26000];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 overflow-hidden">
      {!hideHeader && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                <Car className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {t.customs.title}
                </h2>
                <p className="text-blue-100 text-xs mt-0.5 max-w-xl">
                  {t.customs.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t.common.copied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t.common.copyLink}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="p-6 lg:p-8 space-y-8">
        {/* Entrées utilisateur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Prix d'achat en Euros */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              {t.customs.priceEur}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1000"
                step="500"
                value={prixEur || ''}
                onChange={(e) => setPrixEur(Math.max(0, Number(e.target.value)))}
                placeholder={t.customs.priceEurPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-bold text-slate-900 bg-slate-50/50"
              />
              <span className={`absolute top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 ${isRtl ? 'left-4' : 'right-4'}`}>
                €
              </span>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {pricePresets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrixEur(p)}
                  className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors ${
                    prixEur === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {(p / 1000).toFixed(0)}k €
                </button>
              ))}
            </div>
          </div>

          {/* Âge du véhicule */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              {t.customs.vehicleAge}
            </label>
            <div className="space-y-2">
              {[
                { val: 1, label: t.customs.age1 },
                { val: 2, label: t.customs.age2 },
                { val: 3, label: t.customs.age3 },
              ].map((opt) => (
                <label
                  key={opt.val}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    age === opt.val
                      ? 'border-blue-500 bg-blue-50/70 text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicleAge"
                    value={opt.val}
                    checked={age === opt.val}
                    onChange={() => setAge(opt.val)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Catégorie moteur */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              {t.customs.engineCategory}
            </label>
            <div className="space-y-2">
              {Object.keys(CAR_CATEGORIES).map((key) => {
                const cat = CAR_CATEGORIES[key];
                const isSelected = categorie === key;
                return (
                  <label
                    key={key}
                    className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <input
                      type="radio"
                      name="engineCategory"
                      value={key}
                      checked={isSelected}
                      onChange={() => setCategorie(key)}
                      className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{isRtl ? cat.labelAr : cat.labelFr}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bloc Résultat Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white rounded-2xl border-2 border-blue-500/30 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {t.customs.totalCostDA}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Taux Square : {RATES_CONFIG.TAUX_SQUARE_EUR} DA / €
              </span>
            </div>

            <div className="my-5">
              <div className="text-sm font-semibold text-slate-600 mb-1">
                {t.customs.totalCostDA}
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-800 tracking-tight">
                {formatDA(res.prixRevientTotalDA, lang)}
              </div>
              <div className="text-base sm:text-lg font-bold text-indigo-900/80 mt-1">
                ≈ {res.prixRevientMillions} {t.common.millionsCentimes}
              </div>
            </div>

            <div className="pt-4 border-t border-blue-200/60 grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="block text-slate-400 font-medium">
                  {t.customs.squarePurchaseDA}
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {formatDA(res.coutAchatSquareDA, lang)} ({res.coutAchatSquareMillions} M)
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">
                  {t.customs.customsTaxesDA}
                </span>
                <span className="font-bold text-emerald-700 text-sm">
                  +{formatDA(res.taxesDouaneDA, lang)} ({res.taxesDouaneMillions} M)
                </span>
              </div>
            </div>
          </div>

          {/* Cartes Détail Douane */}
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-600" />
                  Décote vétusté
                </span>
                <span className="text-amber-700 font-bold">
                  -{res.tauxDecotePourcent}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Valeur résiduelle : {formatEUR(res.valeurDecoteeEur)} sur {formatEUR(res.prixEur)}.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <Ship className="w-3.5 h-3.5 text-blue-600" />
                  {t.customs.cifValueDA}
                </span>
                <span className="text-blue-800 font-bold">
                  {formatDA(res.valeurCifDA, lang)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Base calculée à {RATES_CONFIG.TAUX_BANQUE_EUR} DA/€ (valeur CIF {formatEUR(res.valeurCifEur)}).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                  Taux douane effectif
                </span>
                <span className="text-emerald-700 font-bold">
                  {res.tauxTaxesPourcent}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Abattement légal Article 110 : {res.catConfig.abattementLegale}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
