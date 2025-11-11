'use client';

import { useState } from 'react';
import { adminDb } from '@/lib/firebase-admin';

export default function TestNotificationPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const createTestUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dev/create-test-user', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dev/check-users');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bildirim Test Sayfası</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex gap-4">
            <button
              onClick={checkUsers}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Kullanıcıları Kontrol Et
            </button>
            
            <button
              onClick={createTestUser}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Test Kullanıcısı Oluştur
            </button>
          </div>

          {result && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Sonuç:</h2>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                {result}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Not:</h3>
            <p className="text-yellow-700 text-sm">
              Bu sayfa sadece development amaçlıdır. Production'da kaldırılmalıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
