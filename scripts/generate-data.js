const fs = require('fs');
const path = require('path');

// Taux de référence
const RATES = {
  TAUX_BANQUE_EUR: 154.0,
  TAUX_SQUARE_EUR: 255.0,
  TAUX_BANQUE_USD: 139.0,
  TAUX_SQUARE_USD: 235.0,
  TRANSPORT_EUR: 700,
  NOTAIRE_FRAIS_DOSSIER_DA: 15000,
};

// Formules de calcul
function calculateSalary(brut, isSud = false, primesImposables = 0, primesNonImposables = 0) {
  const salaireBrut = Number(brut) || 0;
  const cnas = Math.round(salaireBrut * 0.09 * 100) / 100;
  const salaireImposable = Math.max(0, salaireBrut - cnas + primesImposables);

  let irgBrut = 0;
  if (salaireImposable > 20000) {
    if (salaireImposable <= 40000) {
      irgBrut = (salaireImposable - 20000) * 0.23;
    } else if (salaireImposable <= 80000) {
      irgBrut = 20000 * 0.23 + (salaireImposable - 40000) * 0.27;
    } else if (salaireImposable <= 160000) {
      irgBrut = 20000 * 0.23 + 40000 * 0.27 + (salaireImposable - 80000) * 0.30;
    } else if (salaireImposable <= 320000) {
      irgBrut = 20000 * 0.23 + 40000 * 0.27 + 80000 * 0.30 + (salaireImposable - 160000) * 0.33;
    } else {
      irgBrut = 20000 * 0.23 + 40000 * 0.27 + 80000 * 0.30 + 160000 * 0.33 + (salaireImposable - 320000) * 0.35;
    }
  }

  let irgFinal = 0;
  let abattement = 0;
  if (salaireImposable <= 30000) {
    irgFinal = 0;
  } else {
    abattement = irgBrut * 0.40;
    if (abattement < 1000) abattement = 1000;
    if (abattement > 1500) abattement = 1500;
    const irgApres = Math.max(0, irgBrut - abattement);

    if (salaireImposable <= 35000) {
      irgFinal = Math.max(0, irgApres * (137 / 51) - (27925 / 8));
    } else {
      irgFinal = irgApres;
    }
  }

  let reductionSud = 0;
  if (isSud && irgFinal > 0) {
    reductionSud = irgFinal * 0.50;
    irgFinal = irgFinal - reductionSud;
  }

  irgFinal = Math.round(irgFinal);
  const net = Math.round(salaireImposable - irgFinal + primesNonImposables);

  return {
    brut: salaireBrut,
    cnas,
    salaireImposable,
    irgBrut: Math.round(irgBrut),
    irgFinal,
    net,
    netMillions: (net / 10000).toFixed(2),
    brutMillions: (salaireBrut / 10000).toFixed(2),
    cnasMillions: (cnas / 10000).toFixed(2),
    irgMillions: (irgFinal / 10000).toFixed(2),
  };
}

function calculateCar(prixEur, age = 2, categorie = 'electrique_ou_petit_essence') {
  const decote = age === 1 ? 0.10 : (age === 2 ? 0.20 : 0.30);
  const valeurCifEur = (prixEur * (1 - decote)) + RATES.TRANSPORT_EUR;
  const valeurCifDA = Math.round(valeurCifEur * RATES.TAUX_BANQUE_EUR);

  let tauxDouane = 0.285;
  if (categorie === 'moyenne_cylindree') tauxDouane = 0.392;
  if (categorie === 'grosse_cylindree') tauxDouane = 0.80;

  const taxesDouaneDA = Math.round(valeurCifDA * tauxDouane);
  const coutSquareDA = Math.round((prixEur + RATES.TRANSPORT_EUR) * RATES.TAUX_SQUARE_EUR);
  const prixRevientTotalDA = coutSquareDA + taxesDouaneDA;

  return {
    prixEur,
    age,
    tauxDecote: decote * 100,
    valeurCifEur: Math.round(valeurCifEur),
    valeurCifDA,
    taxesDouaneDA,
    coutSquareDA,
    prixRevientTotalDA,
    prixRevientMillions: (prixRevientTotalDA / 10000).toFixed(1),
    taxesDouaneMillions: (taxesDouaneDA / 10000).toFixed(1),
    coutSquareMillions: (coutSquareDA / 10000).toFixed(1),
  };
}

function calculateNotary(montantDA) {
  const montant = Number(montantDA) || 0;
  const enregistrementDA = Math.round(montant * 0.025);
  const conservationDA = Math.round(montant * 0.01);

  let honorairesHT = 0;
  if (montant <= 500000) {
    honorairesHT = montant * 0.03;
  } else if (montant <= 1000000) {
    honorairesHT = 500000 * 0.03 + (montant - 500000) * 0.02;
  } else {
    honorairesHT = 500000 * 0.03 + 500000 * 0.02 + (montant - 1000000) * 0.01;
  }
  honorairesHT = Math.round(honorairesHT);
  const tvaHonorairesDA = Math.round(honorairesHT * 0.19);
  const honorairesTTC = honorairesHT + tvaHonorairesDA;
  const dossierDA = RATES.NOTAIRE_FRAIS_DOSSIER_DA;

  const totalFraisDA = enregistrementDA + conservationDA + honorairesTTC + dossierDA;
  const coutTotalDA = montant + totalFraisDA;

  return {
    montantDA: montant,
    montantMillions: (montant / 10000).toFixed(1),
    enregistrementDA,
    conservationDA,
    honorairesTTC,
    dossierDA,
    totalFraisDA,
    coutTotalDA,
    totalFraisMillions: (totalFraisDA / 10000).toFixed(2),
    coutTotalMillions: (coutTotalDA / 10000).toFixed(1),
    pourcentageFrais: montant > 0 ? ((totalFraisDA / montant) * 100).toFixed(2) : '0.00',
  };
}

function calculateCurrency(montant, devise = 'EUR') {
  const isUSD = devise === 'USD';
  const tBanque = isUSD ? RATES.TAUX_BANQUE_USD : RATES.TAUX_BANQUE_EUR;
  const tSquare = isUSD ? RATES.TAUX_SQUARE_USD : RATES.TAUX_SQUARE_EUR;

  const banqueDA = Math.round(montant * tBanque);
  const squareDA = Math.round(montant * tSquare);
  const ecartDA = squareDA - banqueDA;

  const centimes = Math.round(squareDA * 100);
  const millionsCts = Math.floor(centimes / 1000000);
  const milliersCts = Math.floor((centimes % 1000000) / 1000);

  return {
    montant,
    devise,
    symbole: isUSD ? '$' : '€',
    banqueDA,
    squareDA,
    ecartDA,
    squareMillions: (squareDA / 10000).toFixed(2),
    banqueMillions: (banqueDA / 10000).toFixed(2),
    populaireFr: `${millionsCts > 0 ? `${millionsCts} Million${millionsCts > 1 ? 's' : ''}` : ''} ${milliersCts > 0 ? `${milliersCts} Mille centimes` : ''}`.trim() || '0 centimes',
    populaireAr: `${millionsCts > 0 ? `${millionsCts} مليون` : ''} ${milliersCts > 0 ? `و ${milliersCts} ألف سنتيم` : ''}`.trim() || '0 سنتيم',
  };
}

// Assurer l'existence du dossier data/
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// ==========================================
// 1. DATA SALAIRES
// ==========================================
const salaryAmounts = [
  25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000,
  75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000,
  150000, 160000, 180000, 200000, 220000, 250000,
];

// 10 paliers prioritaires pour AdSense
const prioritySalaries = [30000, 45000, 50000, 60000, 75000, 80000, 100000, 120000, 150000, 200000];

