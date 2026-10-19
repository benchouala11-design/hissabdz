'use client';

import { useState } from 'react';
import {
  Home,
  FileText,
  Landmark,
  BadgeDollarSign,
  Sparkles,
  Check,
  Share2,
} from 'lucide-react';
import { calculateNotaryFees } from '../../lib/formulas';
import { i18n, formatDA, formatMillionsCentimes } from '../../lib/i18n';

export default function NotaryCalculator({
  initialPrixDA = 10000000,
  lang = 'fr',
  hideHeader = false,
}) {
  // Mode de saisie : 'da' ou 'centimes' (Millions de centimes)
  const [inputMode, setInputMode] = useState('centimes');
  const [valeur, setValeur] = useState(initialPrixDA / 10000); // en Millions de centimes par défaut
  const [copied, setCopied] = useState(false);

  const t = i18n[lang] || i18n.fr;
  const isRtl = lang === 'ar';

  const prixDA = inputMode === 'centimes' ? valeur * 10000 : valeur;

  const res = calculateNotaryFees({
    prixBienDA: prixDA,
  });

  const presetsCentimes = [500, 1000, 1500, 2000, 3000, 5000];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleModeSwitch = (mode) => {
    if (mode === inputMode) return;
    if (mode === 'da') {
      setValeur(valeur * 10000);
    } else {
      setValeur(Math.round(valeur / 10000));
    }
    setInputMode(mode);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 overflow-hidden">
      {!hideHeader && (
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                <Home className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {t.notary.title}
                </h2>
                <p className="text-emerald-100 text-xs mt-0.5 max-w-xl">
                  {t.notary.subtitle}
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
        {/* Entrée utilisateur */}
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-800">
              {t.notary.priceDA}
            </label>
            {/* Bascule mode de saisie */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleModeSwitch('centimes')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  inputMode === 'centimes'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.common.millionsCentimes}
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('da')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  inputMode === 'da'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.common.da}
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="number"
              min="0"
              step={inputMode === 'centimes' ? '50' : '500000'}
              value={valeur || ''}
              onChange={(e) => setValeur(Math.max(0, Number(e.target.value)))}
              placeholder={t.notary.pricePlaceholder}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xl font-bold text-slate-900 bg-slate-50/50"
            />
            <span className={`absolute top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 ${isRtl ? 'left-4' : 'right-4'}`}>
              {inputMode === 'centimes' ? t.common.millionsCentimes : t.common.da}
            </span>
          </div>

          {/* Paliers rapides en Millions de centimes */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {presetsCentimes.map((cts) => (
              <button
                key={cts}
                type="button"
                onClick={() => {
                  if (inputMode === 'centimes') {
                    setValeur(cts);
                  } else {
                    setValeur(cts * 10000);
                  }
                }}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                {cts >= 1000 ? `${(cts / 1000).toFixed(cts % 1000 !== 0 ? 1 : 0)} Milliard` : `${cts} M`}
              </button>
            ))}
          </div>
        </div>

        {/* Bloc Résultat Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-2xl border-2 border-emerald-500/30 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {t.notary.buyerFees}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Part totale : {res.pourcentageFrais}% du bien
              </span>
            </div>

            <div className="my-5">
              <div className="text-sm font-semibold text-slate-600 mb-1">
                {t.notary.buyerFees}
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-700 tracking-tight">
                {formatDA(res.totalFraisDA, lang)}
              </div>
              <div className="text-base sm:text-lg font-bold text-emerald-900/80 mt-1">
                ≈ {formatMillionsCentimes(res.totalFraisDA, lang)}
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-200/60 grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="block text-slate-400 font-medium">
                  {t.notary.priceDA}
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {formatDA(res.prixBienDA, lang)} ({res.montantMillions} M)
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">
                  {t.notary.totalAcquisitionCost}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatDA(res.coutTotalAcquisitionDA, lang)} ({res.coutTotalAcquisitionMillions} M)
                </span>
              </div>
            </div>
          </div>

          {/* Cartes Détail */}
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                  Enregistrement (2.5%)
                </span>
                <span className="text-emerald-800 font-bold">
                  {formatDA(res.enregistrementDA, lang)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Droits versés au Trésor public (Direction des Impôts).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Conservation (1.0%)
                </span>
                <span className="text-blue-800 font-bold">
                  {formatDA(res.conservationDA, lang)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Publicité foncière et formalités du livret foncier.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <BadgeDollarSign className="w-3.5 h-3.5 text-indigo-600" />
                  Honoraires Notaire (TTC)
                </span>
                <span className="text-indigo-800 font-bold">
                  {formatDA(res.honorairesTTC, lang)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Barème dégressif légal + 19% TVA + {formatDA(res.dossierDA, lang)} timbres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
