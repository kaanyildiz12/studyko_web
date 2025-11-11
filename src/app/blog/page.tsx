'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiUser, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Pomodoro Tekniği Nedir ve Nasıl Kullanılır?',
      excerpt: 'Pomodoro tekniğinin temellerini ve verimliliğinizi nasıl artırabileceğinizi keşfedin.',
      author: 'StudyKo Team',
      date: '15 Ekim 2024',
      readTime: '5 dk',
      category: 'Verimlilik',
      image: '🍅',
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 2,
      title: 'Sosyal Çalışmanın Faydaları',
      excerpt: 'Neden arkadaşlarınızla birlikte çalışmak motivasyonunuzu artırır?',
      author: 'Dr. Ayşe Yılmaz',
      date: '10 Ekim 2024',
      readTime: '7 dk',
      category: 'Psikoloji',
      image: '👥',
      color: 'from-blue-500 to-purple-500',
    },
    {
      id: 3,
      title: 'Odaklanma İpuçları ve Teknikleri',
      excerpt: 'Dikkat dağınıklığını azaltmak ve odaklanmayı artırmak için pratik yöntemler.',
      author: 'Mehmet Demir',
      date: '5 Ekim 2024',
      readTime: '6 dk',
      category: 'Verimlilik',
      image: '🎯',
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 4,
      title: 'Çalışma Rutini Oluşturma Rehberi',
      excerpt: 'Düzenli ve etkili bir çalışma rutini nasıl oluşturulur?',
      author: 'Zeynep Kaya',
      date: '1 Ekim 2024',
      readTime: '8 dk',
      category: 'Planlama',
      image: '📅',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 5,
      title: 'Sınav Stresi ile Başa Çıkma Yöntemleri',
      excerpt: 'Sınav dönemlerinde stresi azaltmak için etkili stratejiler.',
      author: 'Ahmet Yıldız',
      date: '25 Eylül 2024',
      readTime: '5 dk',
      category: 'Psikoloji',
      image: '📚',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 6,
      title: 'Dijital Detoks ve Verimlilik',
      excerpt: 'Dijital cihazlardan uzaklaşmanın verimliliğinize etkisi.',
      author: 'StudyKo Team',
      date: '20 Eylül 2024',
      readTime: '4 dk',
      category: 'Sağlık',
      image: '📱',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const categories = ['Tümü', 'Verimlilik', 'Psikoloji', 'Planlama', 'Sağlık'];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog & İçerikler
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Verimlilik, odaklanma ve başarı için ipuçları ve stratejiler
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full transition ${
                  category === 'Tümü'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <div className="card-hover overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`bg-gradient-to-br ${blogPosts[0].color} p-12 flex items-center justify-center`}>
                  <span className="text-9xl">{blogPosts[0].image}</span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="badge-primary">{blogPosts[0].category}</span>
                    <span className="text-sm text-gray-500">ÖNE ÇIKAN</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiUser className="w-4 h-4" />
                        <span>{blogPosts[0].author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        <span>{blogPosts[0].readTime}</span>
                      </div>
                    </div>
                    <button className="text-primary-600 font-medium flex items-center gap-2 hover:gap-3 transition-all">
                      Devamını Oku <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <div key={post.id} className="card-hover overflow-hidden group">
                <div className={`bg-gradient-to-br ${post.color} h-48 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-7xl">{post.image}</span>
                </div>
                <div className="p-6">
                  <span className="badge-primary mb-3 inline-block">{post.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <FiUser className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <button className="text-primary-600 font-medium flex items-center gap-2 hover:gap-3 transition-all">
                    Devamını Oku <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-16 card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📬 Bültenimize Abone Olun
              </h2>
              <p className="text-gray-600 mb-6">
                Yeni içerikler, ipuçları ve güncellemelerden haberdar olun
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="input-primary flex-1"
                />
                <button className="btn-primary whitespace-nowrap">
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