const salairesData = salaryAmounts.map((amount) => {
  const norm = calculateSalary(amount, false);
  const sud = calculateSalary(amount, true);
  const withPrimes = calculateSalary(amount, false, 10000);
  const isPriority = prioritySalaries.includes(amount);

  const formattedDA = amount.toLocaleString('fr-FR');
  const slug = `${amount}-da`;

  return {
    slug,
    brut: amount,
    isAdsensePriority: isPriority,
    titleFr: `Salaire Net pour ${formattedDA} DA Brut en Algérie (Calcul IRG & CNAS 2024)`,
    titleAr: `الراتب الصافي لمبلغ ${formattedDA} دج خام في الجزائر (حساب الضريبة والضمان الاجتماعي)`,
    descriptionFr: `Découvrez le salaire net exact pour un salaire brut de ${formattedDA} DA en Algérie : déduction CNAS (9%), impôt IRG barème 2024, comparaison Régime Nord vs Régime Sud.`,
    descriptionAr: `اكتشف الراتب الصافي الدقيق لراتب خام قدره ${formattedDA} دج في الجزائر: خصم الضمان الاجتماعي (9%)، ضريبة الدخل IRG، ومقارنة نظام الشمال ونظام الجنوب.`,
    calc: norm,
    calcSud: sud,
    calcPrimes: withPrimes,
    comparatif: [
      {
        regimeFr: 'Régime Nord (Standard)',
        regimeAr: 'نظام الشمال (العادي)',
        brutDA: amount,
        cnasDA: norm.cnas,
        irgDA: norm.irgFinal,
        netDA: norm.net,
        netMillions: norm.netMillions,
      },
      {
        regimeFr: 'Régime Grand Sud (-50% IRG)',
        regimeAr: 'نظام الجنوب الكبير (تخفيض 50% من الضريبة)',
        brutDA: amount,
        cnasDA: sud.cnas,
        irgDA: sud.irgFinal,
        netDA: sud.net,
        netMillions: sud.netMillions,
      },
      {
        regimeFr: 'Avec Primes Imposables (+10 000 DA)',
        regimeAr: 'مع علاوات خاضعة (+10 000 دج)',
        brutDA: amount + 10000,
        cnasDA: withPrimes.cnas,
        irgDA: withPrimes.irgFinal,
        netDA: withPrimes.net,
        netMillions: withPrimes.netMillions,
      },
    ],
    faqFr: [
      {
        q: `Quel est le salaire net pour un salaire brut de ${formattedDA} DA en Algérie ?`,
        a: `Pour un salaire brut de ${formattedDA} DA, le salaire net à percevoir est de ${norm.net.toLocaleString('fr-FR')} DA (soit environ ${norm.netMillions} Millions de centimes) après déduction de ${norm.cnas.toLocaleString('fr-FR')} DA pour la CNAS (9%) et ${norm.irgFinal.toLocaleString('fr-FR')} DA d'IRG.`,
      },
      {
        q: `Combien paye-t-on d'impôt IRG sur un salaire de ${formattedDA} DA ?`,
        a: `Le montant prélevé au titre de l'Impôt sur le Revenu Global (IRG) pour ${formattedDA} DA de salaire brut est de ${norm.irgFinal.toLocaleString('fr-FR')} DA dans le Régime Nord, et de seulement ${sud.irgFinal.toLocaleString('fr-FR')} DA dans le cadre du Régime Grand Sud grâce à l'abattement territorial de 50%.`,
      },
      {
        q: `Combien représente ce salaire en Millions de centimes ?`,
        a: `Un salaire brut de ${formattedDA} DA correspond à ${(amount / 10000).toFixed(2)} Millions de centimes. Après l'ensemble des prélèvements sociaux et fiscaux, vous encaissez un montant net de ${norm.netMillions} Millions de centimes.`,
      },
    ],
    faqAr: [
      {
        q: `كم يبلغ الراتب الصافي لراتب خام قدره ${formattedDA} دج في الجزائر؟`,
        a: `لراتب خام قدره ${formattedDA} دج، يبلغ الراتب الصافي المقبوض ${norm.net.toLocaleString('fr-FR')} دج (أي ما يعادل حوالي ${norm.netMillions} مليون سنتيم)، بعد خصم ${norm.cnas.toLocaleString('fr-FR')} دج للضمان الاجتماعي و${norm.irgFinal.toLocaleString('fr-FR')} دج كضريبة على الدخل الإجمالي.`,
      },
      {
        q: `كم يبلغ اقتطاع ضريبة IRG لمبلغ ${formattedDA} دج؟`,
        a: `قيمة الضريبة المقتطعة على الدخل الإجمالي (IRG) لراتب ${formattedDA} دج خام هي ${norm.irgFinal.toLocaleString('fr-FR')} دج في ولايات الشمال، وتنخفض إلى ${sud.irgFinal.toLocaleString('fr-FR')} دج في ولايات الجنوب الكبير بفضل التخفيض القانوني المقدر بـ 50%.`,
      },
      {
        q: `كم يساوي هذا الراتب بملايين السنتيم الجزائري؟`,
        a: `الراتب الخام البالغ ${formattedDA} دج يساوي ${(amount / 10000).toFixed(2)} مليون سنتيم، ويصبح الراتب الصافي للقبض بعد كل الاقتطاعات ${norm.netMillions} مليون سنتيم.`,
      },
    ],
  };
});

fs.writeFileSync(path.join(dataDir, 'salaires.json'), JSON.stringify(salairesData, null, 2), 'utf-8');
console.log(`[✓] data/salaires.json généré (${salairesData.length} paliers)`);

