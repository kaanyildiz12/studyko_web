'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMail, FiMessageCircle, FiMapPin, FiSend } from 'react-icons/fi';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simüle edilmiş form gönderimi
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bize Ulaşın
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* İletişim Bilgileri */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <FiMail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">E-posta</h3>
                    <p className="text-sm text-gray-600">support@studyko.app</p>
                    <p className="text-sm text-gray-600">info@studyko.app</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-accent-100 rounded-lg">
                    <FiMessageCircle className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Sosyal Medya</h3>
                    <p className="text-sm text-gray-600">@studyko</p>
                    <p className="text-sm text-gray-600">Twitter, Instagram</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FiMapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Çalışma Saatleri</h3>
                    <p className="text-sm text-gray-600">Pazartesi - Cuma</p>
                    <p className="text-sm text-gray-600">09:00 - 18:00</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
                <h3 className="font-semibold text-gray-900 mb-2">Sıkça Sorulan Sorular</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Aradığınız cevabı SSS bölümümüzde bulabilirsiniz.
                </p>
                <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
                  SSS'ye Git →
                </button>
              </div>
            </div>

            {/* İletişim Formu */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mesaj Gönderin</h2>
                
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                    <FiSend className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Mesajınız Gönderildi!</h4>
                      <p className="text-sm text-green-700 mt-1">
                        En kısa sürede size geri dönüş yapacağız.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label-primary">
                        İsim Soyisim
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-primary"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    <div>
                      <label className="label-primary">
                        E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-primary"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-primary">
                      Konu
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-primary"
                    >
                      <option value="">Konu seçin...</option>
                      <option value="support">Teknik Destek</option>
                      <option value="feature">Özellik Önerisi</option>
                      <option value="bug">Hata Bildirimi</option>
                      <option value="premium">Premium Üyelik</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="label-primary">
                      Mesajınız
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-primary resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="spinner w-5 h-5 mr-2"></div>
                        Gönderiliyor...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FiSend className="mr-2" />
                        Mesajı Gönder
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Bölümü */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'StudyKo nasıl çalışır?',
                  a: 'StudyKo, Pomodoro tekniğini kullanarak 25 dakikalık çalışma seansları ve 5 dakikalık molalarla verimliliğinizi artırır. Sosyal odalar sayesinde arkadaşlarınızla birlikte çalışabilirsiniz.',
                },
                {
                  q: 'Premium üyelik ne sağlar?',
                  a: 'Premium üyelikle sınırsız oda üyeliği, özel temalar, detaylı analitikler, reklamsız deneyim ve öncelikli destek hizmetine erişim kazanırsınız.',
                },
                {
                  q: 'Ücretsiz sürümde kaç odaya katılabilirim?',
                  a: 'Ücretsiz sürümde aynı anda 5 odaya kadar üye olabilirsiniz. Premium üyelikle bu sınır kaldırılır.',
                },
                {
                  q: 'Verilerim güvende mi?',
                  a: 'Evet, tüm verileriniz Firebase güvenlik protokolleri ile korunmaktadır. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.',
                },
              ].map((faq, index) => (
                <div key={index} className="pb-6 border-b border-gray-200 last:border-0">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
