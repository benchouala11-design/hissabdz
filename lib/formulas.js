import { RATES_CONFIG } from '../config/rates';

/**
 * =======================================================================
 * 1. SALAIRE NET & IRG (Barème officiel Loi de Finances Algérie)
 * =======================================================================
 * - Cotisation CNAS = 9% du Salaire de Poste (Brut)
 * - Salaire Imposable = Brut - CNAS + Primes imposables
 * - Barème IRG par tranches mensuelles :
 *     0 à 20 000 DA : 0%
 *     20 001 à 40 000 DA : 23%
 *     40 001 à 80 000 DA : 27%
 *     80 001 à 160 000 DA : 30%
 *     160 001 à 320 000 DA : 33%
 *     > 320 000 DA : 35%
 * - Abattement général : 40% sur l'IRG brut (min 1 000 DA, max 1 500 DA)
 * - Exonération totale : Imposable <= 30 000 DA => IRG = 0 DA
 * - Lissage 30 001 DA à 35 000 DA :
 *     IRG = IRG_apres_abattement_40 * (137 / 51) - (27925 / 8)
 * - Régime Sud : Réduction de 50% sur l'IRG (abattement spécifique Grand Sud)
 *   + Indemnité de zone non cotisable / non imposable.
 */
export function calculateSalary({
  brut = 50000,
  primesImposables = 0, // ex: Panier / Transport si imposables
  primesNonImposables = 0, // ex: Indemnité de zone / relève
  isSud = false,
  tauxAbattementSud = 0.5, // 50% d'abattement IRG pour le Grand Sud
}) {
  const salaireBrut = Math.max(0, Number(brut) || 0);
  const primesImp = Math.max(0, Number(primesImposables) || 0);
  const primesNonImp = Math.max(0, Number(primesNonImposables) || 0);

  // 1. CNAS (9% sur le salaire brut cotisable)
  const cnas = Math.round(salaireBrut * 0.09 * 100) / 100;

  // 2. Salaire Imposable
  const salaireImposable = Math.max(0, salaireBrut - cnas + primesImp);

  // 3. Calcul de l'IRG brut selon le barème par tranches
  let irgBrut = 0;
  if (salaireImposable > 20000) {
    if (salaireImposable <= 40000) {
      irgBrut = (salaireImposable - 20000) * 0.23;
    } else if (salaireImposable <= 80000) {
      irgBrut = 20000 * 0.23 + (salaireImposable - 40000) * 0.27;
    } else if (salaireImposable <= 160000) {
      irgBrut = 20000 * 0.23 + 40000 * 0.27 + (salaireImposable - 80000) * 0.30;
    } else if (salaireImposable <= 320000) {
      irgBrut =
        20000 * 0.23 +
        40000 * 0.27 +
        80000 * 0.30 +
        (salaireImposable - 160000) * 0.33;
    } else {
      irgBrut =
        20000 * 0.23 +
        40000 * 0.27 +
        80000 * 0.30 +
        160000 * 0.33 +
        (salaireImposable - 320000) * 0.35;
    }
  }

  // 4. Application des abattements
  let irgFinal = 0;
  let abattementGeneral = 0;

  if (salaireImposable <= 30000) {
    // Exonération totale pour les salaires imposables <= 30 000 DA
    irgFinal = 0;
  } else {
    // Abattement standard de 40% (plafonné entre 1 000 DA et 1 500 DA)
    abattementGeneral = irgBrut * 0.40;
    if (abattementGeneral < 1000) abattementGeneral = 1000;
    if (abattementGeneral > 1500) abattementGeneral = 1500;

    const irgApresAbattement = Math.max(0, irgBrut - abattementGeneral);

    if (salaireImposable <= 35000) {
      // Formule de lissage pour la tranche 30 001 à 35 000 DA
      const irgLisse = irgApresAbattement * (137 / 51) - 27925 / 8;
      irgFinal = Math.max(0, irgLisse);
    } else {
      irgFinal = irgApresAbattement;
    }
  }

  // 5. Régime Sud (Grand Sud / Adrar / Illizi / In Salah / Tamanrasset / etc.)
  let reductionSud = 0;
  if (isSud && irgFinal > 0) {
    reductionSud = irgFinal * tauxAbattementSud;
    irgFinal = irgFinal - reductionSud;
  }

  // Arrondis finaux au Dinar
  irgFinal = Math.round(irgFinal);
  const salaireNet = Math.round(salaireImposable - irgFinal + primesNonImp);

  // Équivalents en Millions de centimes (10 000 DA = 1 Million de centimes)
  const brutMillions = (salaireBrut / 10000).toFixed(2);
  const netMillions = (salaireNet / 10000).toFixed(2);
  const cnasMillions = (cnas / 10000).toFixed(2);
  const irgMillions = (irgFinal / 10000).toFixed(2);

  return {
    salaireBrut,
    primesImposables: primesImp,
    primesNonImposables: primesNonImp,
    cnas,
    salaireImposable,
    irgBrut: Math.round(irgBrut),
    abattementGeneral: Math.round(abattementGeneral),
    reductionSud: Math.round(reductionSud),
    irgFinal,
    salaireNet,
    brutMillions,
    netMillions,
    cnasMillions,
    irgMillions,
    isSud,
    tauxPrelevement: salaireBrut > 0 ? ((cnas + irgFinal) / salaireBrut * 100).toFixed(1) : '0.0',
  };
}

