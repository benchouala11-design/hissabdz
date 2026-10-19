'use client';

import { useState } from 'react';
import {
  Coins,
  ArrowRightLeft,
  Sparkles,
  Check,
  Share2,
  TrendingUp,
  Landmark,
  MessageSquareQuote,
} from 'lucide-react';
import { calculateCurrencyExchange } from '../../lib/formulas';
import { i18n, formatDA, formatEUR, formatUSD } from '../../lib/i18n';
import { RATES_CONFIG } from '../../config/rates';

export default function CurrencyCalculator({
  initialMontant = 100,
  initialDevise = 'EUR',
  lang = 'fr',
  hideHeader = false,
}) {
  const [montant, setMontant] = useState(initialMontant);
  const [devise, setDevise] = useState(initialDevise);
  const [copied, setCopied] = useState(false);

  const t = i18n[lang] || i18n.fr;
  const isRtl = lang === 'ar';

  const res = calculateCurrencyExchange({
    montant,
    devise,
  });

  const presets = [50, 100, 200, 500, 1000, 2000, 5000];

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
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-800 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                <Coins className="w-6 h-6 text-amber-100" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {t.currency.title}
                </h2>
                <p className="text-amber-100 text-xs mt-0.5 max-w-xl">
                  {t.currency.subtitle}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Montant */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              {t.currency.amountLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="50"
                value={montant || ''}
                onChange={(e) => setMontant(Math.max(0, Number(e.target.value)))}
                placeholder="Ex: 100"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg font-bold text-slate-900 bg-slate-50/50"
              />
              <span className={`absolute top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 ${isRtl ? 'left-4' : 'right-4'}`}>
                {res.symbole}
              </span>
            </div>

            {/* Paliers rapides */}
            <div className="flex flex-wrap gap-1 pt-1">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setMontant(p)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    montant === p
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p} {res.symbole}
                </button>
              ))}
            </div>
          </div>

          {/* Choix de la Devise */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              {t.currency.currencyLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDevise('EUR')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                  devise === 'EUR'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>€ {t.currency.eur}</span>
              </button>
              <button
                type="button"
                onClick={() => setDevise('USD')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                  devise === 'USD'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>$ {t.currency.usd}</span>
              </button>
            </div>

            {/* Taux actuels */}
            <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
              <span>Square: 1 {res.symbole} = {res.tauxSquare} DA</span>
              <span>Banque: 1 {res.symbole} = {res.tauxBanque} DA</span>
            </div>
          </div>
        </div>

        {/* Bloc Résultat Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-white rounded-2xl border-2 border-amber-500/30 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {t.currency.squareValue}
              </span>
              <span className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                Marché Parallèle (Port-Saïd)
              </span>
            </div>

            <div className="my-5">
              <div className="text-sm font-semibold text-slate-600 mb-1">
                {t.currency.squareValue} ({montant} {res.symbole})
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-800 tracking-tight">
                {formatDA(res.valeurSquareDA, lang)}
              </div>
              <div className="text-base sm:text-lg font-bold text-amber-950/80 mt-1">
                ≈ {res.squareMillions} {t.common.millionsCentimes}
              </div>
            </div>

            {/* Phrase en dialecte / parlé algérien */}
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div>
                <span className="font-semibold block">{t.currency.spokenAlgerian} :</span>
                <span className="text-sm font-bold text-slate-900">
                  {isRtl ? res.populaireAr : res.populaireFr}
                </span>
              </div>
            </div>
          </div>

          {/* Cartes Écart et Banque */}
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-slate-600" />
                  {t.currency.bankValue}
                </span>
                <span className="text-slate-900 font-bold">
                  {formatDA(res.valeurBanqueDA, lang)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Cours officiel fixé par la Banque d&apos;Algérie ({res.banqueMillions} M).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-rose-600" />
                  {t.currency.gapDA}
                </span>
                <span className="text-rose-700 font-bold">
                  +{formatDA(res.ecartDA, lang)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Surcote informelle de +{res.ecartPourcent}% par rapport au cours bancaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