// ==========================================
// 2. DATA VOITURES (30 MODÈLES POPULAIRES)
// ==========================================
const carCatalog = [
  { slug: 'renault-clio-5', marque: 'Renault', modele: 'Clio 5 1.0 TCe', cylindree: 999, categorie: 'electrique_ou_petit_essence', prix2024: 14500, prix2025: 15500, prix2026: 16500 },
  { slug: 'peugeot-208', marque: 'Peugeot', modele: '208 1.2 PureTech', cylindree: 1199, categorie: 'electrique_ou_petit_essence', prix2024: 14800, prix2025: 15800, prix2026: 16900 },
  { slug: 'dacia-sandero-stepway', marque: 'Dacia', modele: 'Sandero Stepway 1.0 TCe', cylindree: 999, categorie: 'electrique_ou_petit_essence', prix2024: 13900, prix2025: 14800, prix2026: 15800 },
  { slug: 'dacia-duster', marque: 'Dacia', modele: 'Duster 1.3 TCe', cylindree: 1332, categorie: 'moyenne_cylindree', prix2024: 17200, prix2025: 18500, prix2026: 19800 },
  { slug: 'volkswagen-golf-8', marque: 'Volkswagen', modele: 'Golf 8 1.5 eTSI', cylindree: 1498, categorie: 'moyenne_cylindree', prix2024: 22500, prix2025: 24000, prix2026: 25500 },
  { slug: 'volkswagen-polo', marque: 'Volkswagen', modele: 'Polo 1.0 TSI', cylindree: 999, categorie: 'electrique_ou_petit_essence', prix2024: 15800, prix2025: 16900, prix2026: 18000 },
  { slug: 'seat-ibiza', marque: 'Seat', modele: 'Ibiza 1.0 TSI', cylindree: 999, categorie: 'electrique_ou_petit_essence', prix2024: 14900, prix2025: 15900, prix2026: 17100 },
  { slug: 'skoda-fabia', marque: 'Skoda', modele: 'Fabia 1.0 TSI', cylindree: 999, categorie: 'electrique_ou_petit_essence', prix2024: 14200, prix2025: 15200, prix2026: 16400 },
  { slug: 'toyota-yaris', marque: 'Toyota', modele: 'Yaris 1.5 Hybrid', cylindree: 1490, categorie: 'moyenne_cylindree', prix2024: 16500, prix2025: 17800, prix2026: 19000 },
  { slug: 'kia-picanto', marque: 'Kia', modele: 'Picanto 1.0 MPI', cylindree: 998, categorie: 'electrique_ou_petit_essence', prix2024: 11500, prix2025: 12400, prix2026: 13300 },
  { slug: 'hyundai-i10', marque: 'Hyundai', modele: 'i10 1.0 MPi', cylindree: 998, categorie: 'electrique_ou_petit_essence', prix2024: 11800, prix2025: 12700, prix2026: 13600 },
  { slug: 'hyundai-tucson', marque: 'Hyundai', modele: 'Tucson 1.6 T-GDI', cylindree: 1598, categorie: 'moyenne_cylindree', prix2024: 25900, prix2025: 27800, prix2026: 29500 },
  { slug: 'chery-tiggo-2-pro', marque: 'Chery', modele: 'Tiggo 2 Pro 1.5', cylindree: 1499, categorie: 'moyenne_cylindree', prix2024: 12800, prix2025: 13800, prix2026: 14900 },
  { slug: 'geely-gx3-pro', marque: 'Geely', modele: 'GX3 Pro 1.5', cylindree: 1498, categorie: 'moyenne_cylindree', prix2024: 12200, prix2025: 13100, prix2026: 14200 },
  { slug: 'fiat-500-hybrid', marque: 'Fiat', modele: '500 Hybrid 1.0', cylindree: 999, categorie: 'electrique_ou_petit_essence', prix2024: 12900, prix2025: 13800, prix2026: 14800 },
  { slug: 'fiat-500x', marque: 'Fiat', modele: '500X 1.3 FireFly', cylindree: 1332, categorie: 'moyenne_cylindree', prix2024: 16800, prix2025: 18200, prix2026: 19500 },
  { slug: 'fiat-tipo', marque: 'Fiat', modele: 'Tipo 1.4 Fire', cylindree: 1368, categorie: 'moyenne_cylindree', prix2024: 13500, prix2025: 14600, prix2026: 15800 },
  { slug: 'opel-corsa', marque: 'Opel', modele: 'Corsa 1.2 Turbo', cylindree: 1199, categorie: 'electrique_ou_petit_essence', prix2024: 14900, prix2025: 15900, prix2026: 17000 },
  { slug: 'citroen-c3', marque: 'Citroën', modele: 'C3 1.2 PureTech', cylindree: 1199, categorie: 'electrique_ou_petit_essence', prix2024: 13800, prix2025: 14800, prix2026: 15900 },
  { slug: 'audi-a3', marque: 'Audi', modele: 'A3 35 TFSI 1.5', cylindree: 1498, categorie: 'moyenne_cylindree', prix2024: 26500, prix2025: 28500, prix2026: 30500 },
  { slug: 'cupra-formentor', marque: 'Cupra', modele: 'Formentor 1.5 TSI', cylindree: 1498, categorie: 'moyenne_cylindree', prix2024: 27900, prix2025: 29900, prix2026: 32000 },
  { slug: 'mg-zs', marque: 'MG', modele: 'ZS 1.5 VTi', cylindree: 1498, categorie: 'moyenne_cylindree', prix2024: 14500, prix2025: 15700, prix2026: 16900 },
  { slug: 'suzuki-swift', marque: 'Suzuki', modele: 'Swift 1.2 Dualjet Hybrid', cylindree: 1197, categorie: 'electrique_ou_petit_essence', prix2024: 13900, prix2025: 14900, prix2026: 15900 },
  { slug: 'renault-captur', marque: 'Renault', modele: 'Captur 1.3 TCe', cylindree: 1332, categorie: 'moyenne_cylindree', prix2024: 17900, prix2025: 19200, prix2026: 20600 },
  { slug: 'peugeot-2008', marque: 'Peugeot', modele: '2008 1.2 PureTech', cylindree: 1199, categorie: 'electrique_ou_petit_essence', prix2024: 18500, prix2025: 19900, prix2026: 21400 },
  { slug: 'nissan-qashqai', marque: 'Nissan', modele: 'Qashqai 1.3 DIG-T', cylindree: 1332, categorie: 'moyenne_cylindree', prix2024: 22800, prix2025: 24500, prix2026: 26200 },
  { slug: 'volkswagen-tiguan', marque: 'Volkswagen', modele: 'Tiguan 2.0 TDI', cylindree: 1968, categorie: 'grosse_cylindree', prix2024: 31000, prix2025: 33500, prix2026: 35800 },
  { slug: 'bmw-serie-1', marque: 'BMW', modele: 'Série 1 118i 1.5', cylindree: 1499, categorie: 'moyenne_cylindree', prix2024: 25500, prix2025: 27500, prix2026: 29500 },
  { slug: 'mercedes-classe-a', marque: 'Mercedes-Benz', modele: 'Classe A 180 1.3', cylindree: 1332, categorie: 'moyenne_cylindree', prix2024: 26800, prix2025: 28800, prix2026: 30900 },
  { slug: 'tesla-model-3', marque: 'Tesla', modele: 'Model 3 RWD Électrique', cylindree: 0, categorie: 'electrique_ou_petit_essence', prix2024: 34900, prix2025: 36900, prix2026: 38900 },
];

const priorityCarSlugs = [
  'renault-clio-5', 'peugeot-208', 'dacia-sandero-stepway', 'dacia-duster',
  'volkswagen-golf-8', 'volkswagen-polo', 'seat-ibiza', 'toyota-yaris',
  'hyundai-tucson', 'fiat-500-hybrid'
];

