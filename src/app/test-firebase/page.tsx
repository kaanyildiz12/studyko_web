'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, getDocs } from 'firebase/firestore';

export default function TestFirebasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [collections, setCollections] = useState<string[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Firestore bağlantısı
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        
        setStatus('success');
        setMessage(`Firebase bağlantısı başarılı! ${snapshot.size} kullanıcı bulundu.`);
        setCollections(['users', 'rooms', 'dailyStats', 'leaderboard']);
      } catch (error: any) {
        setStatus('error');
        setMessage(`Firebase bağlantı hatası: ${error.message}`);
        console.error('Firebase error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Bağlantı Testi</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Bağlantı Durumu</h2>
          
          {status === 'loading' && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span>Firebase bağlantısı test ediliyor...</span>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex items-center text-green-600">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{message}</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center text-red-600">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{message}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Firebase Yapılandırması</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Project ID:</span>
              <span className="text-gray-600">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Bulunamadı'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Auth Domain:</span>
              <span className="text-gray-600">{process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Bulunamadı'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Storage Bucket:</span>
              <span className="text-gray-600">{process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Bulunamadı'}</span>
            </div>
          </div>
          
          {status === 'success' && collections.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-2">Mevcut Koleksiyonlar:</h3>
              <div className="flex flex-wrap gap-2">
                {collections.map((col) => (
                  <span key={col} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