/**
 * =======================================================================
 * 2. DOUANE VOITURES MOINS DE 3 ANS (Article 110)
 * =======================================================================
 * - Entrées : prixEur, transportForfaitEur, age (1, 2 ou 3 ans), categorie
 * - Décote douanière : 1 an (-10%), 2 ans (-20%), 3 ans (-30%)
 * - Valeur CIF DA = ((prixEur * (1 - decote)) + transport) * TAUX_BANQUE_EUR
 * - Taux global douanier :
 *     - electrique_ou_petit_essence (<= 1200 cm³) : 28.5%
 *     - moyenne_cylindree (1201 à 1800 cm³) : 39.2%
 *     - grosse_cylindree (> 1800 cm³) : 80.0%
 * - Coût achat au Square DA = (prixEur + transport) * TAUX_SQUARE_EUR
 * - Prix de revient total DA = Cout_Achat_Square_DA + Taxes_Douane_DA
 */
export const CAR_CATEGORIES = {
  electrique_ou_petit_essence: {
    id: 'electrique_ou_petit_essence',
    labelFr: 'Électrique ou Essence ≤ 1200 cm³ (-80% abattement)',
    labelAr: 'كهربائية أو بنزين ≤ 1200 سم³ (تخفيض 80%)',
    tauxDouane: 0.285,
    abattementLegale: '80%',
  },
  moyenne_cylindree: {
    id: 'moyenne_cylindree',
    labelFr: 'Essence / Hybride 1201 à 1800 cm³ (-50% abattement)',
    labelAr: 'بنزين / هجين 1201 إلى 1800 سم³ (تخفيض 50%)',
    tauxDouane: 0.392,
    abattementLegale: '50%',
  },
  grosse_cylindree: {
    id: 'grosse_cylindree',
    labelFr: 'Essence / Hybride > 1800 cm³ (-20% abattement + TIC)',
    labelAr: 'بنزين / هجين > 1800 سم³ (تخفيض 20% + رسم الاستهلاك)',
    tauxDouane: 0.80,
    abattementLegale: '20%',
  },
};

