/**
 * Dictionnaire complet de traduction Français (fr) et Arabe (ar)
 * Fonctions de formatage monétaire spécifiques à l'Algérie (Dinars DA, Millions de Centimes)
 */

export const i18n = {
  fr: {
    siteName: 'HissabDZ',
    siteTagline: 'Le portail n°1 des simulateurs financiers et administratifs en Algérie',
    siteDescription: 'Simulez en direct votre salaire net IRG 2024, le dédouanement de votre voiture moins de 3 ans, les frais de notaire immobilier et le change devise Square vs Banque.',
    langName: 'Français',
    otherLang: 'العربية',
    otherLangCode: 'ar',
    dir: 'ltr',

    // Navigation
    nav: {
      home: 'Accueil',
      salary: 'Salaire Net & IRG',
      customs: 'Douane Voiture (< 3 ans)',
      notary: 'Frais de Notaire',
      currency: 'Devises Square',
      guides: 'Guides & Décrets',
      menu: 'Menu',
      close: 'Fermer',
    },

    // Badges & Common
    common: {
      official: 'Officiel Loi de Finances',
      updated: 'Mis à jour',
      da: 'DA',
      eur: '€',
      usd: '$',
      millionCentimes: 'Million de centimes',
      millionsCentimes: 'Millions de centimes',
      calculate: 'Calculer',
      result: 'Résultat du calcul',
      summary: 'Synthèse détaillée',
      breakdown: 'Détail des retenues & taxes',
      share: 'Partager ce calcul',
      copied: 'Lien copié !',
      copyLink: 'Copier le lien',
      faq: 'Questions fréquentes (FAQ)',
      relatedCalculations: 'Paliers proches & simulations associées',
      crossTools: 'Découvrez nos autres simulateurs',
      disclaimer: 'Calculs établis selon les barèmes officiels et les taux de référence. Les montants sont donnés à titre indicatif selon la législation en vigueur.',
    },

    // Module Salaires
    salary: {
      title: 'Simulateur Salaire Net & IRG Algérie',
      subtitle: 'Calculez votre salaire net mensuel après déduction CNAS (9%) et IRG (barème officiel par tranches)',
      inputBrut: 'Salaire Brut (de poste) en DA',
      inputBrutPlaceholder: 'Ex: 75 000',
      primesImposables: 'Primes imposables (Panier, Transport...)',
      primesNonImposables: 'Indemnités non imposables / non cotisables',
      isSudLabel: 'Bénéficier du Régime Grand Sud (IRG réduit de 50%)',
      sudTooltip: 'Concerne les wilayas du Sud (Adrar, Tamanrasset, Illizi, Tindouf, In Salah, etc.)',
      netToPay: 'Salaire Net à percevoir',
      grossSalary: 'Salaire Brut initial',
      taxableSalary: 'Salaire Imposable',
      cnasDeduction: 'Cotisation CNAS Sécurité Sociale (9%)',
      irgDeduction: 'Retenue IRG (Impôt sur le Revenu Global)',
      generalAbatement: 'Abattement général appliqué',
      sudAbatement: 'Réduction spécifique Régime Sud (-50%)',
      totalDeductions: 'Total des retenues (CNAS + IRG)',
      netInCentimes: 'Équivalent en millions de centimes',
      compareTableTitle: 'Comparatif selon le régime géographique & primes',
      regimeNord: 'Régime Nord (Standard)',
      regimeSud: 'Régime Grand Sud (-50% IRG)',
      withPrimes: 'Avec primes panier/transport (+10 000 DA)',
      popularBrackets: 'Paliers de salaires populaires',
    },

    // Module Voitures Douane
    customs: {
      title: 'Simulateur Douane Voiture Moins de 3 Ans (Article 110)',
      subtitle: 'Estimez les droits de douane, la valeur CIF et le coût total de revient en Dinars selon la Loi de Finances',
      priceEur: 'Prix d\'achat du véhicule en Euros (€)',
      priceEurPlaceholder: 'Ex: 14 500',
      transportEur: 'Frais de transport & transit (€)',
      vehicleAge: 'Âge du véhicule (date 1ère immatriculation)',
      age1: 'Moins de 1 an (-10% décote douanière)',
      age2: 'Entre 1 et 2 ans (-20% décote douanière)',
      age3: 'Entre 2 et 3 ans (-30% décote douanière)',
      engineCategory: 'Motorisation & Cylindrée fiscale',
      catSmall: 'Électrique ou Essence ≤ 1 200 cm³ (Abattement 80%)',
      catMedium: 'Essence / Hybride 1 201 à 1 800 cm³ (Abattement 50%)',
      catBig: 'Essence / Hybride > 1 800 cm³ (Abattement 20% + TIC)',
      cifValueEur: 'Valeur CIF dédouanée en Euros',
      cifValueDA: 'Valeur CIF officielle (Taux Banque)',
      customsTaxesDA: 'Total Droits et Taxes Douaniers (DA)',
      squarePurchaseDA: 'Coût d\'achat véhicule au Square (DA)',
      totalCostDA: 'Prix de revient total en Algérie (DA)',
      totalCostCentimes: 'Prix de revient en Millions de centimes',
      compareTableTitle: 'Comparatif du coût de revient selon l\'ancienneté du véhicule',
      popularCars: 'Modèles de voitures les plus importés',
    },

    // Module Frais de Notaire
    notary: {
      title: 'Simulateur Frais de Notaire & Acte de Vente Immobilier',
      subtitle: 'Calculez les droits d\'enregistrement, conservation foncière et honoraires du notaire en Algérie',
      priceDA: 'Valeur du bien immobilier en Dinars (DA)',
      priceCentimes: 'Ou saisissez en Millions de centimes',
      pricePlaceholder: 'Ex: 15 000 000 DA ou 1500 Millions',
      buyerFees: 'Frais totaux à la charge de l\'acquéreur',
      totalAcquisitionCost: 'Coût global de l\'achat (Bien + Frais)',
      registrationFees: 'Droits d\'enregistrement (Impôts 2.5%)',
      landConservation: 'Conservation Foncière (Publicité 1%)',
      notaryHonorarium: 'Honoraires du Notaire (Barème légal)',
      vatNotary: 'TVA sur honoraires (19%)',
      fileExpenses: 'Timbres fiscaux & frais administratifs (15 000 DA)',
      totalFeesPercent: 'Part des frais sur la valeur du bien',
      compareTableTitle: 'Barème détaillé des frais pour cette transaction',
      popularBrackets: 'Tranches de prix immobiliers courantes',
    },

    // Module Devises Square
    currency: {
      title: 'Convertisseur Devises : Square Port-Saïd vs Banque d\'Algérie',
      subtitle: 'Comparez instantanément le taux du marché parallèle (Square) et le cours officiel de la Banque d\'Algérie',
      amountLabel: 'Montant en devises',
      currencyLabel: 'Devise sélectionnée',
      eur: 'Euro (€)',
      usd: 'Dollar Américain ($)',
      squareValue: 'Valeur au Marché Parallèle (Square)',
      bankValue: 'Valeur Officielle (Banque d\'Algérie)',
      gapDA: 'Écart de change en Dinars',
      spokenAlgerian: 'Équivalent en langage parlé algérien',
      compareTableTitle: 'Tableau comparatif officiel vs marché informel',
      popularAmounts: 'Montants usuels de conversion',
    },

    // Guides
    guidesPage: {
      title: 'Guides Pratiques & Décrets Officiels',
      subtitle: 'Comprenez vos droits fiscaux, vos démarches d\'importation et vos transactions immobilières en Algérie',
      readGuide: 'Lire le guide complet',
      publishedOn: 'Publié le',
      readingTime: 'Temps de lecture',
      min: 'min',
    },

    // Footer
    footer: {
      aboutText: 'HissabDZ est le portail de référence pour les simulations financières, douanières et juridiques en Algérie. Tous nos algorithmes sont conformes aux textes de lois et décrets exécutifs en vigueur.',
      toolsTitle: 'Nos Simulateurs',
      guidesTitle: 'Guides Législatifs',
      legalTitle: 'Informations Légales',
      aboutUs: 'À Propos de nous',
      privacy: 'Politique de Confidentialité',
      contact: 'Contact & Réclamations',
      rightsReserved: 'Tous droits réservés.',
    },
  },

  ar: {
    siteName: 'حساب ديزاد',
    siteTagline: 'البوابة الأولى لمحاكاة الحسابات المالية والضرائب والجمرك في الجزائر',
    siteDescription: 'احسب بدقة راتبك الصافي بعد اقتطاع الضريبة على الدخل الإجمالي IRG والضمان الاجتماعي CNAS، جمركة السيارات أقل من 3 سنوات، مصاريف الموثق وأسعار الصرف في السكوار.',
    langName: 'العربية',
    otherLang: 'Français',
    otherLangCode: 'fr',
    dir: 'rtl',

    // Navigation
    nav: {
      home: 'الرئيسية',
      salary: 'الراتب الصافي والضريبة',
      customs: 'جمركة السيارات (< 3 سنوات)',
      notary: 'مصاريف الموثق العقاري',
      currency: 'صرف العملات (السكوار)',
      guides: 'الدلائل والقوانين',
      menu: 'القائمة',
      close: 'إغلاق',
    },

    // Badges & Common
    common: {
      official: 'رسمي وفق قانون المالية',
      updated: 'آخر تحديث',
      da: 'دج',
      eur: '€',
      usd: '$',
      millionCentimes: 'مليون سنتيم',
      millionsCentimes: 'ملايين سنتيم',
      calculate: 'حساب',
      result: 'نتيجة الحساب',
      summary: 'الملخص التفصيلي',
      breakdown: 'تفاصيل الاقتطاعات والرسوم',
      share: 'مشاركة هذه النتيجة',
      copied: 'تم نسخ الرابط بنجاح!',
      copyLink: 'نسخ الرابط',
      faq: 'الأسئلة الشائعة (FAQ)',
      relatedCalculations: 'حسابات ومبالغ قريبة',
      crossTools: 'اكتشف باقي حاسباتنا',
      disclaimer: 'تستند الحسابات إلى القوانين والمراسيم التنفيذية الجزائرية الرسمية وأسعار السوق المرجعية، وتقدم كأداة توجيهية دقيقة.',
    },

    // Module Salaires
    salary: {
      title: 'حاسبة الراتب الصافي وضريبة الدخل IRG في الجزائر',
      subtitle: 'احسب راتبك الصافي الشهري بدقة بعد خصم الضمان الاجتماعي (9%) وضريبة الدخل الإجمالي وفق السلم الرسمي',
      inputBrut: 'الراتب الخام (راتب المنصب) بالدينار الجزائري',
      inputBrutPlaceholder: 'مثال: 75000',
      primesImposables: 'علاوات خاضعة للضريبة (قفة، نقل...)',
      primesNonImposables: 'تعويضات معفاة من الضريبة والاشتراك',
      isSudLabel: 'الاستفادة من نظام الجنوب الكبير (تخفيض 50% من الضريبة)',
      sudTooltip: 'يشمل ولايات الجنوب (أدرار، تمنراست، إليزي، تندوف، عين صالح...)',
      netToPay: 'الراتب الصافي للقبض',
      grossSalary: 'الراتب الخام الأولي',
      taxableSalary: 'الراتب الخاضع للضريبة',
      cnasDeduction: 'اقتطاع الضمان الاجتماعي CNAS (9%)',
      irgDeduction: 'اقتطاع الضريبة على الدخل الإجمالي (IRG)',
      generalAbatement: 'التخفيض العام المطبق (40%)',
      sudAbatement: 'تخفيض نظام الجنوب الخاص (-50%)',
      totalDeductions: 'مجموع الاقتطاعات (CNAS + IRG)',
      netInCentimes: 'المعادل بملايين السنتيم الجزائري',
      compareTableTitle: 'مقارنة الراتب الصافي حسب المنطقة الجغرافية والعلاوات',
      regimeNord: 'نظام الشمال (العادي)',
      regimeSud: 'نظام الجنوب الكبير (تخفيض 50% من IRG)',
      withPrimes: 'مع منحة القفة والنقل (+10 000 دج)',
      popularBrackets: 'مستويات الرواتب الأكثر بحثاً',
    },

    // Module Voitures Douane
    customs: {
      title: 'حاسبة جمركة السيارات أقل من 3 سنوات (المادة 110)',
      subtitle: 'تقدير الرسوم الجمركية، القيمة الجمركية CIF والتكلفة الإجمالية الحقيقية للسيارة بالدينار الجزائري',
      priceEur: 'سعر شراء السيارة باليورو (€)',
      priceEurPlaceholder: 'مثال: 14500',
      transportEur: 'تكاليف الشحن والنقل (€)',
      vehicleAge: 'عمر السيارة (تاريخ أول سير)',
      age1: 'أقل من سنة (تخفيض جمركي 10%)',
      age2: 'بين سنة وسنتين (تخفيض جمركي 20%)',
      age3: 'بين سنتين و3 سنوات (تخفيض جمركي 30%)',
      engineCategory: 'سعة المحرك ونوعه الجبائي',
      catSmall: 'كهربائية أو بنزين ≤ 1200 سم³ (تخفيض 80%)',
      catMedium: 'بنزين / هجين 1201 إلى 1800 سم³ (تخفيض 50%)',
      catBig: 'بنزين / هجين > 1800 سم³ (تخفيض 20% + رسم استهلاك)',
      cifValueEur: 'القيمة الجمركية CIF باليورو',
      cifValueDA: 'القيمة الجمركية الرسمية (سعر بنك الجزائر)',
      customsTaxesDA: 'مجموع الحقوق والرسوم الجمركية (دج)',
      squarePurchaseDA: 'تكلفة شراء العملة من السكوار (دج)',
      totalCostDA: 'سعر التكلفة الإجمالي في الجزائر (دج)',
      totalCostCentimes: 'سعر التكلفة بملايين السنتيم',
      compareTableTitle: 'مقارنة تكلفة الجمركة حسب عمر وسنة سير السيارة',
      popularCars: 'السيارات الأكثر استيراداً في الجزائر',
    },

    // Module Frais de Notaire
    notary: {
      title: 'حاسبة مصاريف الموثق وعقد البيع العقاري في الجزائر',
      subtitle: 'احسب رسوم التسجيل العقاري، المحافظة العقارية وأتعاب الموثق المحددة رسمياً في الجزائر',
      priceDA: 'قيمة العقار بالدينار الجزائري (دج)',
      priceCentimes: 'أو أدخل القيمة بملايين السنتيم',
      pricePlaceholder: 'مثال: 15000000 دج أو 1500 مليون',
      buyerFees: 'إجمالي الرسوم والمصاريف على عاتق المشتري',
      totalAcquisitionCost: 'التكلفة الإجمالية للشراء (العقار + المصاريف)',
      registrationFees: 'حقوق التسجيل والضرائب (2.5%)',
      landConservation: 'المحافظة العقارية والمسح (1%)',
      notaryHonorarium: 'أتعاب الموثق (وفق السلم التنازلي الرسمي)',
      vatNotary: 'الرسم على القيمة المضافة لأتعاب الموثق (19%)',
      fileExpenses: 'الطوابع الجبائية ومصاريف الملف (15 000 دج)',
      totalFeesPercent: 'نسبة المصاريف الإجمالية من ثمن العقار',
      compareTableTitle: 'الجدول المفصل لتوزيع مصاريف هذه الصفقة العقارية',
      popularBrackets: 'أسعار العقارات المتداولة في السوق',
    },

    // Module Devises Square
    currency: {
      title: 'محول العملات: ساحة بورسعيد (السكوار) مقابل بنك الجزائر',
      subtitle: 'مقارنة فورية بين سعر الصرف في السوق الموازي (السكوار) والسعر الرسمي لبنك الجزائر',
      amountLabel: 'المبلغ بالعملة الصعبة',
      currencyLabel: 'اختر العملة',
      eur: 'يورو (€)',
      usd: 'دولار أمريكي ($)',
      squareValue: 'القيمة في السوق الموازي (السكوار)',
      bankValue: 'القيمة الرسمية (بنك الجزائر)',
      gapDA: 'الفارق بالدينار الجزائري',
      spokenAlgerian: 'القيمة باللسان الجزائري الدارج',
      compareTableTitle: 'جدول المقارنة بين السعر الرسمي والسوق الموازي',
      popularAmounts: 'مبالغ الصرف الشائعة',
    },

    // Guides
    guidesPage: {
      title: 'الدلائل العملية والمراسيم التنفيذية',
      subtitle: 'تعرف على حقوقك الضريبية وإجراءات استيراد المركبات والصفقات العقارية في الجزائر',
      readGuide: 'قراءة الدليل الشامل',
      publishedOn: 'تاريخ النشر',
      readingTime: 'وقت القراءة',
      min: 'دقائق',
    },

    // Footer
    footer: {
      aboutText: 'منصة "حساب ديزاد" هي المرجع الرائد للمحاكاة المالية، الجمركية والقانونية في الجزائر، وفق أحدث قوانين المالية والمراسيم الرسمية الصادرة في الجريدة الرسمية.',
      toolsTitle: 'حاسباتنا',
      guidesTitle: 'الدلائل التشريعية',
      legalTitle: 'معلومات قانونية',
      aboutUs: 'من نحن',
      privacy: 'سياسة الخصوصية',
      contact: 'اتصل بنا',
      rightsReserved: 'جميع الحقوق محفوظة.',
    },
  },
};

/**
 * Formatage des montants en Dinars Algériens (DA / دج)
 */
export function formatDA(amount, lang = 'fr') {
  const num = Math.round(Number(amount) || 0);
  const formatted = num.toLocaleString('fr-FR');
  if (lang === 'ar') {
    return `${formatted} دج`;
  }
  return `${formatted} DA`;
}

/**
 * Formatage en Millions de centimes (10 000 DA = 1 Million de centimes)
 */
export function formatMillionsCentimes(amountDA, lang = 'fr') {
  const numDA = Number(amountDA) || 0;
  const millions = (numDA / 10000).toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });

  if (lang === 'ar') {
    return `${millions} مليون سنتيم`;
  }
  return `${millions} M de centimes`;
}

/**
 * Formatage EUR
 */
export function formatEUR(amount) {
  const num = Math.round(Number(amount) || 0);
  return `${num.toLocaleString('fr-FR')} €`;
}

/**
 * Formatage USD
 */
export function formatUSD(amount) {
  const num = Math.round(Number(amount) || 0);
  return `${num.toLocaleString('fr-FR')} $`;
}

/**
 * Formatage d'un nombre générique
 */
export function formatNumber(num) {
  return (Number(num) || 0).toLocaleString('fr-FR');
}
