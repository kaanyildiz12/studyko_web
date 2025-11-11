'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiTarget, FiHeart, FiTrendingUp, FiUsers } from 'react-icons/fi';

export default function AboutPage() {
  const stats = [
    { value: '10K+', label: 'Mutlu Kullanıcı' },
    { value: '500K+', label: 'Tamamlanan Oturum' },
    { value: '50K+', label: 'Oluşturulan Oda' },
    { value: '98%', label: 'Memnuniyet Oranı' },
  ];

  const values = [
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: 'Odak',
      description: 'Kullanıcılarımızın hedeflerine ulaşmaları için en iyi araçları sağlıyoruz',
      color: 'bg-blue-500',
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: 'Topluluk',
      description: 'Birlikte öğrenmenin ve gelişmenin gücüne inanıyoruz',
      color: 'bg-red-500',
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Gelişim',
      description: 'Sürekli kendimizi ve ürünümüzü geliştirmeye devam ediyoruz',
      color: 'bg-green-500',
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'İşbirliği',
      description: 'Sosyal öğrenme ile verimliliği maksimize ediyoruz',
      color: 'bg-purple-500',
    },
  ];

  const team = [
    {
      name: 'Kaan Yıldız',
      role: 'Kurucu & CEO',
      image: '👨‍💻',
      bio: 'Yazılım mühendisi ve verimlilik tutkunu',
    },
    {
      name: 'Ayşe Demir',
      role: 'Ürün Tasarımcısı',
      image: '👩‍🎨',
      bio: 'UX/UI tasarımı ve kullanıcı deneyimi uzmanı',
    },
    {
      name: 'Mehmet Kaya',
      role: 'Baş Geliştirici',
      image: '👨‍💼',
      bio: 'Full-stack geliştirici ve Firebase uzmanı',
    },
    {
      name: 'Zeynep Yılmaz',
      role: 'Topluluk Yöneticisi',
      image: '👩‍💼',
      bio: 'Kullanıcı ilişkileri ve destek koordinatörü',
    },
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Lansman',
      description: 'StudyKo ilk kullanıcılarıyla buluştu',
    },
    {
      year: '2024',
      title: 'Premium Özellikler',
      description: 'Premium üyelik ve gelişmiş özellikler eklendi',
    },
    {
      year: '2024',
      title: '10K Kullanıcı',
      description: '10,000 aktif kullanıcı sayısına ulaştık',
    },
    {
      year: '2025',
      title: 'Mobil Uygulama',
      description: 'iOS ve Android uygulamaları yayınlandı',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hakkımızda
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              StudyKo, öğrenciler ve profesyoneller için sosyal bir verimlilik platformudur
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="card text-center hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                🎯 Misyonumuz
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                StudyKo, öğrencilerin ve profesyonellerin hedeflerine daha etkili bir şekilde 
                ulaşmalarına yardımcı olmak için geliştirilmiştir. Pomodoro tekniğini sosyal 
                bir deneyimle birleştirerek, kullanıcılarımızın motivasyonunu ve verimliliğini 
                artırmayı hedefliyoruz.
              </p>
              <p className="text-lg text-gray-700">
                Birlikte çalışmanın gücüne inanıyoruz. StudyKo ile arkadaşlarınızla veya 
                aynı hedeflere sahip kişilerle bir araya gelerek, odaklanmanızı artırabilir 
                ve hedeflerinize daha hızlı ulaşabilirsiniz.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Değerlerimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="card text-center">
                  <div className={`${value.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Yolculuğumuz
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {item.year}
                      </div>
                    </div>
                    <div className="card flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Ekibimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="card bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bizimle Birlikte Büyüyün
            </h2>
            <p className="text-lg mb-6 opacity-90">
              StudyKo topluluğuna katılın ve verimliliğinizi artırın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition">
                Ücretsiz Başla
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition">
                İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
