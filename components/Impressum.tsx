import React from 'react';
import { ArrowLeft, Mail, MapPin, Phone, Building2, FileText, Shield } from 'lucide-react';
import { useI18n } from '../i18n';
import { CONTACT_EMAIL } from '../constants';

interface ImpressumProps {
    onBack: () => void;
    onNavigate: (id: string) => void;
}

export const Impressum: React.FC<ImpressumProps> = ({ onBack }) => {
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Back button */}
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-ink transition-colors mb-8 group focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    {t('nav.home') || 'Zurück'}
                </button>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-12 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText size={28} />
                            <h1 className="text-3xl font-bold">Impressum</h1>
                        </div>
                        <p className="text-gray-400 text-sm">Angaben gemäß § 5 TMG</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">

                        {/* Company Info */}
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-ink mb-4">
                                <Building2 size={20} className="text-blue-600" />
                                Unternehmen
                            </h2>
                            <div className="space-y-2 text-gray-600 pl-7">
                                <p className="font-semibold text-ink">WebManufaktur Berlin</p>
                                <p className="text-sm text-gray-400 italic">[Rechtsform einfügen, z.B. Einzelunternehmen / GbR / UG]</p>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Address */}
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-ink mb-4">
                                <MapPin size={20} className="text-blue-600" />
                                Anschrift
                            </h2>
                            <div className="space-y-1 text-gray-600 pl-7">
                                <p className="text-sm text-gray-400 italic">[Straße und Hausnummer]</p>
                                <p className="text-sm text-gray-400 italic">[PLZ Stadt]</p>
                                <p>Deutschland</p>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Contact */}
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-ink mb-4">
                                <Mail size={20} className="text-blue-600" />
                                Kontakt
                            </h2>
                            <div className="space-y-3 pl-7">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-gray-400" />
                                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline font-medium">
                                        {CONTACT_EMAIL}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-400 italic">[Telefonnummer einfügen]</span>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Representative */}
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-ink mb-4">
                                <Shield size={20} className="text-blue-600" />
                                Verantwortlich
                            </h2>
                            <div className="space-y-2 text-gray-600 pl-7">
                                <p><span className="font-semibold text-ink">Vertreten durch:</span> <span className="text-sm text-gray-400 italic">[Name Geschäftsführer/Inhaber]</span></p>
                                <p><span className="font-semibold text-ink">Umsatzsteuer-ID:</span> <span className="text-sm text-gray-400 italic">[USt-IdNr. einfügen]</span></p>
                                <p><span className="font-semibold text-ink">Handelsregister:</span> <span className="text-sm text-gray-400 italic">[falls zutreffend]</span></p>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Disclaimer */}
                        <section>
                            <h2 className="text-lg font-bold text-ink mb-4">Haftungsausschluss</h2>
                            <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-1">Haftung für Inhalte</h3>
                                    <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-1">Haftung für Links</h3>
                                    <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-1">Urheberrecht</h3>
                                    <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung und Verbreitung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors.</p>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Privacy stub */}
                        <section>
                            <h2 className="text-lg font-bold text-ink mb-4">Datenschutz</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Nähere Informationen zum Datenschutz finden Sie in unserer Datenschutzerklärung.
                                <span className="text-gray-400 italic ml-1">[Link zur Datenschutzerklärung einfügen]</span>
                            </p>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-400">
                    © {new Date().getFullYear()} WebManufaktur Berlin.
                </div>
            </div>
        </div>
    );
};
