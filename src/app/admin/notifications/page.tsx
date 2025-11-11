'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiBell, FiSend, FiUsers, FiFilter, FiClock } from 'react-icons/fi';
import { auth } from '@/lib/firebase-client';

export default function NotificationsPage() {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    targetType: 'all', // all, premium, specific
    targetUsers: '',
    scheduleType: 'now', // now, scheduled
    scheduledTime: '',
    priority: 'normal', // low, normal, high
    deepLink: '', // Deep link for navigation (e.g., premium, room, timer, profile, leaderboard)
    deepLinkData: '', // Additional data for deep link (e.g., room ID)
  });

  const [loading, setLoading] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchSentNotifications();
  }, []);

  const handleSendNotification = async () => {
    if (!notification.title || !notification.message) {
      alert('Başlık ve mesaj gereklidir!');
      return;
    }

    try {
      setLoading(true);
      
      const user = auth.currentUser;
      if (!user) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const idToken = await user.getIdToken();
      
      console.log('Bildirim gönderiliyor:', notification);
      
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(notification),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Bildirim sonucu:', result);
        
        // Show detailed success message
        const successMessage = result.message || `Bildirim ${result.recipientCount} kullanıcıya gönderildi!`;
        alert(successMessage);
        
        setNotification({
          title: '',
          message: '',
          targetType: 'all',
          targetUsers: '',
          scheduleType: 'now',
          scheduledTime: '',
          priority: 'normal',
          deepLink: '',
          deepLinkData: '',
        });
        fetchSentNotifications();
      } else {
        const errorData = await response.json();
        console.error('Bildirim hatası:', errorData);
        alert(`Bildirim gönderilemedi: ${errorData.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert(`Bir hata oluştu: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentNotifications = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/admin/notifications', {
        headers: { 
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSentNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bildirim Gönder</h1>
          <p className="text-gray-600 mt-1">Kullanıcılara push bildirimi gönder</p>
        </div>

        {/* Quick Templates */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Hızlı Şablonlar</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setNotification({
                ...notification,
                title: '💎 Premium\'da Size Özel İndirim!',
                message: 'Premium üyelikte %30 indirim! Tüm özelliklerin kilidini aç ve çalışmalarını bir üst seviyeye taşı. Hemen tıkla!',
                deepLink: 'premium',
                priority: 'high',
                targetType: 'free',
              })}
              className="px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              💎 Premium İndirim
            </button>
            <button
              onClick={() => setNotification({
                ...notification,
                title: '🏠 Yeni Odalar Seni Bekliyor!',
                message: 'Arkadaşlarınla birlikte çalış! Yeni oluşturulan odalara katıl ve motivasyonunu artır.',
                deepLink: 'rooms',
                priority: 'normal',
                targetType: 'all',
              })}
              className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              🏠 Oda Davet
            </button>
            <button
              onClick={() => setNotification({
                ...notification,
                title: '⏱️ Çalışma Zamanı!',
                message: 'Bugün henüz hiç pomodoro yapmadın. Hadi başlayalım!',
                deepLink: 'timer',
                priority: 'normal',
                targetType: 'inactive',
              })}
              className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              ⏱️ Timer Hatırlatma
            </button>
            <button
              onClick={() => setNotification({
                ...notification,
                title: '🏆 Sıralamada Yükseliyorsun!',
                message: 'Lider tablosunda üst sıralara yaklaştın! İlerlemeni görüntülemek için tıkla.',
                deepLink: 'leaderboard',
                priority: 'normal',
                targetType: 'active',
              })}
              className="px-3 py-2 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              🏆 Sıralama
            </button>
            <button
              onClick={() => setNotification({
                ...notification,
                title: '🎖️ Yeni Başarım Kazandın!',
                message: 'Tebrikler! Yeni bir başarımın kilidi açıldı. Hemen kontrol et!',
                deepLink: 'achievements',
                priority: 'high',
                targetType: 'all',
              })}
              className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              🎖️ Başarım
            </button>
          </div>
        </div>

        {/* Send Notification Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Message Content */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Bildirim İçeriği</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={notification.title}
                    onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                    placeholder="Bildirim başlığı"
                    className="input-primary"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.title.length}/50 karakter
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    value={notification.message}
                    onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                    placeholder="Bildirim mesajı"
                    className="input-primary min-h-32"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.message.length}/200 karakter
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öncelik
                  </label>
                  <select
                    value={notification.priority}
                    onChange={(e) => setNotification({ ...notification, priority: e.target.value })}
                    className="input-primary"
                  >
                    <option value="low">Düşük</option>
                    <option value="normal">Normal</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tıklandığında Yönlendir
                  </label>
                  <select
                    value={notification.deepLink}
                    onChange={(e) => setNotification({ ...notification, deepLink: e.target.value })}
                    className="input-primary"
                  >
                    <option value="">Yönlendirme Yok</option>
                    <option value="premium">💎 Premium Ekranı</option>
                    <option value="rooms">🏠 Odalar Ekranı</option>
                    <option value="timer">⏱️ Timer Ekranı</option>
                    <option value="profile">👤 Profil Ekranı</option>
                    <option value="leaderboard">🏆 Sıralama Ekranı</option>
                    <option value="achievements">🎖️ Başarımlar</option>
                    <option value="statistics">📊 İstatistikler</option>
                    <option value="settings">⚙️ Ayarlar</option>
                  </select>
                  {notification.deepLink && (
                    <p className="text-xs text-blue-600 mt-1">
                      ℹ️ Kullanıcı bildirime tıkladığında {
                        notification.deepLink === 'premium' ? 'Premium ekranına' :
                        notification.deepLink === 'rooms' ? 'Odalar ekranına' :
                        notification.deepLink === 'timer' ? 'Timer ekranına' :
                        notification.deepLink === 'profile' ? 'Profil ekranına' :
                        notification.deepLink === 'leaderboard' ? 'Sıralama ekranına' :
                        notification.deepLink === 'achievements' ? 'Başarımlar ekranına' :
                        notification.deepLink === 'statistics' ? 'İstatistikler ekranına' :
                        notification.deepLink === 'settings' ? 'Ayarlar ekranına' : ''
                      } yönlendirilecek
                    </p>
                  )}
                </div>

                {notification.deepLink === 'rooms' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oda ID (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={notification.deepLinkData}
                      onChange={(e) => setNotification({ ...notification, deepLinkData: e.target.value })}
                      placeholder="Belirli bir odaya yönlendirmek için oda ID girin"
                      className="input-primary"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Target Selection */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FiUsers className="w-5 h-5 mr-2" />
                Hedef Kitle
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kime Gönderilsin?
                  </label>
                  <select
                    value={notification.targetType}
                    onChange={(e) => setNotification({ ...notification, targetType: e.target.value })}
                    className="input-primary"
                  >
                    <option value="all">Tüm Kullanıcılar</option>
                    <option value="premium">Sadece Premium Üyeler</option>
                    <option value="free">Sadece Ücretsiz Kullanıcılar</option>
                    <option value="active">Aktif Kullanıcılar (Son 7 gün)</option>
                    <option value="inactive">Pasif Kullanıcılar (30+ gün)</option>
                    <option value="specific">Belirli Kullanıcılar</option>
                  </select>
                </div>

                {notification.targetType === 'specific' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kullanıcı E-postaları (virgülle ayırın)
                    </label>
                    <textarea
                      value={notification.targetUsers}
                      onChange={(e) => setNotification({ ...notification, targetUsers: e.target.value })}
                      placeholder="user1@email.com, user2@email.com"
                      className="input-primary min-h-24"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FiClock className="w-5 h-5 mr-2" />
                Zamanlama
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ne Zaman Gönderilsin?
                  </label>
                  <select
                    value={notification.scheduleType}
                    onChange={(e) => setNotification({ ...notification, scheduleType: e.target.value })}
                    className="input-primary"
                  >
                    <option value="now">Hemen Gönder</option>
                    <option value="scheduled">Zamanla</option>
                  </select>
                </div>

                {notification.scheduleType === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gönderim Zamanı
                    </label>
                    <input
                      type="datetime-local"
                      value={notification.scheduledTime}
                      onChange={(e) => setNotification({ ...notification, scheduledTime: e.target.value })}
                      className="input-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview & Send */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="card sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Önizleme</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <FiBell className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.title || 'Bildirim Başlığı'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message || 'Bildirim mesajınız burada görünecek...'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Şimdi</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hedef Kitle:</span>
                  <span className="font-medium text-gray-900">
                    {notification.targetType === 'all' && 'Tüm Kullanıcılar'}
                    {notification.targetType === 'premium' && 'Premium Üyeler'}
                    {notification.targetType === 'free' && 'Ücretsiz Kullanıcılar'}
                    {notification.targetType === 'active' && 'Aktif Kullanıcılar'}
                    {notification.targetType === 'inactive' && 'Pasif Kullanıcılar'}
                    {notification.targetType === 'specific' && 'Belirli Kullanıcılar'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Öncelik:</span>
                  <span className={`font-medium ${
                    notification.priority === 'high' ? 'text-red-600' :
                    notification.priority === 'normal' ? 'text-gray-900' :
                    'text-gray-500'
                  }`}>
                    {notification.priority === 'high' && 'Yüksek'}
                    {notification.priority === 'normal' && 'Normal'}
                    {notification.priority === 'low' && 'Düşük'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zamanlama:</span>
                  <span className="font-medium text-gray-900">
                    {notification.scheduleType === 'now' ? 'Hemen' : 'Zamanlanmış'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSendNotification}
                disabled={loading || !notification.title || !notification.message}
                className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4 mr-2" />
                    Bildirimi Gönder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sent Notifications History */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Gönderilen Bildirimler</h2>
          
          {sentNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiBell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Henüz bildirim gönderilmedi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentNotifications.map((notif, idx) => (
                <div key={idx} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notif.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>Hedef: {notif.targetType}</span>
                      <span>•</span>
                      <span>Alıcı: {notif.recipientCount} kişi</span>
                      {notif.fcmSuccessCount !== undefined && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">FCM: {notif.fcmSuccessCount} başarılı</span>
                        </>
                      )}
                      {notif.fcmFailureCount !== undefined && notif.fcmFailureCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">{notif.fcmFailureCount} başarısız</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{new Date(notif.sentAt).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                  <span className={`badge-${notif.status === 'sent' ? 'success' : 'warning'}`}>
                    {notif.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
