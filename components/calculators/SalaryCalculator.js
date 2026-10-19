'use client';

import { useState } from 'react';
import {
  Calculator,
  Shield,
  FileSpreadsheet,
  Check,
  Share2,
  Sparkles,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { calculateSalary } from '../../lib/formulas';
import { i18n, formatDA, formatMillionsCentimes } from '../../lib/i18n';

export default function SalaryCalculator({
  initialBrut = 75000,
  lang = 'fr',
  hideHeader = false,
}) {
  const [brut, setBrut] = useState(initialBrut);
  const [primesImp, setPrimesImp] = useState(0);
  const [primesNonImp, setPrimesNonImp] = useState(0);
  const [isSud, setIsSud] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = i18n[lang] || i18n.fr;
  const isRtl = lang === 'ar';

  const res = calculateSalary({
    brut,
    primesImposables: primesImp,
    primesNonImposables: primesNonImp,
    isSud,
  });

  const presets = [35000, 50000, 75000, 100000, 150000, 200000];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 overflow-hidden">
      {/* En-tête du calculateur */}
      {!hideHeader && (
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                <Calculator className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {t.salary.title}
                </h2>
                <p className="text-emerald-100 text-xs mt-0.5 max-w-xl">
                  {t.salary.subtitle}
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
          {/* Champ Salaire Brut */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              {t.salary.inputBrut}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1000"
                value={brut || ''}
                onChange={(e) => setBrut(Math.max(0, Number(e.target.value)))}
                placeholder={t.salary.inputBrutPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-bold text-slate-900 bg-slate-50/50"
              />
              <span className={`absolute top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 ${isRtl ? 'left-4' : 'right-4'}`}>
                {t.common.da}
              </span>
            </div>

            {/* Paliers rapides */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setBrut(p)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    brut === p
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {(p / 1000).toFixed(0)}k {t.common.da}
                </button>
              ))}
            </div>
          </div>

          {/* Primes imposables & Régime Sud */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.salary.primesImposables}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={primesImp || ''}
                  onChange={(e) => setPrimesImp(Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-900 bg-slate-50/50"
                />
                <span className={`absolute top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 ${isRtl ? 'left-4' : 'right-4'}`}>
                  {t.common.da}
                </span>
              </div>
            </div>

            {/* Toggle Régime Sud */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 cursor-pointer select-none transition-colors hover:bg-amber-50">
              <input
                type="checkbox"
                checked={isSud}
                onChange={(e) => setIsSud(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.salary.isSudLabel}</span>
                </div>
                <p className="text-[11px] text-amber-700/90 mt-0.5">
                  {t.salary.sudTooltip}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Résultat Principal & Carte Vedette */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl border-2 border-emerald-500/30 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {t.common.result}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {isSud ? t.salary.regimeSud : t.salary.regimeNord}
              </span>
            </div>

            <div className="my-5">
              <div className="text-sm font-semibold text-slate-600 mb-1">
                {t.salary.netToPay}
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-700 tracking-tight">
                {formatDA(res.salaireNet, lang)}
              </div>
              <div className="text-sm sm:text-base font-semibold text-emerald-900/80 mt-1">
                ≈ {formatMillionsCentimes(res.salaireNet, lang)}
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-200/60 grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="block text-slate-400 font-medium">
                  {t.salary.grossSalary}
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {formatDA(res.salaireBrut, lang)}
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">
                  {t.salary.totalDeductions}
                </span>
                <span className="font-bold text-rose-600 text-sm">
                  -{formatDA(res.cnas + res.irgFinal, lang)} ({res.tauxPrelevement}%)
                </span>
              </div>
            </div>
          </div>

          {/* Cartes Détail Retenues */}
          <div className="space-y-3">
            {/* CNAS */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  CNAS (9%)
                </span>
                <span className="text-blue-700 font-bold">
                  {formatDA(res.cnas, lang)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Cotisation de sécurité sociale obligatoire.
              </p>
            </div>

            {/* Salaire Imposable */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
                  {t.salary.taxableSalary}
                </span>
                <span className="text-slate-800 font-bold">
                  {formatDA(res.salaireImposable, lang)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Assiette soumise au barème progressif de l&apos;IRG.
              </p>
            </div>

            {/* IRG */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                  IRG (Impôt)
                </span>
                <span className="text-rose-700 font-bold">
                  {formatDA(res.irgFinal, lang)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {res.salaireImposable <= 30000
                  ? 'Exonération totale (Imposable ≤ 30 000 DA).'
                  : isSud
                  ? 'Abattement général 40% + réduction Sud 50%.'
                  : 'Barème officiel après abattement 40%.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
