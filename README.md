# HissabDZ | حساب ديزاد

Portail algérien de référence pour les simulateurs financiers, douaniers et immobiliers bilingue (**Français** `/fr` et **Arabe** `/ar` avec support RTL complet). Conçu pour le **Programmatic SEO** à haute performance et prêt pour l'approbation **Google AdSense** et **Ezoic**.

---

## 🚀 Caractéristiques & Modules

1. **Simulateur Salaire Net & IRG 2024 :**
   - Barème officiel par tranches (0%, 23%, 27%, 30%, 33%, 35%)
   - Cotisation Sécurité Sociale CNAS à 9%
   - Exonération totale pour salaires imposables ≤ 30 000 DA
   - Formule officielle de lissage dégressif (30 001 à 35 000 DA)
   - Option **Régime Grand Sud** (abattement fiscal de 50% sur l'IRG)
   - Primes imposables (Panier/Transport) et indemnités de zone

2. **Simulateur Douane Voitures Moins de 3 Ans (Article 110) :**
   - Décote légale pour vétusté : -10% (1 an), -20% (2 ans), -30% (3 ans)
   - Calcul de la valeur CIF en Dinars au cours officiel Banque d'Algérie
   - Abattements fiscaux : 80% (≤ 1200 cm³ et électriques), 50% (1201 à 1800 cm³), 20% (> 1800 cm³ + TIC)
   - Prix de revient total intégrant le change au marché informel (Square Port-Saïd)
   - Affichage systématique en Dinars et en Millions de centimes

3. **Simulateur Frais de Notaire & Acte Immobilier :**
   - Droits d'enregistrement (2.5% acquéreur)
   - Conservation et publicité foncière (1.0%)
   - Honoraires dégressifs du notaire (3%, 2%, 1%) + TVA 19% + frais de timbres (15 000 DA)
   - Bascule interactive de saisie : Dinars (DA) <-> Millions de centimes

4. **Convertisseur Devises (Square Port-Saïd vs Banque d'Algérie) :**
   - Double affichage temps réel EUR et USD
   - Écart en Dinars et en pourcentage
   - Traduction automatique en langage parlé algérien ("Millions et Milliers de centimes")

5. **Guides Législatifs de Fond pour Google AdSense :**
   - 6 grands dossiers détaillés et rédigés en Français et en Arabe avec balisage `Article`.

---

## ⚙️ Configuration Centrale (`config/rates.js`)

Les taux mensuels et le mode d'approbation AdSense sont centralisés dans [`config/rates.js`](file:///c:/hissab/config/rates.js) :

```javascript
export const RATES_CONFIG = {
  TAUX_BANQUE_EUR: 154.0,
  TAUX_SQUARE_EUR: 255.0,
  TAUX_BANQUE_USD: 139.0,
  TAUX_SQUARE_USD: 235.0,
  TRANSPORT_FORFAIT_EUR: 700,
  NOTAIRE_FRAIS_DOSSIER_DA: 15000,
  PHASE_APPROBATION_ADSENSE: true, // true = 40 pages prioritaires + guides | false = +2500 pages
  ADSENSE_ACTIVE: false,           // Activer une fois le compte AdSense validé
};
```

---

## 🛠️ Commandes Disponibles

- **Générer les jeux de données :**
  ```bash
  npm run generate-data
  ```
- **Lancer en développement :**
  ```bash
  npm run dev
  ```
- **Compiler pour la production (SSG) :**
  ```bash
  npm run build
  ```
- **Démarrer le serveur de production :**
  ```bash
  npm run start
  ```
