'use client';

import { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { RATES_CONFIG } from '../../../config/rates';

export default function ContactPage({ params }) {
  const lang = params?.lang === 'ar' ? 'ar' : 'fr';
  const isAr = lang === 'ar';

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: 'Question générale',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        lang={lang}
        items={[{ label: isAr ? 'اتصل بنا' : 'Contact & Réclamations' }]}
      />

      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Mail className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'خدمة الاستماع والمساعدة' : 'Support & Renseignements'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isAr ? 'اتصل بفريق حساب ديزاد' : 'Contactez l\'Équipe HissabDZ'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isAr
            ? 'هل لديك استفسار، اقتراح لإضافة محاكي جديد، أو تصحيح قانوني؟ فريقنا في خدمتكم.'
            : 'Une question sur nos calculs, une suggestion de simulateur ou un signalement réglementaire ? Écrivez-nous.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Infos de contact */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              {isAr ? 'معلومات التواصل' : 'Coordonnées Officielles'}
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-800">Email</span>
                  <a
                    href="mailto:contact@hissabdz.com"
                    className="hover:text-emerald-600 underline"
                  >
                    contact@hissabdz.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-800">
                    {isAr ? 'المقر' : 'Localisation'}
                  </span>
                  <span>Bab Ezzouar / Alger, Algérie</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              {isAr
                ? 'نرد على جميع الاستفسارات المهنية والقانونية في أقل من 24 ساعة عمل.'
                : 'Délai moyen de réponse estimé : 24 à 48 heures ouvrées.'}
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isAr ? 'تم استلام رسالتكم بنجاح' : 'Message Envoyé avec Succès'}
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  {isAr
                    ? 'شكراً لتواصلكم مع حساب ديزاد. سيقوم فريقنا بمراجعة رسالتكم والرد عليكم في أقرب الآجال.'
                    : 'Merci de votre message. Notre équipe administrative traitera votre demande dans les plus brefs délais.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {isAr ? 'إرسال رسالة أخرى' : 'Envoyer un autre message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      {isAr ? 'الاسم الكامل' : 'Nom & Prénom'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder={isAr ? 'محمد بن علي' : 'Ex: Karim Benali'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Adresse Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="karim@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {isAr ? 'موضوع الرسالة' : 'Objet de la demande'}
                  </label>
                  <select
                    value={formData.sujet}
                    onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                  >
                    <option value="Question générale">
                      {isAr ? 'استفسار عام' : 'Question générale'}
                    </option>
                    <option value="Correction légale">
                      {isAr ? 'اقتراح تصحيح قانوني أو مالي' : 'Signalement ou mise à jour d\'un taux'}
                    </option>
                    <option value="Partenariat AdSense">
                      {isAr ? 'شراكة أو إعلانات' : 'Partenariat & Publicité'}
                    </option>
                    <option value="Autre">
                      {isAr ? 'أمر آخر' : 'Autre sujet'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    {isAr ? 'الرسالة' : 'Votre message'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isAr ? 'اكتب رسالتك بالتفصيل هنا...' : 'Détaillez votre demande ici...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'إرسال الرسالة' : 'Envoyer mon message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
