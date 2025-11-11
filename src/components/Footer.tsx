import Link from 'next/link';
import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-white">StudyKo</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Pomodoro tekniği ile sosyal odaklanma ve verimlilik uygulaması
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition" aria-label="GitHub">
                <FiGithub size={20} />
              </a>
              <a href="mailto:support@studyko.app" className="hover:text-white transition" aria-label="Email">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Ürün</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm hover:text-white transition">
                  Özellikler
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm hover:text-white transition">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link href="/download" className="text-sm hover:text-white transition">
                  İndir
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Şirket</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-white transition">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm hover:text-white transition">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/data-safety" className="text-sm hover:text-white transition">
                  Veri Güvenliği
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@studyko.app" className="text-sm hover:text-white transition">
                  support@studyko.app
                </a>
              </li>
              <li>
                <a href="mailto:info@studyko.app" className="text-sm hover:text-white transition">
                  info@studyko.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>&copy; 2025 StudyKo. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}