const voituresData = carCatalog.map((car) => {
  const isPriority = priorityCarSlugs.includes(car.slug);
  const calc1an = calculateCar(car.prix2024, 1, car.categorie);
  const calc2ans = calculateCar(car.prix2024, 2, car.categorie);
  const calc3ans = calculateCar(car.prix2024, 3, car.categorie);

  const catFr = car.categorie === 'electrique_ou_petit_essence' ? 'Moins de 1200 cm³ (Abattement 80%)' : (car.categorie === 'moyenne_cylindree' ? '1201 à 1800 cm³ (Abattement 50%)' : 'Plus de 1800 cm³ (Abattement 20%)');
  const catAr = car.categorie === 'electrique_ou_petit_essence' ? 'أقل من 1200 سم³ (تخفيض 80%)' : (car.categorie === 'moyenne_cylindree' ? '1201 إلى 1800 سم³ (تخفيض 50%)' : 'أكثر من 1800 سم³ (تخفيض 20%)');

  return {
    ...car,
    isAdsensePriority: isPriority,
    titleFr: `Dédouanement ${car.marque} ${car.modele} (< 3 ans) en Algérie : Prix & Taxes 2024`,
    titleAr: `جمركة ${car.marque} ${car.modele} (أقل من 3 سنوات) في الجزائر: الأسعار والرسوم`,
    descriptionFr: `Combien coûte le dédouanement d'une ${car.marque} ${car.modele} en Algérie ? Droits de douane Article 110, décote 3 ans, coût Square et prix de revient total en Dinars.`,
    descriptionAr: `كم تبلغ تكلفة جمركة ${car.marque} ${car.modele} في الجزائر؟ الرسوم الجمركية وفق المادة 110، التخفيض، وسعر التكلفة الإجمالي بالدينار والسكوار.`,
    calc: calc2ans, // valeur par défaut 2 ans
    calc1an,
    calc2ans,
    calc3ans,
    comparatif: [
      {
        ageFr: '1 an d\'ancienneté (-10% décote)',
        ageAr: 'سنة واحدة (تخفيض 10%)',
        valeurCifEur: calc1an.valeurCifEur,
        taxesDouaneDA: calc1an.taxesDouaneDA,
        coutSquareDA: calc1an.coutSquareDA,
        prixRevientTotalDA: calc1an.prixRevientTotalDA,
        prixRevientMillions: calc1an.prixRevientMillions,
      },
      {
        ageFr: '2 ans d\'ancienneté (-20% décote)',
        ageAr: 'سنتان (تخفيض 20%)',
        valeurCifEur: calc2ans.valeurCifEur,
        taxesDouaneDA: calc2ans.taxesDouaneDA,
        coutSquareDA: calc2ans.coutSquareDA,
        prixRevientTotalDA: calc2ans.prixRevientTotalDA,
        prixRevientMillions: calc2ans.prixRevientMillions,
      },
      {
        ageFr: '3 ans d\'ancienneté (-30% décote)',
        ageAr: '3 سنوات (تخفيض 30%)',
        valeurCifEur: calc3ans.valeurCifEur,
        taxesDouaneDA: calc3ans.taxesDouaneDA,
        coutSquareDA: calc3ans.coutSquareDA,
        prixRevientTotalDA: calc3ans.prixRevientTotalDA,
        prixRevientMillions: calc3ans.prixRevientMillions,
      },
    ],
    faqFr: [
      {
        q: `Combien coûte le dédouanement d'une ${car.marque} ${car.modele} en Algérie ?`,
        a: `Pour un véhicule de 2 ans acheté environ ${car.prix2024.toLocaleString('fr-FR')} €, les taxes et droits de douane s'élèvent à environ ${calc2ans.taxesDouaneDA.toLocaleString('fr-FR')} DA (soit ${calc2ans.taxesDouaneMillions} Millions de centimes) grâce à l'abattement fiscal prévu par la Loi de Finances.`,
      },
      {
        q: `Quel est le prix de revient total au taux du Square ?`,
        a: `Le coût global d'acquisition (achat des devises au cours du Square Port-Saïd + frais de transport 700 € + dédouanement au port algérien) revient à environ ${calc2ans.prixRevientTotalDA.toLocaleString('fr-FR')} DA, soit ${calc2ans.prixRevientMillions} Millions de centimes.`,
      },
      {
        q: `Quelle est la cylindrée fiscale et l'abattement douanier de ce modèle ?`,
        a: `Ce modèle dispose d'un moteur de ${car.cylindree > 0 ? `${car.cylindree} cm³` : '100% électrique'}. Il relève de la catégorie "${catFr}".`,
      },
    ],
    faqAr: [
      {
        q: `كم تكلفة جمركة سيارة ${car.marque} ${car.modele} في الجزائر؟`,
        a: `لسيارة عمرها سنتان وسعرها حوالي ${car.prix2024.toLocaleString('fr-FR')} يورو، تقدر الرسوم الجمركية بحوالي ${calc2ans.taxesDouaneDA.toLocaleString('fr-FR')} دج (أي ما يعادل ${calc2ans.taxesDouaneMillions} مليون سنتيم) بفضل التخفيض المنصوص عليه في قانون المالية.`,
      },
      {
        q: `كم يبلغ سعر التكلفة الإجمالي بحساب سعر السكوار؟`,
        a: `التكلفة الإجمالية (شراء اليورو من ساحة بورسعيد + الشحن 700 يورو + الجمركة عند الوصول إلى الميناء الجزائري) تبلغ حوالي ${calc2ans.prixRevientTotalDA.toLocaleString('fr-FR')} دج، أي ما يقارب ${calc2ans.prixRevientMillions} مليون سنتيم.`,
      },
      {
        q: `ما هي سعة المحرك ونسبة التخفيض الجمركي لهذه السيارة؟`,
        a: `تبلغ سعة محرك هذا الموديل ${car.cylindree > 0 ? `${car.cylindree} سم³` : 'كهربائي بالكامل'}، ويندرج تحت فئة "${catAr}".`,
      },
    ],
  };
});

fs.writeFileSync(path.join(dataDir, 'voitures.json'), JSON.stringify(voituresData, null, 2), 'utf-8');
console.log(`[✓] data/voitures.json généré (${voituresData.length} modèles)`);

// ==========================================
// 3. DATA NOTAIRE (PALIERS IMMOBILIERS)
// ==========================================
// Paliers de 100 Millions de centimes à 5 Milliards (1 000 000 DA à 50 000 000 DA)
const notaryAmounts = [
  { millionsCts: 100, da: 1000000, labelFr: '100 Millions de centimes (100 000 DA)', labelAr: '100 مليون سنتيم' },
  { millionsCts: 200, da: 2000000, labelFr: '200 Millions de centimes', labelAr: '200 مليون سنتيم' },
  { millionsCts: 300, da: 3000000, labelFr: '300 Millions de centimes', labelAr: '300 مليون سنتيم' },
  { millionsCts: 500, da: 5000000, labelFr: '500 Millions de centimes (50 Millions DA)', labelAr: '500 مليون سنتيم' },
  { millionsCts: 700, da: 7000000, labelFr: '700 Millions de centimes', labelAr: '700 مليون سنتيم' },
  { millionsCts: 1000, da: 10000000, labelFr: '1 Milliard de centimes (1 000 Millions)', labelAr: 'مليار سنتيم (1000 مليون)' },
  { millionsCts: 1200, da: 12000000, labelFr: '1,2 Milliard de centimes (1 200 Millions)', labelAr: 'مليار و200 مليون سنتيم' },
  { millionsCts: 1500, da: 15000000, labelFr: '1,5 Milliard de centimes (1 500 Millions)', labelAr: 'مليار و500 مليون سنتيم' },
  { millionsCts: 1800, da: 18000000, labelFr: '1,8 Milliard de centimes (1 800 Millions)', labelAr: 'مليار و800 مليون سنتيم' },
  { millionsCts: 2000, da: 20000000, labelFr: '2 Milliards de centimes (2 000 Millions)', labelAr: 'مليارين سنتيم (2000 مليون)' },
  { millionsCts: 2500, da: 25000000, labelFr: '2,5 Milliards de centimes', labelAr: 'مليارين و500 مليون سنتيم' },
  { millionsCts: 3000, da: 30000000, labelFr: '3 Milliards de centimes', labelAr: '3 ملايير سنتيم' },
  { millionsCts: 4000, da: 40000000, labelFr: '4 Milliards de centimes', labelAr: '4 ملايير سنتيم' },
  { millionsCts: 5000, da: 50000000, labelFr: '5 Milliards de centimes', labelAr: '5 ملايير سنتيم' },
];

const priorityNotaryMillions = [200, 500, 700, 1000, 1200, 1500, 1800, 2000, 3000, 5000];

