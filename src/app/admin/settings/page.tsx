'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiSave, FiDollarSign, FiAward, FiMail, FiDatabase, FiShield } from 'react-icons/fi';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Premium pricing
    monthlyPrice: 29,
    yearlyPrice: 200,
    
    // Application settings
    maintenanceMode: false,
    registrationEnabled: true,
    
    // Admin emails (display only)
    adminEmails: [
      'admin@studyko.app',
      'kaanyildiz12@gmail.com',
      'ismail.kmkl58@gmail.com',
      'kaanbaba58svs@gmail.com'
    ],
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // TODO: Implement save to Firebase Config collection
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    alert('Ayarlar kaydedildi! (Şu an sadece UI - backend entegrasyonu yapılacak)');
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
            <p className="text-gray-600 mt-1">Uygulama ve admin panel ayarları</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {/* Premium Pricing */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Premium Fiyatlandırma</h2>
              <p className="text-sm text-gray-600">Abonelik ücretlerini ayarlayın</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aylık Abonelik
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.monthlyPrice}
                  onChange={(e) => setSettings({ ...settings, monthlyPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2 text-gray-500">₺</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Mevcut fiyat: 29₺/ay</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yıllık Abonelik
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.yearlyPrice}
                  onChange={(e) => setSettings({ ...settings, yearlyPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2 text-gray-500">₺</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Mevcut fiyat: 200₺/yıl (17₺/ay)</p>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiDatabase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Uygulama Ayarları</h2>
              <p className="text-sm text-gray-600">Genel uygulama davranışları</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Bakım Modu</h3>
                <p className="text-sm text-gray-600">Uygulamayı geçici olarak devre dışı bırakın</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-gray-900">Yeni Kayıtlar</h3>
                <p className="text-sm text-gray-600">Yeni kullanıcı kayıtlarına izin verin</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.registrationEnabled}
                  onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Admin Emails */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FiShield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Admin Yetkileri</h2>
              <p className="text-sm text-gray-600">Admin paneline erişim yetkisi olan email adresleri</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              <strong>Not:</strong> Admin email listesi .env dosyasında tanımlıdır ve güvenlik nedeniyle buradan değiştirilemez.
            </p>
            <div className="space-y-2">
              {settings.adminEmails.map((email, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FiMail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 font-mono">{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FiAward className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Geliştirme Aşamasında</h3>
              <p className="text-sm text-blue-800">
                Bu ayarlar sayfası temel UI olarak hazırlanmıştır. Ayarları Firebase Config collection'ında 
                kaydetme ve okuma işlemleri için backend entegrasyonu yapılması gerekmektedir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
