'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase-client';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Giriş denemesi:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase giriş başarılı:', userCredential.user.email);
      
      const idToken = await userCredential.user.getIdToken();
      console.log('Token alındı');
      
      // Store token in cookie
      document.cookie = `admin-token=${idToken}; path=/; max-age=3600`;
      
      // Check if user is admin
      console.log('Admin kontrolü yapılıyor...');
      const response = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      console.log('Verify response status:', response.status);
      
      if (response.ok) {
        console.log('Admin doğrulandı, yönlendiriliyor...');
        router.push('/admin');
      } else {
        const errorData = await response.json();
        console.error('Admin doğrulama hatası:', errorData);
        setError(`Bu hesap admin yetkisine sahip değil. (${userCredential.user.email})`);
      }
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Şifre yanlış. Lütfen tekrar deneyin.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta adresi.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.');
      } else {
        setError(`Giriş başarısız: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      
      // Store token in cookie
      document.cookie = `admin-token=${idToken}; path=/; max-age=3600`;
      
      // Check if user is admin
      const response = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        setError('Bu hesap admin yetkisine sahip değil.');
      }
    } catch (err: any) {
      setError('Google ile giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">StudyKo yönetim paneline hoş geldiniz</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="label-primary">
                <FiMail className="inline w-4 h-4 mr-2" />
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-primary"
                placeholder="admin@studyko.app"
                required
              />
            </div>

            <div>
              <label className="label-primary">
                <FiLock className="inline w-4 h-4 mr-2" />
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Google ile Giriş Yap
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Sadece yetkili admin hesapları giriş yapabilir
        </p>
      </div>
    </div>
  );
}