const notaireData = notaryAmounts.map((item) => {
  const calc = calculateNotary(item.da);
  const isPriority = priorityNotaryMillions.includes(item.millionsCts);
  const slug = `${item.millionsCts}-millions-centimes`;

  return {
    slug,
    montantDA: item.da,
    millionsCts: item.millionsCts,
    isAdsensePriority: isPriority,
    titleFr: `Frais de Notaire pour ${item.labelFr} en Algérie (Achat Immobilier)`,
    titleAr: `مصاريف الموثق لعقار بقيمة ${item.labelAr} في الجزائر (عقد البيع)`,
    descriptionFr: `Calcul exact des frais de notaire pour un bien de ${item.labelFr} (${item.da.toLocaleString('fr-FR')} DA) : droits d'enregistrement 2.5%, conservation foncière 1%, honoraires et timbres.`,
    descriptionAr: `حساب دقيق لمصاريف الموثق لعقار بقيمة ${item.labelAr} (${item.da.toLocaleString('fr-FR')} دج): رسوم التسجيل 2.5%، المحافظة العقارية 1%، أتعاب الموثق والطوابع.`,
    calc,
    comparatif: [
      {
        posteFr: 'Droits d\'enregistrement (Impôts 2.5%)',
        posteAr: 'حقوق التسجيل العقاري (الضرائب 2.5%)',
        taux: '2.5%',
        montantDA: calc.enregistrementDA,
        montantMillions: (calc.enregistrementDA / 10000).toFixed(2),
      },
      {
        posteFr: 'Conservation Foncière (Publicité 1.0%)',
        posteAr: 'المحافظة العقارية والإشهار (1%)',
        taux: '1.0%',
        montantDA: calc.conservationDA,
        montantMillions: (calc.conservationDA / 10000).toFixed(2),
      },
      {
        posteFr: 'Honoraires du Notaire (TTC avec 19% TVA)',
        posteAr: 'أتعاب الموثق الإجمالية (مع الرسم 19%)',
        taux: 'Dégressif légal',
        montantDA: calc.honorairesTTC,
        montantMillions: (calc.honorairesTTC / 10000).toFixed(2),
      },
      {
        posteFr: 'Frais de dossier et timbres fiscaux',
        posteAr: 'مصاريف الملف والطوابع الجبائية',
        taux: 'Forfait légal',
        montantDA: calc.dossierDA,
        montantMillions: (calc.dossierDA / 10000).toFixed(2),
      },
    ],
    faqFr: [
      {
        q: `Combien coûtent les frais de notaire pour un achat de ${item.labelFr} ?`,
        a: `Pour un bien immobilier évalué à ${item.labelFr} (${item.da.toLocaleString('fr-FR')} DA), l'ensemble des frais d'acte s'élève à ${calc.totalFraisDA.toLocaleString('fr-FR')} DA (soit ${calc.totalFraisMillions} Millions de centimes), ce qui représente environ ${calc.pourcentageFrais}% de la valeur du bien.`,
      },
      {
        q: `Qui paye les droits d'enregistrement et la publicité foncière ?`,
        a: `En pratique immobilière courante en Algérie, la part de 2.5% des droits d'enregistrement et la taxe de publicité foncière de 1% sont acquittées par l'acheteur chez le notaire avant la délivrance du livret foncier ou de l'acte notarié publié.`,
      },
      {
        q: `Quel est le coût global total pour l'acquéreur ?`,
        a: `Le coût global d'acquisition (valeur du bien + l'intégralité des frais administratifs et notariaux) s'élève à ${calc.coutTotalDA.toLocaleString('fr-FR')} DA, soit ${calc.coutTotalMillions} Millions de centimes.`,
      },
    ],
    faqAr: [
      {
        q: `كم تبلغ مصاريف الموثق لشراء عقار بقيمة ${item.labelAr}؟`,
        a: `لعقار بقيمة ${item.labelAr} (${item.da.toLocaleString('fr-FR')} دج)، يبلغ مجموع مصاريف العقد ورسوم الدولة ${calc.totalFraisDA.toLocaleString('fr-FR')} دج (أي ما يعادل ${calc.totalFraisMillions} مليون سنتيم)، وهو ما يمثل حوالي ${calc.pourcentageFrais}% من ثمن العقار.`,
      },
      {
        q: `من يتحمل رسوم التسجيل والمحافظة العقارية في القانون الجزائري؟`,
        a: `في المعاملات العقارية الجارية في الجزائر، يتحمل المشتري رسوم التسجيل لدى مصلحة الضرائب (2.5%) ورسم المحافظة العقارية (1%) لدى الموثق لاستكمال إجراءات الإشهار العقاري.`,
      },
      {
        q: `ما هي التكلفة الإجمالية التي يدفعها المشتري؟`,
        a: `التكلفة الإجمالية للشراء (ثمن العقار كاملاً + جميع مصاريف التوثيق والضرائب) تبلغ ${calc.coutTotalDA.toLocaleString('fr-FR')} دج، أي ما يقارب ${calc.coutTotalMillions} مليون سنتيم.`,
      },
    ],
  };
});

fs.writeFileSync(path.join(dataDir, 'notaire.json'), JSON.stringify(notaireData, null, 2), 'utf-8');
console.log(`[✓] data/notaire.json généré (${notaireData.length} tranches)`);

// ==========================================
// 4. DATA DEVISES (SQUARE VS BANQUE)
// ==========================================
const currencyAmounts = [
  50, 100, 200, 300, 500, 700, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000, 15000, 20000,
];

const priorityCurrencies = [100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000, 20000];

const devisesData = currencyAmounts.map((montant) => {
  const calcEur = calculateCurrency(montant, 'EUR');
  const calcUsd = calculateCurrency(montant, 'USD');
  const isPriority = priorityCurrencies.includes(montant);
  const slug = `${montant}-euros`;

  return {
    slug,
    montant,
    isAdsensePriority: isPriority,
    titleFr: `Convertir ${montant} Euros en Dinars Algériens (Taux Square Port-Saïd & Banque)`,
    titleAr: `تحويل ${montant} يورو بالدينار الجزائري (سعر السكوار وبنك الجزائر)`,
    descriptionFr: `Découvrez la valeur de ${montant} € en Dinars au marché informel Square Port-Saïd (${calcEur.squareDA.toLocaleString('fr-FR')} DA / ${calcEur.squareMillions} Millions) comparée au cours officiel de la Banque d'Algérie.`,
    descriptionAr: `اكتشف قيمة ${montant} يورو بالدينار في سوق السكوار بورسعيد (${calcEur.squareDA.toLocaleString('fr-FR')} دج / ${calcEur.squareMillions} مليون) مقارنة بالسعر الرسمي لبنك الجزائر.`,
    calcEur,
    calcUsd,
    comparatif: [
      {
        marcheFr: 'Marché Parallèle (Square Port-Saïd)',
        marcheAr: 'السوق الموازي (ساحة بورسعيد)',
        tauxFr: `1 € = ${RATES.TAUX_SQUARE_EUR} DA`,
        tauxAr: `1 يورو = ${RATES.TAUX_SQUARE_EUR} دج`,
        valeurDA: calcEur.squareDA,
        valeurMillions: calcEur.squareMillions,
        parleFr: calcEur.populaireFr,
        parleAr: calcEur.populaireAr,
      },
      {
        marcheFr: 'Cours Officiel (Banque d\'Algérie)',
        marcheAr: 'السعر الرسمي (بنك الجزائر)',
        tauxFr: `1 € = ${RATES.TAUX_BANQUE_EUR} DA`,
        tauxAr: `1 يورو = ${RATES.TAUX_BANQUE_EUR} دج`,
        valeurDA: calcEur.banqueDA,
        valeurMillions: calcEur.banqueMillions,
        parleFr: 'Taux officiel de facturation',
        parleAr: 'السعر الرسمي للفوترة',
      },
      {
        marcheFr: 'Écart entre les deux marchés',
        marcheAr: 'الفارق بين السوقين',
        tauxFr: `+${RATES.TAUX_SQUARE_EUR - RATES.TAUX_BANQUE_EUR} DA / €`,
        tauxAr: `+${RATES.TAUX_SQUARE_EUR - RATES.TAUX_BANQUE_EUR} دج / يورو`,
        valeurDA: calcEur.ecartDA,
        valeurMillions: (calcEur.ecartDA / 10000).toFixed(2),
        parleFr: `Surcote de +${(((RATES.TAUX_SQUARE_EUR - RATES.TAUX_BANQUE_EUR) / RATES.TAUX_BANQUE_EUR) * 100).toFixed(1)}%`,
        parleAr: `فارق يقدر بـ +${(((RATES.TAUX_SQUARE_EUR - RATES.TAUX_BANQUE_EUR) / RATES.TAUX_BANQUE_EUR) * 100).toFixed(1)}%`,
      },
    ],
    faqFr: [
      {
        q: `Combien vaut ${montant} € au Square Port-Saïd aujourd'hui ?`,
        a: `Au cours actuel du marché informel (${RATES.TAUX_SQUARE_EUR} DA pour 1 Euro), ${montant} € s'échangent contre ${calcEur.squareDA.toLocaleString('fr-FR')} DA, ce qui correspond en langage populaire algérien à ${calcEur.populaireFr}.`,
      },
      {
        q: `Combien vaut ${montant} € au taux officiel de la Banque d'Algérie ?`,
        a: `Au taux de change officiel de la Banque d'Algérie (${RATES.TAUX_BANQUE_EUR} DA pour 1 Euro), la contre-valeur de ${montant} € est de ${calcEur.banqueDA.toLocaleString('fr-FR')} DA.`,
      },
      {
        q: `Quel est l'écart de valeur entre le cours officiel et le Square ?`,
        a: `La différence nette s'élève à ${calcEur.ecartDA.toLocaleString('fr-FR')} DA en faveur du marché informel, soit un écart d'environ ${(((RATES.TAUX_SQUARE_EUR - RATES.TAUX_BANQUE_EUR) / RATES.TAUX_BANQUE_EUR) * 100).toFixed(1)}%.`,
      },
    ],
    faqAr: [
      {
        q: `كم تساوي ${montant} يورو في ساحة بورسعيد (السكوار) اليوم؟`,
        a: `وفق سعر الصرف الحالي في السوق الموازي (${RATES.TAUX_SQUARE_EUR} دج لليورو الواحد)، تبلغ قيمة ${montant} يورو ما يعادل ${calcEur.squareDA.toLocaleString('fr-FR')} دج، أي بالدارجة الجزائرية: ${calcEur.populaireAr}.`,
      },
      {
        q: `كم تساوي ${montant} يورو بالسعر الرسمي لبنك الجزائر؟`,
        a: `وفق السعر البنكي الرسمي الصادر عن بنك الجزائر (${RATES.TAUX_BANQUE_EUR} دج لليورو الواحد)، تساوي ${montant} يورو مبلغ ${calcEur.banqueDA.toLocaleString('fr-FR')} دج.`,
      },
      {
        q: `كم يبلغ الفارق بين السعرين الرسمي والموازي؟`,
        a: `يبلغ الفارق المالي ${calcEur.ecartDA.toLocaleString('fr-FR')} دج لصالح السوق الموازي، أي بزيادة تقدر بحوالي ${(((RATES.TAUX_SQUARE_EUR - RATES.TAUX_BANQUE_EUR) / RATES.TAUX_BANQUE_EUR) * 100).toFixed(1)}%.`,
      },
    ],
  };
});

