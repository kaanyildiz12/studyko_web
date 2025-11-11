'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiSmartphone, FiMonitor, FiDownload, FiCheck, FiStar } from 'react-icons/fi';

export default function DownloadPage() {
  const platforms = [
    {
      name: 'iOS',
      icon: '🍎',
      version: 'v1.2.0',
      size: '45 MB',
      requirements: 'iOS 13.0 veya üzeri',
      rating: '4.8',
      reviews: '2.5K',
      features: [
        'iPhone ve iPad desteği',
        'Widget desteği',
        'Siri kısayolları',
        'Dark mode',
        'Otomatik senkronizasyon',
      ],
      downloadLink: '#',
      color: 'from-gray-800 to-gray-900',
    },
    {
      name: 'Android',
      icon: '🤖',
      version: 'v1.2.0',
      size: '38 MB',
      requirements: 'Android 8.0 veya üzeri',
      rating: '4.7',
      reviews: '3.2K',
      features: [
        'Tablet desteği',
        'Widget desteği',
        'Bildirim özelleştirme',
        'Dark mode',
        'Otomatik senkronizasyon',
      ],
      downloadLink: '#',
      color: 'from-green-600 to-green-700',
    },
    {
      name: 'Web',
      icon: '🌐',
      version: 'v1.2.0',
      size: 'N/A',
      requirements: 'Modern tarayıcı',
      rating: '4.9',
      reviews: '1.8K',
      features: [
        'Kurulum gerektirmez',
        'Tüm cihazlarda çalışır',
        'Progressive Web App',
        'Offline desteği',
        'Otomatik güncellemeler',
      ],
      downloadLink: 'https://app.studyko.com',
      color: 'from-blue-600 to-purple-600',
    },
  ];

  const qrCode = '📱';

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              StudyKo'yu İndir
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tüm platformlarda kullanılabilir. En sevdiğin cihazdan hemen başla!
            </p>
          </div>

          {/* Quick Download */}
          <div className="card bg-gradient-to-br from-primary-600 to-accent-600 text-white mb-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="text-6xl mb-6">{qrCode}</div>
              <h2 className="text-3xl font-bold mb-4">Hızlı İndirme</h2>
              <p className="text-lg mb-6 opacity-90">
                QR kodu telefonunuzla tarayın ve doğrudan uygulama mağazasına gidin
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2">
                  <span className="text-2xl">🍎</span>
                  App Store
                </button>
                <button className="px-8 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2">
                  <span className="text-2xl">🤖</span>
                  Google Play
                </button>
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {platforms.map((platform, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-br ${platform.color} rounded-xl p-8 flex items-center justify-center mb-6`}>
                  <span className="text-7xl">{platform.icon}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{platform.name}</h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <FiStar className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{platform.rating}</span>
                  </div>
                  <span className="text-gray-500">({platform.reviews} değerlendirme)</span>
                </div>

                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Sürüm:</span>
                    <span className="font-medium text-gray-900">{platform.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Boyut:</span>
                    <span className="font-medium text-gray-900">{platform.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gereksinim:</span>
                    <span className="font-medium text-gray-900">{platform.requirements}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Özellikler:</h4>
                  <ul className="space-y-2">
                    {platform.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="btn-primary w-full">
                  <FiDownload className="mr-2" />
                  {platform.name === 'Web' ? 'Şimdi Aç' : 'İndir'}
                </button>
              </div>
            ))}
          </div>

          {/* System Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <FiSmartphone className="w-8 h-8 text-primary-600" />
                <h3 className="text-2xl font-bold text-gray-900">Mobil Gereksinimler</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700"><strong>iOS:</strong> iPhone/iPad (iOS 13.0+)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700"><strong>Android:</strong> Telefon/Tablet (Android 8.0+)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700">İnternet bağlantısı (senkronizasyon için)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700">Bildirimler için izin gereklidir</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <FiMonitor className="w-8 h-8 text-primary-600" />
                <h3 className="text-2xl font-bold text-gray-900">Web Gereksinimleri</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700">Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700">JavaScript etkin olmalı</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700">İnternet bağlantısı</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700">1280x720 minimum ekran çözünürlüğü önerilir</span>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'StudyKo ücretsiz mi?',
                  a: 'Evet! StudyKo\'nun temel özellikleri tamamen ücretsizdir. Premium özellikler için aylık 29₺ ödeme yapabilirsiniz.',
                },
                {
                  q: 'Tüm cihazlarımda kullanabilir miyim?',
                  a: 'Evet, StudyKo tüm verilerinizi bulutta saklar ve tüm cihazlarınızda senkronize eder.',
                },
                {
                  q: 'Offline kullanabilir miyim?',
                  a: 'Evet, mobil uygulamalar ve PWA offline çalışabilir. Ancak senkronizasyon için internet bağlantısı gerekir.',
                },
                {
                  q: 'Nasıl güncelleme yapılır?',
                  a: 'Mobil uygulamalar otomatik olarak güncellenir. Web versiyonu her zaman günceldir.',
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
