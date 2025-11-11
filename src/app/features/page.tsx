'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiUsers, FiTrendingUp, FiAward, FiMessageCircle, FiZap, FiBell, FiSettings, FiLock, FiSmartphone, FiCloud, FiCheck } from 'react-icons/fi';

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: <FiClock className="w-12 h-12" />,
      title: 'Pomodoro Timer',
      description: 'Klasik 25-5 dakika formatı veya özel ayarlarınızla çalışın',
      features: [
        'Özelleştirilebilir çalışma süreleri',
        'Sesli bildirimler',
        'Otomatik mola başlatma',
        'Arka plan çalışma modu',
      ],
      color: 'from-red-500 to-orange-500',
      image: '⏱️',
    },
    {
      icon: <FiUsers className="w-12 h-12" />,
      title: 'Sosyal Odalar',
      description: 'Arkadaşlarınızla birlikte çalışın, motivasyonunuzu artırın',
      features: [
        'Genel ve özel odalar',
        'Oda sohbet sistemi',
        'Canlı katılımcı listesi',
        'Oda moderasyon araçları',
      ],
      color: 'from-blue-500 to-purple-500',
      image: '👥',
    },
    {
      icon: <FiTrendingUp className="w-12 h-12" />,
      title: 'Detaylı İstatistikler',
      description: 'Çalışma verilerinizi analiz edin ve gelişiminizi takip edin',
      features: [
        'Günlük, haftalık, aylık raporlar',
        'Görsel grafikler',
        'Verimlilik skorları',
        'İlerleme karşılaştırmaları',
      ],
      color: 'from-green-500 to-teal-500',
      image: '📊',
    },
    {
      icon: <FiAward className="w-12 h-12" />,
      title: 'Başarımlar ve Rozetler',
      description: 'Hedeflerinize ulaşın, özel rozetler ve ödüller kazanın',
      features: [
        '50+ farklı başarım',
        'Seviye sistemi',
        'Özel premium rozetleri',
        'Liderlik tabloları',
      ],
      color: 'from-yellow-500 to-orange-500',
      image: '🏆',
    },
  ];

  const additionalFeatures = [
    {
      icon: <FiMessageCircle className="w-8 h-8" />,
      title: 'Anlık Mesajlaşma',
      description: 'Oda içinde arkadaşlarınızla mesajlaşın',
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'Streak Takibi',
      description: 'Günlük çalışma dizilerinizi koruyun',
    },
    {
      icon: <FiBell className="w-8 h-8" />,
      title: 'Akıllı Bildirimler',
      description: 'Özelleştirilebilir bildirim sistemi',
    },
    {
      icon: <FiSettings className="w-8 h-8" />,
      title: 'Özelleştirme',
      description: 'Temalar, avatarlar ve profil düzenleme',
    },
    {
      icon: <FiLock className="w-8 h-8" />,
      title: 'Güvenlik',
      description: 'Firebase ile güvenli veri saklama',
    },
    {
      icon: <FiSmartphone className="w-8 h-8" />,
      title: 'Çoklu Platform',
      description: 'iOS, Android ve Web desteği',
    },
    {
      icon: <FiCloud className="w-8 h-8" />,
      title: 'Bulut Senkronizasyon',
      description: 'Tüm cihazlarda verilerinize erişin',
    },
  ];

  const comparisonFeatures = [
    { name: 'Sınırsız Pomodoro Oturumu', free: true, premium: true },
    { name: 'Temel İstatistikler', free: true, premium: true },
    { name: 'Oda Üyeliği (5 oda)', free: true, premium: false },
    { name: 'Sınırsız Oda Üyeliği', free: false, premium: true },
    { name: 'Temel Başarımlar', free: true, premium: true },
    { name: 'Premium Rozetleri', free: false, premium: true },
    { name: 'Özel Temalar', free: false, premium: true },
    { name: 'Detaylı Analitikler', free: false, premium: true },
    { name: 'Reklamsız Deneyim', free: false, premium: true },
    { name: 'Öncelikli Destek', free: false, premium: true },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Güçlü Özellikler
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Verimliliğinizi artırmak için tasarlanmış kapsamlı araç seti
            </p>
          </div>

          {/* Main Features */}
          <div className="space-y-16 mb-16">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-12 flex items-center justify-center shadow-xl`}>
                    <span className="text-9xl">{feature.image}</span>
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className={`text-primary-600 mb-4 p-4 bg-primary-50 rounded-xl inline-block`}>
                    {feature.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <FiCheck className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Daha Fazla Özellik
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="text-primary-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="card overflow-hidden">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Ücretsiz vs Premium
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Özellik
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Ücretsiz
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        Premium
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {feature.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.free ? (
                          <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.premium ? (
                          <FiCheck className="w-6 h-6 text-primary-600 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-6 mt-6 text-center">
              <p className="text-gray-700 mb-4">
                Premium üyelikle tüm özelliklere sınırsız erişim kazanın
              </p>
              <button className="btn-primary">
                Premium'a Geç - Sadece 29₺/ay
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