fs.writeFileSync(path.join(dataDir, 'devises.json'), JSON.stringify(devisesData, null, 2), 'utf-8');
console.log(`[✓] data/devises.json généré (${devisesData.length} montants)`);

// ==========================================
// 5. DATA GUIDES (6 GUIDES APPROFONDIS)
// ==========================================
const guidesData = [
  {
    slug: 'bareme-irg-algerie',
    titleFr: 'Guide Complet du Barème IRG et des Salaires en Algérie (2024)',
    titleAr: 'الدليل الشامل لسلم ضريبة الدخل الإجمالي IRG وحساب الرواتب في الجزائر',
    summaryFr: 'Analyse exhaustive du barème officiel de l\'Impôt sur le Revenu Global : tranches de calcul, abattement forfaitaire de 40%, formule de lissage et avantages spécifiques du Régime Sud.',
    summaryAr: 'شرح مفصل لسلم الضريبة على الدخل الإجمالي الجديد: شرائح الحساب، التخفيض الجزافي 40%، صيغة التخفيف لرواتب 30 ألف إلى 35 ألف دج، وامتيازات ولايات الجنوب.',
    readingTime: '8 min',
    updatedAt: 'Octobre 2024',
    author: 'Équipe Juridique & Fiscale HissabDZ',
    sectionsFr: [
      {
        heading: '1. Fonctionnement du barème par tranches progressives',
        content: 'La Loi de Finances a refondu le barème de l\'IRG pour alléger la pression fiscale sur les salariés algériens. Le calcul de l\'impôt ne s\'effectue pas sur le salaire global, mais par tranches marginales progressives sur le salaire imposable :',
        list: [
          'Jusqu\'à 20 000 DA : Taux 0% (Totalement exonéré).',
          'De 20 001 à 40 000 DA : Taux de 23% appliqué sur le différentiel.',
          'De 40 001 à 80 000 DA : Taux de 27%.',
          'De 80 001 à 160 000 DA : Taux de 30%.',
          'De 160 001 à 320 000 DA : Taux de 33%.',
          'Plus de 320 000 DA : Taux marginal maximal de 35%.',
        ],
      },
      {
        heading: '2. L\'abattement général et l\'exonération jusqu\'à 30 000 DA',
        content: 'Le code des impôts accorde un abattement automatique de 40% sur le montant de l\'IRG brut obtenu. Cet abattement ne peut être inférieur à 1 000 DA ni supérieur à 1 500 DA par mois. En outre, une exonération totale s\'applique pour tout travailleur dont le salaire imposable ne dépasse pas le seuil légal de 30 000 DA.',
      },
      {
        heading: '3. Le mécanisme de lissage entre 30 001 DA et 35 000 DA',
        content: 'Afin d\'éviter un effet de seuil brutal pour les salariés gagnant légèrement plus que 30 000 DA, le législateur a prévu une formule de lissage mathématique dégressive : IRG = IRG_après_abattement * (137 / 51) - (27925 / 8). Cela permet une réintégration progressive et indolore de l\'impôt.',
      },
      {
        heading: '4. Régime spécifique du Grand Sud (Adrar, Illizi, Tamanrasset...)',
        content: 'Pour encourager l\'emploi et compenser la rigueur climatique des wilayas du Sud, les travailleurs bénéficient d\'une réduction supplémentaire de 50% sur l\'IRG final ainsi que d\'indemnités de zone géographique et de relève non soumises aux cotisations CNAS.',
      },
    ],
    sectionsAr: [
      {
        heading: '1. كيفية تطبيق سلم الشرائح التصاعدية لضريبة IRG',
        content: 'أقر قانون المالية إصلاحاً جوهرياً لسلم الضريبة على الدخل الإجمالي لتخفيف العبء الضريبي على العمال والموظفين الجزائريين، حيث يتم الاحتساب عبر شرائح تصاعدية على الراتب الخاضع للضريبة:',
        list: [
          'إلى غاية 20 000 دج: معفى تماماً بنسبة 0%.',
          'من 20 001 إلى 40 000 دج: نسبة 23%.',
          'من 40 001 إلى 80 000 دج: نسبة 27%.',
          'من 80 001 إلى 160 000 دج: نسبة 30%.',
          'من 160 001 إلى 320 000 دج: نسبة 33%.',
          'أكثر من 320 000 دج: النسبة القصوى 35%.',
        ],
      },
      {
        heading: '2. التخفيض العام والإعفاء التام حتى 30 000 دج',
        content: 'يمنح قانون الضرائب تخفيضاً آلياً بنسبة 40% من قيمة الضريبة المحسوبة، بحيث لا يقل هذا التخفيض عن 1000 دج شهرياً ولا يزيد عن 1500 دج. كما يستفيد كل أجير يقل راتبه الخاضع للضريبة عن 30 000 دج من إعفاء كلي وتام.',
      },
      {
        heading: '3. آلية التخفيف للشريحة بين 30 001 و35 000 دج',
        content: 'لتفادي القفزة الضريبية المفاجئة لمن تتجاوز رواتبهم 30 ألف دينار بقليل، اعتمد المشرع معادلة تلطيف خاصة تجعل الاقتطاع يرتفع تدريجياً وبشكل عادل للغاية.',
      },
      {
        heading: '4. الامتيازات الجبائية الخاصة بولايات الجنوب الكبير',
        content: 'دعماً للاستقرار وتحفيزاً للعمل في ولايات الجنوب (أدرار، إليزي، تمنراست، تندوف وغيرها)، يستفيد العاملون هناك من تخفيض إضافي بنسبة 50% على الضريبة النهائية إلى جانب تعويضات المنطقة المعفاة.',
      },
    ],
  },
  {
    slug: 'article-110-douane-voiture-moins-3-ans',
    titleFr: 'Article 110 : Tout Savoir sur le Dédouanement des Voitures de Moins de 3 Ans',
    titleAr: 'المادة 110: دليلك الكامل لجمركة السيارات المستعملة أقل من 3 سنوات في الجزائر',
    summaryFr: 'Guide pratique étape par étape pour dédouaner un véhicule d\'occasion : abattements fiscaux de 80% et 50%, calcul de la valeur CIF, décote pour vétusté et démarches auprès des douanes portuaires.',
    summaryAr: 'دليل عملي شامل لإجراءات جمركة واستيراد السيارات المستعملة: نسب التخفيض الجمركي 80% و50%، حساب القيمة الجمركية، ونسب تخفيض القدم الجمركي.',
    readingTime: '10 min',
    updatedAt: 'Octobre 2024',
    author: 'Expert Transit & Douane HissabDZ',
    sectionsFr: [
      {
        heading: '1. Conditions d\'éligibilité pour l\'acquéreur résident',
        content: 'Conformément à l\'article 110 de la Loi de Finances et au décret exécutif régissant l\'importation des voitures de moins de trois ans par les particuliers résidents en Algérie, plusieurs critères stricts sont exigés :',
        list: [
          'Le véhicule doit avoir moins de 36 mois entre sa date de première immatriculation et la date d\'entrée sur le territoire.',
          'L\'achat doit être financé sur les devises propres du citoyen (aucune allocation bancaire).',
          'Un seul véhicule par personne physique tous les trois ans.',
          'Motorisations autorisées : essence, hybride ou 100% électrique (les motorisations diesel restent exclues).',
        ],
      },
      {
        heading: '2. Les trois paliers d\'abattements fiscaux officiels',
        content: 'Pour encourager les véhicules sobres et peu polluants, les droits de douane et taxes intérieures ont été massivement allégés :',
        list: [
          'Électrique ou Essence ≤ 1200 cm³ : Abattement exceptionnel de 80% (taxe effective globale d\'environ 28,5%).',
          'Essence ou Hybride 1201 à 1800 cm³ : Abattement de 50% (taxe effective globale de 39,2%).',
          'Essence ou Hybride > 1800 cm³ : Abattement réduit à 20% + soumission à la Taxe Intérieure de Consommation TIC (taux global 80%).',
        ],
      },
      {
        heading: '3. Règle de la décote pour vétusté',
        content: 'L\'administration des douanes applique une décote sur la valeur vénale de la facture d\'achat : 10% pour un véhicule d\'un an, 20% pour deux ans, et 30% pour trois ans. La valeur en Dinars est ensuite convertie au cours officiel de la Banque d\'Algérie pour établir l\'assiette taxable CIF.',
      },
    ],
    sectionsAr: [
      {
        heading: '1. شروط استيراد السيارات أقل من 3 سنوات للمواطنين',
        content: 'وفقاً للمادة 110 من قانون المالية والمرسوم التنفيذي المحدد لكيفيات استيراد السيارات المستعملة من قبل الأفراد المقيمين، يشترط ما يلي:',
        list: [
          'ألا يتجاوز عمر المركبة 36 شهراً من تاريخ أول سير إلى تاريخ الدخول إلى الميناء.',
          'التمويل من الأموال الخاصة بالعملة الصعبة دون اللجوء إلى التمويل البنكي الرسمي.',
          'سيارة واحدة لكل شخص طبيعي كل ثلاث سنوات.',
          'المحركات المسموح بها: بنزين، هجين أو كهربائي (محركات الديزل غير مسموح بها للمواطنين).',
        ],
      },
      {
        heading: '2. شرائح التخفيض الجمركي والجبائي',
        content: 'تشجيعاً للمركبات الاقتصادية والصديقة للبيئة، أقرت الدولة نسب تخفيض جبائي معتبرة:',
        list: [
          'السيارات الكهربائية أو البنزين ≤ 1200 سم³: تخفيض بنسبة 80% (مجموع الرسوم حوالي 28.5%).',
          'محركات البنزين أو الهجين 1201 إلى 1800 سم³: تخفيض بنسبة 50% (مجموع الرسوم حوالي 39.2%).',
          'محركات تفوق 1800 سم³: تخفيض 20% مع الخضوع لرسم الاستهلاك الداخلي (مجموع الرسوم 80%).',
        ],
      },
      {
        heading: '3. قاعدة التخفيض حسب عمر المركبة',
        content: 'تطبق مصالح الجمارك تخفيضاً على قيمة السيارة في الفاتورة: 10% لسيارة عمرها سنة، 20% لسنتين، و30% لثلاث سنوات، ثم يتم احتساب الرسوم بالدينار الجزائري وفق سعر الصرف الرسمي لبنك الجزائر.',
      },
    ],
  },
  {
    slug: 'frais-notaire-achat-immobilier-algerie',
    titleFr: 'Frais de Notaire et Acte de Vente Immobilier : Le Guide Pratique',
    titleAr: 'دليل مصاريف الموثق وعقد البيع العقاري وإشهار الملكية في الجزائر',
    summaryFr: 'Détail chiffré des frais lors d\'une transaction immobilière : honoraires dégressifs légaux, droits d\'enregistrement au fisc (2.5%), taxe de publicité foncière (1%) et obtention du livret foncier.',
    summaryAr: 'تفصيل حسابي دقيق لجميع مصاريف المعاملات العقارية: السلم التنازلي لأتعاب الموثق، حقوق التسجيل الضريبي 2.5%، ورسوم المحافظة العقارية 1%.',
    readingTime: '7 min',
    updatedAt: 'Octobre 2024',
    author: 'Chambre des Notaires & Rédaction HissabDZ',
    sectionsFr: [
      {
        heading: '1. Les honoraires légaux du notaire',
        content: 'Les honoraires des notaires en Algérie sont strictement encadrés par décret et ne sont pas négociables. Ils sont calculés selon un barème par tranches de prix du bien :',
        list: [
          'De 1 à 500 000 DA : 3% de la tranche.',
          'De 500 001 à 1 000 000 DA : 2% de la tranche.',
          'Au-delà de 1 000 000 DA : 1% sur le restant de la somme.',
          'Une TVA de 19% est obligatoirement collectée sur l\'ensemble des honoraires HT.',
        ],
      },
      {
        heading: '2. Les droits d\'enregistrement (Direction des Impôts)',
        content: 'La formalité de l\'enregistrement de l\'acte authentique de vente est assujettie à une taxe fiscale globale de 5% de la valeur déclarée du bien. Dans la pratique contractuelle la plus courante, la part acquéreur est fixée à 2.5%, le vendeur s\'acquittant le cas échéant de la plus-value immobilière ou de sa quote-part.',
      },
      {
        heading: '3. Conservation foncière et formalités de publicité',
        content: 'Pour être opposable aux tiers et permettre l\'établissement du livret foncier au nom du nouveau propriétaire, l\'acte notarié doit faire l\'objet d\'une publicité à la conservation foncière de la wilaya, soumise à une taxe fixe de 1.0% de la valeur de la transaction.',
      },
    ],
    sectionsAr: [
      {
        heading: '1. السلم الرسمي لأتعاب الموثق',
        content: 'أتعاب الموثق في الجزائر محددة قانوناً بموجب مرسوم تنفيذي ولا تخضع للمفاوضة، ويتم احتسابها عبر شرائح تنازلية:',
        list: [
          'من 1 إلى 500 000 دج: نسبة 3%.',
          'من 500 001 إلى 1 000 000 دج: نسبة 2%.',
          'ما زاد عن 1 000 000 دج: نسبة 1%.',
          'يضاف إلى الأتعاب الرسم على القيمة المضافة TVA بنسبة 19%.',
        ],
      },
      {
        heading: '2. حقوق التسجيل لدى قباضة الضرائب',
        content: 'يخضع العقد التوثيقي لرسم تسجيل جبائي إجمالي قدره 5%، وفي العرف العقاري يتحمل المشتري نسبة 2.5% من قيمة العقار المصرح بها لدى كتابة العقد.',
      },
      {
        heading: '3. رسوم المحافظة العقارية والدفتر العقاري',
        content: 'لضمان حماية الملكية وإصدار الدفتر العقاري باسم المالك الجديد، يشهر العقد لدى المحافظة العقارية المختصة إقليمياً مقابل رسم قدره 1% من قيمة العقار.',
      },
    ],
  },
  {
    slug: 'declaration-cnas-salaires-algerie',
    titleFr: 'Cotisation CNAS à 9% : Calcul, Droits et Couverture Sociale',
    titleAr: 'اشتراك الضمان الاجتماعي CNAS بنسبة 9%: الحساب والحقوق والتغطية الصحية',
    summaryFr: 'Comment est calculée la retenue de sécurité sociale de 9% sur le salaire brut, quelles indemnités sont soumises à cotisation et quelles prestations sont garanties au travailleur.',
    summaryAr: 'كيفية حساب اقتطاع الضمان الاجتماعي بنسبة 9% على الراتب الخام، العلاوات الخاضعة للاشتراك والحقوق المضمونة للأجير.',
    readingTime: '6 min',
    updatedAt: 'Octobre 2024',
    author: 'Expert Paie & RH HissabDZ',
    sectionsFr: [
      {
        heading: '1. Assiette de cotisation CNAS',
        content: 'La cotisation de sécurité sociale à la charge du salarié est fixée à 9% du salaire de poste brut cotisable. Cette assiette comprend le salaire de base, les indemnités de technicité, d\'ancienneté, les primes de rendement collectif et individuel. En contrepartie, l\'employeur verse la part patronale de 26%, portant la contribution totale à 35%.',
      },
      {
        heading: '2. Droits ouverts au salarié',
        content: 'La cotisation CNAS ouvre droit au remboursement des ordonnances et médicaments via la carte Chifa, aux indemnités journalières de maladie, de maternité, aux rentes d\'accidents du travail et valide les trimestres de cotisation auprès de la CNR pour la retraite.',
      },
    ],
    sectionsAr: [
      {
        heading: '1. وعاء اشتراك الضمان الاجتماعي للأجور',
        content: 'تبلغ نسبة اشتراك العامل في الضمان الاجتماعي 9% تقتطع مباشرة من راتب المنصب الخام الخاضع للاشتراك، ويدفع صاحب العمل حصة إضافية بنسبة 26% لتبلغ النسبة الإجمالية للاشتراكات 35%.',
      },
      {
        heading: '2. الحقوق المكتسبة للمؤمن له اجتماعياً',
        content: 'يضمن اشتراك CNAS الاستفادة من التغطية الصحية وبطاقة الشفاء، تعويضات العطل المرضية، عطل الأمومة، التأمين ضد حوادث العمل واحتساب سنوات الخدمة للتقاعد لدى الصندوق الوطني للتقاعد CNR.',
      },
    ],
  },
  {
    slug: 'marche-parallele-square-port-said-change',
    titleFr: 'Square Port-Saïd vs Banque d\'Algérie : Comprendre le Double Marché des Devises',
    titleAr: 'سوق بورسعيد (السكوار) مقابل بنك الجزائر: فهم آليات سوق الصرف المزدوج',
    summaryFr: 'Analyse économique des mécanismes du marché parallèle de devises en Algérie : facteurs influençant le cours de l\'Euro, écarts avec le taux officiel et lexique monétaire populaire.',
    summaryAr: 'تحليل اقتصادي لأسباب وجود الفارق بين سعر الصرف في السوق الموازي والسعر البنكي الرسمي، والعوامل المؤثرة على سعر اليورو في الجزائر.',
    readingTime: '9 min',
    updatedAt: 'Octobre 2024',
    author: 'Analyste Macro-Économie HissabDZ',
    sectionsFr: [
      {
        heading: '1. Pourquoi existe-t-il un double marché en Algérie ?',
        content: 'Le marché officiel de la Banque d\'Algérie est réservé aux opérations de commerce extérieur encadrées (importations d\'équipements, produits alimentaires de base) et à l\'allocation voyage forfaitaire plafonnée à environ 95 € par an. Pour tout autre besoin (tourisme, importation auto < 3 ans, études à l\'étranger, épargne), les citoyens se tournent vers le marché parallèle dont le centre névralgique historique est le Square Port-Saïd à Alger.',
      },
      {
        heading: '2. Les facteurs qui font varier le cours du Square',
        content: 'Le cours fluctue selon les saisons : fortes hausses avant les périodes de vacances estivales, départs pour la Omra et le Hadj, et pics de demande liés aux vagues d\'importation de véhicules de moins de 3 ans.',
      },
    ],
    sectionsAr: [
      {
        heading: '1. أسباب وجود سوق موازي للصرف في الجزائر',
        content: 'يقتصر الصرف البنكي الرسمي على العمليات التجارية والاستيرادية المعتمدة من الدولة ومنحة السفر السياحية المقدرة بحوالي 95 يورو، مما يدفع المواطنين للجوء إلى ساحة بورسعيد لتلبية احتياجاتهم كالسفر، العلاج، استيراد السيارات أو الادخار.',
      },
      {
        heading: '2. العوامل المحددة لارتفاع أو انخفاض سعر العملة',
        content: 'يتأثر سعر العملة في السكوار بمواسم العمرة والحج، عطلة الصيف، وتدفقات استيراد المركبات المستعملة التي ترفع الطلب على اليورو والدولار.',
      },
    ],
  },
  {
    slug: 'importation-vehicule-neuf-vs-occasion-3-ans',
    titleFr: 'Acheter Neuf chez un Concessionnaire ou Importer Moins de 3 Ans ? Le Comparatif',
    titleAr: 'شراء سيارة جديدة من الوكيل أم استيراد أقل من 3 سنوات؟ مقارنة شاملة',
    summaryFr: 'Comparatif financier et technique complet entre les véhicules neufs vendus par les concessionnaires agréés en Algérie et l\'importation d\'un véhicule d\'occasion européen de moins de 3 ans.',
    summaryAr: 'مقارنة مالية وتقنية شاملة بين اقتناء سيارة جديدة عبر وكلاء السيارات المعتمدين في الجزائر واستيراد سيارة أقل من 3 سنوات من أوروبا.',
    readingTime: '8 min',
    updatedAt: 'Octobre 2024',
    author: 'Rédacteur Automobile HissabDZ',
    sectionsFr: [
      {
        heading: '1. Délais et disponibilité',
        content: 'Si l\'achat chez le concessionnaire officiel bénéficie d\'une garantie constructeur de 3 à 5 ans et d\'une facturation en Dinars, les délais de livraison peuvent être longs en fonction des quotas. L\'importation de moins de 3 ans permet une disponibilité immédiate et un choix de finitions et d\'options beaucoup plus étendu.',
      },
      {
        heading: '2. Comparaison budgétaire globale',
        content: 'Grâce aux abattements fiscaux de 80% sur les moteurs de moins de 1200 cm³ et de 50% jusqu\'à 1800 cm³, une citadine européenne récente (Clio 5, 208, Sandero) importée reste souvent très compétitive par rapport aux prix du marché de l\'occasion local.',
      },
    ],
    sectionsAr: [
      {
        heading: '1. آجال التسليم والضمان المصنعي',
        content: 'يتميز الشراء من الوكيل المعتمد بالاستفادة من الضمان المصنعي الرسمي بالدينار الجزائري، بينما يتيح استيراد سيارة أقل من 3 سنوات توفراً فورياً وتنوعاً كبيراً في التجهيزات والخيارات.',
      },
      {
        heading: '2. الموازنة المالية بين الخيارين',
        content: 'تمنح التخفيضات الجمركية الكبيرة على المحركات الاقتصادية ميزة تنافسية ممتازة للسيارات المستوردة مقارنة بأسعار السوق المحلية.',
      },
    ],
  },
];

fs.writeFileSync(path.join(dataDir, 'guides.json'), JSON.stringify(guidesData, null, 2), 'utf-8');
console.log(`[✓] data/guides.json généré (${guidesData.length} guides)`);

console.log('\n[SUCCESS] Génération de données terminée avec succès !');
