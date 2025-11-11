'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateRandomUsers = async (count: number) => {
    const names = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Veli', 'Zeynep', 'Elif', 'Can', 'Ece'];
    const surnames = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Öztürk', 'Aydın', 'Arslan', 'Özdemir'];
    
    const users = [];
    for (let i = 0; i < count; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const surname = surnames[Math.floor(Math.random() * surnames.length)];
      const email = `${name.toLowerCase()}${surname.toLowerCase()}${i}@test.com`;
      
      users.push({
        email,
        displayName: `${name} ${surname}`,
        isPremium: Math.random() > 0.7,
        isBanned: Math.random() > 0.9,
        totalMinutes: Math.floor(Math.random() * 10000),
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      });
    }
    return users;
  };

  const generateRandomRooms = async (count: number) => {
    const roomNames = [
      'Sınav Çalışma Odası',
      'YKS Hazırlık',
      'Programlama Öğreniyorum',
      'Kütüphane Sessizliği',
      'Gece Kuşları',
      'Sabah Motivasyonu',
      'Matematik Çalışma',
      'İngilizce Pratik',
      'Tez Yazıyorum',
      'KPSS Hazırlık',
    ];
    
    const categories = ['study', 'work', 'coding', 'reading', 'other'];
    
    const rooms = [];
    for (let i = 0; i < count; i++) {
      const name = roomNames[Math.floor(Math.random() * roomNames.length)];
      
      rooms.push({
        name: `${name} #${i + 1}`,
        description: `Test odası - ${name}`,
        hostId: `user_${Math.floor(Math.random() * 100)}`,
        hostName: 'Test Kullanıcı',
        memberIds: Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => `user_${i}`),
        isPrivate: Math.random() > 0.7,
        category: categories[Math.floor(Math.random() * categories.length)],
        createdAt: serverTimestamp(),
        lastActivityAt: serverTimestamp(),
        hasReports: Math.random() > 0.9,
        isDisabled: false,
      });
    }
    return rooms;
  };

  const seedDatabase = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      setMessage('Kullanıcılar oluşturuluyor...');
      const users = await generateRandomUsers(50);
      for (const user of users) {
        await addDoc(collection(db, 'users'), user);
      }
      
      setMessage('Odalar oluşturuluyor...');
      const rooms = await generateRandomRooms(30);
      for (const room of rooms) {
        await addDoc(collection(db, 'study_rooms'), room);
      }
      
      setMessage('✅ Başarılı! 50 kullanıcı ve 30 oda oluşturuldu.');
    } catch (error: any) {
      setMessage(`❌ Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🧪 Test Verisi Oluştur
            </h1>
            <p className="text-gray-600 mb-6">
              Bu sayfa development ve test amaçlıdır. Firebase veritabanınıza örnek kullanıcı ve oda verileri ekler.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>⚠️ Dikkat:</strong> Bu işlem Firebase'e veri yazacaktır. 
                Production ortamında kullanmayın!
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Oluşturulacak Veriler:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 50 test kullanıcısı</li>
                  <li>• 30 test odası</li>
                  <li>• Rastgele premium ve yasaklı durumlar</li>
                  <li>• Rastgele aktivite süreleri</li>
                </ul>
              </div>

              <button
                onClick={seedDatabase}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner w-5 h-5 mr-2"></div>
                    Oluşturuluyor...
                  </span>
                ) : (
                  'Test Verisi Oluştur'
                )}
              </button>

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.startsWith('✅') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : message.startsWith('❌')
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {message}
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Sonraki Adımlar:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1. Admin paneline giriş yap: <a href="/admin/login" className="text-primary-600 hover:underline">/admin/login</a></li>
                <li>2. Kullanıcı yönetimi sayfasını ziyaret et</li>
                <li>3. Oda yönetimi sayfasını kontrol et</li>
                <li>4. Dashboard istatistiklerini gör</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
