'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiUsers, FiTrendingUp, FiZap, FiAward, FiMessageCircle, FiCheck, FiStar } from 'react-icons/fi';

interface StatsData {
  users: string;
  sessions: string;
  minutes: string;
  rooms: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<StatsData>({
    users: '10K+',
    sessions: '500K+',
    minutes: '1M+',
    rooms: '50K+',
  });

  useEffect(() => {
    // Fetch real stats from API
    fetch('/api/public/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.stats) {
          setStats(data.data.stats);
        }
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        // Keep default fallback values
      });
  }, []);
  const features = [
    {
      icon: <FiClock className="w-8 h-8" />,
      title: 'Pomodoro Timer',
      description: 'Odaklanmanı artıran klasik 25-5 dakika çalışma tekniği',
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Sosyal Odalar',
      description: 'Arkadaşlarınla birlikte çalış, motivasyonunu artır',
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'İstatistikler',
      description: 'Günlük, haftalık ve aylık çalışma istatistiklerini takip et',
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Başarımlar',
      description: 'Hedeflerini tamamla, rozet kazan',
    },
    {
      icon: <FiMessageCircle className="w-8 h-8" />,
      title: 'Anlık Mesajlaşma',
      description: 'Odalar içinde arkadaşlarınla sohbet et',
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'Motivasyon Sistemi',
      description: 'Streak takibi ve günlük hedeflerle motive kal',
    },
  ];

  const pricingPlans = [
    {
      name: 'Ücretsiz',
      price: '0₺',
      period: '/ay',
      features: [
        'Sınırsız Pomodoro oturumu',
        'Temel istatistikler',
        '5 aktif oda üyeliği',
        'Temel başarımlar',
        'Topluluk desteği',
      ],
      cta: 'Şimdi Başla',
      popular: false,
    },
    {
      name: 'Premium',
      price: '29₺',
      period: '/ay',
      features: [
        'Ücretsiz tüm özellikler',
        'Sınırsız oda üyeliği',
        'Özel temalar ve avatarlar',
        'Detaylı analitikler',
        'Reklamsız deneyim',
        'Öncelikli destek',
        'Özel premium rozetleri',
      ],
      cta: 'Premium Ol',
      popular: true,
    },
  ];

  const testimonials = [
    {
      name: 'Ayşe Y.',
      role: 'Üniversite Öğrencisi',
      image: '/avatars/avatar-1.png',
      content: 'StudyKo sayesinde sınav dönemlerinde arkadaşlarımla birlikte çalışıyoruz. Motivasyonum çok arttı!',
      rating: 5,
    },
    {
      name: 'Mehmet K.',
      role: 'Yazılım Geliştirici',
      image: '/avatars/avatar-2.png',
      content: 'Pomodoro tekniğini kullanmak hiç bu kadar kolay olmamıştı. İstatistikler sayesinde kendimi takip edebiliyorum.',
      rating: 5,
    },
    {
      name: 'Zeynep A.',
      role: 'Lise Öğrencisi',
      image: '/avatars/avatar-3.png',
      content: 'Sosyal odalar özelliği harika! Arkadaşlarımla birlikte çalışmak beni çok motive ediyor.',
      rating: 5,
    },
  ];

  const statsDisplay = [
    { value: stats.users, label: 'Aktif Kullanıcı' },
    { value: stats.sessions, label: 'Tamamlanan Oturum' },
    { value: stats.minutes, label: 'Çalışma Dakikası' },
    { value: stats.rooms, label: 'Oluşturulan Oda' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-white rounded-full shadow-md">
            <span className="text-sm font-medium text-primary-600">🎉 Yeni: Premium Üyelik Lansmanı!</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
            Arkadaşlarınla Birlikte
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Daha Verimli Çalış
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
            Pomodoro tekniği ile odaklan, sosyal odalar ile motive ol, hedeflerine daha hızlı ulaş.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up mb-12">
            <button className="btn-primary text-lg px-8 py-4">
              🍎 App Store'dan İndir
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              🤖 Google Play'den İndir
            </button>
          </div>
          
          {/* Video/Demo Preview */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-xl font-semibold">Uygulama Demo Videosu</p>
                  <p className="text-gray-400 mt-2">StudyKo'yu keşfedin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {statsDisplay.map((stat, index) => (
              <div key={index} className="card text-center hover:scale-105 transition-transform bg-white/80 backdrop-blur">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-gray-600 mt-2 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Özellikler</h2>
            <p className="section-subtitle">
              Verimliliğini artıracak tüm araçlar tek bir uygulamada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Nasıl Çalışır?</h2>
            <p className="section-subtitle">
              3 basit adımda daha verimli çalışmaya başla
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Hesap Oluştur</h3>
              <p className="text-gray-600">
                E-posta veya Google hesabınla hızlıca kayıt ol
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Oda Seç veya Oluştur</h3>
              <p className="text-gray-600">
                Mevcut odalara katıl veya arkadaşların için yeni oda oluştur
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Çalışmaya Başla</h3>
              <p className="text-gray-600">
                Pomodoro timer'ı başlat ve hedefe odaklan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Kullanıcılarımız Ne Diyor?</h2>
            <p className="section-subtitle">
              Binlerce kullanıcı StudyKo ile hedeflerine ulaşıyor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiAward key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Fiyatlandırma</h2>
            <p className="section-subtitle">
              Sana en uygun planı seç, daha verimli çalışmaya başla
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`card relative ${
                  plan.popular ? 'ring-2 ring-primary-600 shadow-xl' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    En Popüler
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={plan.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title">Şimdi İndir</h2>
          <p className="section-subtitle mb-8">
            iOS ve Android cihazlarında kullanılabilir
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              App Store'dan İndir
            </button>
            <button className="btn-primary">
              Google Play'den İndir
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