export function calculateCarCustoms({
  prixEur = 15000,
  transportEur = RATES_CONFIG.TRANSPORT_FORFAIT_EUR,
  age = 2, // 1, 2 ou 3 ans
  categorie = 'electrique_ou_petit_essence',
  tauxBanque = RATES_CONFIG.TAUX_BANQUE_EUR,
  tauxSquare = RATES_CONFIG.TAUX_SQUARE_EUR,
}) {
  const prix = Math.max(0, Number(prixEur) || 0);
  const transport = Math.max(0, Number(transportEur) || 0);
  const annees = Math.min(3, Math.max(1, Number(age) || 1));

  // Décote selon l'âge
  let tauxDecote = 0.10;
  if (annees === 2) tauxDecote = 0.20;
  if (annees === 3) tauxDecote = 0.30;

  const montantDecoteEur = prix * tauxDecote;
  const valeurDecoteeEur = prix - montantDecoteEur;
  const valeurCifEur = valeurDecoteeEur + transport;

  // Conversion en DA au taux officiel de la Banque d'Algérie
  const valeurCifDA = Math.round(valeurCifEur * tauxBanque);

  // Taux de taxes selon la catégorie moteur
  const catConfig = CAR_CATEGORIES[categorie] || CAR_CATEGORIES.electrique_ou_petit_essence;
  const tauxTaxes = catConfig.tauxDouane;
  const taxesDouaneDA = Math.round(valeurCifDA * tauxTaxes);

  // Coût d'achat réel en devises changées au Square
  const totalDevisesEur = prix + transport;
  const coutAchatSquareDA = Math.round(totalDevisesEur * tauxSquare);

  // Prix de revient total pour le citoyen algérien
  const prixRevientTotalDA = coutAchatSquareDA + taxesDouaneDA;

  // Conversions en Millions de centimes
  const prixRevientMillions = (prixRevientTotalDA / 10000).toFixed(1);
  const taxesDouaneMillions = (taxesDouaneDA / 10000).toFixed(1);
  const coutAchatSquareMillions = (coutAchatSquareDA / 10000).toFixed(1);

  return {
    prixEur: prix,
    transportEur: transport,
    age: annees,
    tauxDecote,
    tauxDecotePourcent: Math.round(tauxDecote * 100),
    valeurDecoteeEur: Math.round(valeurDecoteeEur),
    valeurCifEur: Math.round(valeurCifEur),
    valeurCifDA,
    categorie,
    catConfig,
    tauxTaxesPourcent: (tauxTaxes * 100).toFixed(1),
    taxesDouaneDA,
    coutAchatSquareDA,
    prixRevientTotalDA,
    prixRevientMillions,
    taxesDouaneMillions,
    coutAchatSquareMillions,
    tauxBanque,
    tauxSquare,
  };
}

/**
 * =======================================================================
 * 3. FRAIS DE NOTAIRE & ACTE DE VENTE IMMOBILIER EN ALGÉRIE
 * =======================================================================
 * - Droits d'enregistrement (Impôts) : 2.5% (part acheteur ; total acte 5%)
 * - Conservation foncière (Publicité foncière) : 1%
 * - Honoraires du Notaire (Barème dégressif légal) :
 *     De 1 à 500 000 DA : 3%
 *     De 500 001 à 1 000 000 DA : 2%
 *     Au-delà de 1 000 000 DA : 1%
 * - TVA sur honoraires de notaire : 19%
 * - Frais de timbres & dossier administratif : forfait 15 000 DA
 */
export function calculateNotaryFees({
  prixBienDA = 10000000, // 10 millions DA = 1 000 millions de centimes (1 milliard cts)
  tauxEnregistrement = 0.025, // 2.5% acquéreur
  tauxConservation = 0.01, // 1% conservation foncière
  fraisDossierDA = RATES_CONFIG.NOTAIRE_FRAIS_DOSSIER_DA,
}) {
  const montant = Math.max(0, Number(prixBienDA) || 0);

  // 1. Droits d'enregistrement
  const enregistrementDA = Math.round(montant * tauxEnregistrement);

  // 2. Conservation foncière (publicité foncière)
  const conservationDA = Math.round(montant * tauxConservation);

  // 3. Honoraires du Notaire (barème progressif dégressif)
  let honorairesHT = 0;
  if (montant > 0) {
    if (montant <= 500000) {
      honorairesHT = montant * 0.03;
    } else if (montant <= 1000000) {
      honorairesHT = 500000 * 0.03 + (montant - 500000) * 0.02;
    } else {
      honorairesHT =
        500000 * 0.03 + 500000 * 0.02 + (montant - 1000000) * 0.01;
    }
  }
  honorairesHT = Math.round(honorairesHT);

  // TVA sur honoraires de notaire (19%)
  const tvaHonorairesDA = Math.round(honorairesHT * 0.19);
  const honorairesTTC = honorairesHT + tvaHonorairesDA;

  // 4. Frais fixes
  const dossierDA = fraisDossierDA;

  // 5. Total des frais acquéreur
  const totalFraisDA =
    enregistrementDA + conservationDA + honorairesTTC + dossierDA;

  // 6. Coût global de l'acquisition
  const coutTotalAcquisitionDA = montant + totalFraisDA;

  // Millions de centimes (10 000 DA = 1 Million de centimes)
  const montantMillions = (montant / 10000).toFixed(1);
  const totalFraisMillions = (totalFraisDA / 10000).toFixed(2);
  const coutTotalAcquisitionMillions = (coutTotalAcquisitionDA / 10000).toFixed(1);
  const honorairesMillions = (honorairesTTC / 10000).toFixed(2);
  const enregistrementMillions = (enregistrementDA / 10000).toFixed(2);
  const conservationMillions = (conservationDA / 10000).toFixed(2);

  // Pourcentage total des frais
  const pourcentageFrais = montant > 0 ? ((totalFraisDA / montant) * 100).toFixed(2) : '0.00';

  return {
    prixBienDA: montant,
    enregistrementDA,
    conservationDA,
    honorairesHT,
    tvaHonorairesDA,
    honorairesTTC,
    dossierDA,
    totalFraisDA,
    coutTotalAcquisitionDA,
    pourcentageFrais,
    // En millions de centimes
    montantMillions,
    totalFraisMillions,
    coutTotalAcquisitionMillions,
    honorairesMillions,
    enregistrementMillions,
    conservationMillions,
  };
}

