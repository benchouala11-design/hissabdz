import { ShieldCheck, Award, Users, Scale, CheckCircle2 } from 'lucide-react';
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
      ? `من نحن | ${RATES_CONFIG.SITE_NAME_AR}`
      : `À Propos de Nous | ${RATES_CONFIG.SITE_NAME}`,
    description: isAr
      ? 'تعرف على منصة حساب ديزاد، رسالتنا في تبسيط الحسابات المالية والجمركية بالجزائر وفريق خبرائنا.'
      : 'Découvrez l\'équipe, la méthodologie et les engagements de transparence et de conformité légale de HissabDZ.',
  };
}

export default function AboutPage({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const isAr = lang === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        lang={lang}
        items={[{ label: isAr ? 'من نحن' : 'À Propos de nous' }]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'الشفافية والمصداقية' : 'Transparence & Rigueur'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isAr ? 'من نحن - بوابة حساب ديزاد' : 'À Propos de HissabDZ'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {isAr
            ? 'بوابة رقمية جزائرية مستقلة متخصصة في المحاكاة الدقيقة للحسابات المالية، الجبائية، الجمركية والعقارية.'
            : 'Le portail de référence pour les simulations financières, fiscales, douanières et juridiques en Algérie.'}
        </p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>{isAr ? 'رسالتنا وهدفنا' : 'Notre Mission'}</span>
          </h2>
          <p>
            {isAr
              ? 'نهدف إلى تمكين كل مواطن، موظف، مقاول ومستثمر جزائري من الوصول الفوري والشفاف إلى نتائج حسابية معقدة بضغطة زر واحدة، سواء تعلق الأمر بالراتب الصافي الشهري، تكاليف جمركة السيارات المستوردة، أو مصاريف التوثيق وشراء العقارات.'
              : 'Notre mission est de démocratiser l\'accès aux calculs administratifs et financiers en Algérie. Face à la complexité des textes juridiques et des barèmes dégressifs, HissabDZ offre une interface moderne, instantanée et gratuite pour estimer avec exactitude vos revenus nets, vos taxes douanières ou vos frais d\'actes immobiliers.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>{isAr ? 'المنهجية والمرجعية القانونية' : 'Méthodologie & Sources Officielles'}</span>
          </h2>
          <p>
            {isAr
              ? 'تعتمد جميع خوارزمياتنا الحسابية على النصوص المنشورة في الجريدة الرسمية للجمهورية الجزائرية، وتحديداً:'
              : 'Tous nos algorithmes de calcul s\'appuient exclusivement sur les textes officiels publiés au Journal Officiel de la République Algérienne Démocratique et Populaire :'}
          </p>
          <ul className="space-y-2 pt-1 pl-2 pr-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
              <span>
                {isAr
                  ? 'قوانين المالية وقانون الضرائب المباشرة والرسوم المماثلة (السلم الرسمي لضريبة IRG).'
                  : 'Codes des Impôts Directs et Lois de Finances récentes (Barème officiel de l\'IRG et abattements).'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
              <span>
                {isAr
                  ? 'المادة 110 المنظمة لاستيراد السيارات السياحية المستعملة لأقل من ثلاث سنوات.'
                  : 'Article 110 régissant le dédouanement des véhicules de tourisme d\'occasion de moins de 3 ans.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
              <span>
                {isAr
                  ? 'المراسيم التنفيذية المحددة لأتعاب الموثقين ورسوم المحافظة العقارية والتسجيل.'
                  : 'Décrets exécutifs fixant les tarifs des honoraires des notaires et de la publicité foncière.'}
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>{isAr ? 'فريق العمل والحياد' : 'Équipe & Indépendance'}</span>
          </h2>
          <p>
            {isAr
              ? 'تم تطوير منصة حساب ديزاد بأيدي نخبة من المطورين والخبراء الماليين الجزائريين المستقلين. المنصة مجانية بالكامل، لا تجمع بيانات شخصية حساسة، وتهدف فقط إلى تقديم خدمة عمومية رقمية عالية الجودة.'
              : 'HissabDZ est développé et maintenu par une équipe passionnée d\'ingénieurs logiciels et de consultants financiers algériens. Nous garantissons une indépendance éditoriale totale, la gratuité intégrale de nos simulateurs et le respect absolu de la vie privée de nos utilisateurs.'}
          </p>
        </section>
      </div>
    </div>
  );
}
