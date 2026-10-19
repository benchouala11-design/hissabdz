import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { RATES_CONFIG } from '../../../config/rates';

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const isAr = lang === 'ar';
  return {
    title: isAr
      ? `سياسة الخصوصية | ${RATES_CONFIG.SITE_NAME_AR}`
      : `Politique de Confidentialité | ${RATES_CONFIG.SITE_NAME}`,
    description: isAr
      ? 'تعرف على سياسة الخصوصية واستخدام ملفات تعريف الارتباط وإعلانات Google AdSense في منصة حساب ديزاد.'
      : 'Politique de confidentialité et de gestion des cookies conformément aux exigences Google AdSense et RGPD.',
  };
}

export default function PrivacyPage({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const isAr = lang === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        lang={lang}
        items={[{ label: isAr ? 'سياسة الخصوصية' : 'Politique de Confidentialité' }]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>{isAr ? 'حماية البيانات الشخصية' : 'Protection des Données'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isAr ? 'سياسة الخصوصية وشروط الاستخدام' : 'Politique de Confidentialité'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isAr
            ? `آخر تحديث: ${RATES_CONFIG.LAST_UPDATED_AR} - تنطبق هذه السياسة على كافة خدمات ${RATES_CONFIG.SITE_NAME_AR}.`
            : `Dernière mise à jour : ${RATES_CONFIG.LAST_UPDATED} - Cette politique s'applique à l'ensemble des simulateurs du portail ${RATES_CONFIG.SITE_NAME}.`}
        </p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>{isAr ? '1. سرية بيانات المحاكاة' : '1. Confidentialité des Calculs'}</span>
          </h2>
          <p>
            {isAr
              ? 'تتم جميع العمليات الحسابية (الرواتب، الجمارك، العقارات، العملات) مباشرة على متصفح جهازك (Client-side) دون حفظ أي رقم من أرقامك أو إرساله إلى أي خادم خارجي. نحرص التزاماً تاماً على سرية رواتبكم ومعاملاتكم المالية.'
              : 'Tous les calculs effectués sur HissabDZ sont traités en temps réel directement au sein de votre navigateur web. Aucune donnée financière personnelle (montant de salaire, prix d\'achat ou patrimoine immobilier) n\'est enregistrée sur nos serveurs ni partagée avec des tiers.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            <span>{isAr ? '2. ملفات تعريف الارتباط وإعلانات Google AdSense' : '2. Cookies et Publicités Google AdSense'}</span>
          </h2>
          <p>
            {isAr
              ? 'تتعامل منصتنا مع شركاء إعلانيين موثوقين مثل Google AdSense لعرض إعلانات مناسبة تضمن استمرارية خدماتنا المجانية. تستخدم Google ملفات تعريف الارتباط (Cookies)، بما في ذلك ملف تعريف الارتباط DART، لعرض الإعلانات للمستخدمين استناداً إلى زياراتهم لموقعنا ومواقع أخرى على الإنترنت.'
              : 'Notre site diffuse des annonces fournies par Google AdSense afin de financer l\'hébergement et le développement continu de nos outils gratuits. Google, en tant que fournisseur tiers, utilise des cookies (notamment le cookie DoubleClick DART) pour diffuser des annonces pertinentes basées sur la navigation des internautes.'}
          </p>
          <p>
            {isAr
              ? 'يمكن للمستخدمين إلغاء استخدام ملف تعريف الارتباط DART بزيارة سياسة الخصوصية الخاصة بإعلانات Google وشبكة المحتوى على الرابط الرسمي لـ Google Ads.'
              : 'Les utilisateurs peuvent désactiver l\'utilisation du cookie DART en se rendant sur la page relative aux règles de confidentialité de Google Ads.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>{isAr ? '3. ملفات السجل (Log Files)' : '3. Fichiers Journaux (Log Files)'}</span>
          </h2>
          <p>
            {isAr
              ? 'يتبع موقع حساب ديزاد الإجراءات القياسية في استخدام ملفات السجل لتشخيص أخطاء الخوادم وتحسين سرعة تحميل الصفحات. تشمل المعلومات المجمعة: عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت (ISP)، طابع التاريخ والوقت، والصفحات التي تمت زيارتها دون ربطها بأي معلومات تعريف شخصية.'
              : 'Comme la plupart des sites web, HissabDZ utilise des fichiers journaux standards à des fins statistiques et d\'optimisation des performances (adresses IP anonymisées, type de navigateur, pages de référence, date et heure des requêtes). Ces données ne sont en aucun cas reliées à des informations d\'identification personnelle.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{isAr ? '4. موافقة المستخدم' : '4. Consentement'}</span>
          </h2>
          <p>
            {isAr
              ? 'باستخدامك لموقعنا الإلكتروني، فإنك توافق بموجب هذا على سياسة الخصوصية الخاصة بنا وتوافق على شروطها.'
              : 'En utilisant notre site internet, vous déclarez avoir pris connaissance de notre politique de confidentialité et en acceptez expressément les conditions.'}
          </p>
        </section>
      </div>
    </div>
  );
}