/**
 * =======================================================================
 * 4. CONVERTISSEUR DEVISES (Square vs Banque d'Algérie)
 * =======================================================================
 * Pour un montant en EUR ou USD :
 * - Valeur Banque d'Algérie (taux officiel)
 * - Valeur Square Port-Saïd (taux parallèle)
 * - Écart en DA et en %
 * - Traduction en langage parlé algérien : Millions et Milliers de centimes
 */
export function calculateCurrencyExchange({
  montant = 100,
  devise = 'EUR',
  tauxBanque = null,
  tauxSquare = null,
}) {
  const montantDevise = Math.max(0, Number(montant) || 0);
  const isUSD = devise.toUpperCase() === 'USD';

  const tBanque =
    tauxBanque ||
    (isUSD ? RATES_CONFIG.TAUX_BANQUE_USD : RATES_CONFIG.TAUX_BANQUE_EUR);
  const tSquare =
    tauxSquare ||
    (isUSD ? RATES_CONFIG.TAUX_SQUARE_USD : RATES_CONFIG.TAUX_SQUARE_EUR);

  const valeurBanqueDA = Math.round(montantDevise * tBanque);
  const valeurSquareDA = Math.round(montantDevise * tSquare);
  const ecartDA = valeurSquareDA - valeurBanqueDA;
  const ecartPourcent =
    valeurBanqueDA > 0
      ? (((valeurSquareDA - valeurBanqueDA) / valeurBanqueDA) * 100).toFixed(1)
      : '0.0';

  // Millions de centimes (10 000 DA = 1 Million de centimes)
  const squareMillions = (valeurSquareDA / 10000).toFixed(2);
  const banqueMillions = (valeurBanqueDA / 10000).toFixed(2);
  const ecartMillions = (ecartDA / 10000).toFixed(2);

  // Traduction parlée populaire (ex: "2 Millions et 550 Mille centimes")
  const squareCentimesTotal = Math.round(valeurSquareDA * 100);
  const millionsCentimesPart = Math.floor(squareCentimesTotal / 1000000);
  const milliersCentimesPart = Math.floor((squareCentimesTotal % 1000000) / 1000);

  return {
    montant: montantDevise,
    devise: isUSD ? 'USD' : 'EUR',
    symbole: isUSD ? '$' : '€',
    tauxBanque: tBanque,
    tauxSquare: tSquare,
    valeurBanqueDA,
    valeurSquareDA,
    ecartDA,
    ecartPourcent,
    squareMillions,
    banqueMillions,
    ecartMillions,
    populaireFr: `${millionsCentimesPart > 0 ? `${millionsCentimesPart} Million${millionsCentimesPart > 1 ? 's' : ''}` : ''} ${milliersCentimesPart > 0 ? `${milliersCentimesPart} Mille centimes` : ''}`.trim() || '0 centimes',
    populaireAr: `${millionsCentimesPart > 0 ? `${millionsCentimesPart} مليون` : ''} ${milliersCentimesPart > 0 ? `و ${milliersCentimesPart} ألف سنتيم` : ''}`.trim() || '0 سنتيم',
  };
}
