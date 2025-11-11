'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-gray-600 mb-8">
            <strong>Son Güncelleme:</strong> 3 Kasım 2025<br />
            <strong>Yürürlük Tarihi:</strong> 3 Kasım 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Genel Bilgiler</h2>
              <p className="text-gray-700">
                StudyKo ("biz", "uygulama"), kullanıcılarının gizliliğini korumayı taahhüt eder. 
                Bu Gizlilik Politikası, uygulamamızı kullanırken toplanan, kullanılan ve paylaşılan 
                kişisel verileri açıklar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Toplanan Veriler</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Hesap Bilgileri</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>E-posta adresi:</strong> Hesap oluşturma ve kimlik doğrulama için</li>
                <li><strong>Profil fotoğrafı:</strong> Profil sayfası ve sosyal özellikler için (isteğe bağlı)</li>
                <li><strong>Kullanıcı adı:</strong> Uygulamada görüntülenmek için</li>
                <li><strong>Google Sign-In:</strong> Google hesabı ile giriş yaparsanız, Google'dan alınan temel profil bilgileri</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Kullanım Verileri</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Çalışma süreleri:</strong> Pomodoro oturumlarınızın süresi ve sayısı</li>
                <li><strong>İstatistikler:</strong> Günlük, haftalık, aylık çalışma istatistikleri</li>
                <li><strong>Başarımlar:</strong> Kazanılan rozetler ve başarımlar</li>
                <li><strong>Oda Katılımları:</strong> Katıldığınız çalışma odaları ve aktiviteler</li>
                <li><strong>Mesajlar:</strong> Oda içi mesajlaşma verileri</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Teknik Veriler</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Cihaz bilgisi:</strong> İşletim sistemi, uygulama sürümü</li>
                <li><strong>FCM Token:</strong> Bildirim göndermek için Firebase Cloud Messaging token'ı</li>
                <li><strong>Analytics:</strong> Firebase Analytics ile anonim kullanım istatistikleri</li>
                <li><strong>Crash raporları:</strong> Firebase Crashlytics ile hata raporları</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Verilerin Kullanım Amaçları</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Temel Hizmet Sunumu</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Hesap yönetimi ve kimlik doğrulama</li>
                <li>Çalışma süreleri ve istatistiklerin kaydedilmesi</li>
                <li>Başarımların takibi</li>
                <li>Sosyal özelliklerin (takip, odalar, mesajlaşma) sağlanması</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Bildirimler</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Oda davetleri</li>
                <li>Mesaj bildirimleri</li>
                <li>Başarım kazanımları</li>
                <li>Streak uyarıları</li>
                <li>Günlük motivasyon mesajları</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Veri Saklama</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Konum</h3>
              <p className="text-gray-700">
                Tüm veriler <strong>Firebase Firestore</strong> (Google Cloud Platform) üzerinde saklanır 
                ve <strong>Avrupa (europe-west1)</strong> bölgesinde barındırılır.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Süre</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Aktif hesaplar:</strong> Veriler hesap silinene kadar saklanır</li>
                <li><strong>Silinen hesaplar:</strong> Veriler 30 gün içinde kalıcı olarak silinir</li>
                <li><strong>Anonim analytics:</strong> 14 ay sonra otomatik silinir</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Güvenlik</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Firebase Authentication ile güvenli kimlik doğrulama</li>
                <li>Firestore Security Rules ile veri erişim kontrolü</li>
                <li>HTTPS ile şifrelenmiş veri iletimi</li>
                <li>Düzenli güvenlik güncellemeleri</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Veri Paylaşımı</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Üçüncü Taraf Servisler</h3>
              <p className="text-gray-700 mb-4"><strong>Firebase (Google)</strong></p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Authentication (Kimlik doğrulama)</li>
                <li>Firestore (Veritabanı)</li>
                <li>Cloud Messaging (Bildirimler)</li>
                <li>Analytics (İstatistikler)</li>
                <li>Crashlytics (Hata raporları)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Paylaşılmayan Veriler</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Verileriniz <strong>ASLA</strong> reklam şirketleri ile paylaşılmaz</li>
                <li>Verileriniz <strong>ASLA</strong> üçüncü taraflara satılmaz</li>
                <li>E-posta adresiniz <strong>ASLA</strong> pazarlama listelerine eklenmez</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Kullanıcı Hakları</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Veri Görüntüleme</h3>
              <p className="text-gray-700">
                Uygulama içi "Profil" sayfasından tüm verilerinizi görüntüleyebilirsiniz.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Veri Silme</h3>
              <p className="text-gray-700 mb-2"><strong>Hesap Silme:</strong></p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Ayarlar → Hesap → "Hesabımı Sil"</li>
                <li>Tüm verileriniz 30 gün içinde kalıcı olarak silinir</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Veri İndirme (GDPR Hakkı)</h3>
              <p className="text-gray-700">
                E-posta ile talep ederek verilerinizi JSON formatında indirebilirsiniz:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>İletişim:</strong> support@studyko.app</li>
                <li><strong>Süre:</strong> 30 gün içinde yanıt</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Çocukların Gizliliği</h2>
              <p className="text-gray-700">
                Uygulamamız <strong>13 yaş ve üzeri</strong> kullanıcılar içindir. 13 yaşın altındaki 
                kullanıcılardan bilerek veri toplamıyoruz. Eğer bir ebeveyn/vasi, çocuğunun uygulamamızı 
                kullandığını fark ederse, lütfen bizimle iletişime geçin.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. İletişim</h2>
              <p className="text-gray-700">
                Gizlilik ile ilgili sorularınız için:
              </p>
              <ul className="list-none space-y-2 text-gray-700 mt-4">
                <li><strong>E-posta:</strong> <a href="mailto:privacy@studyko.app" className="text-primary-600 hover:underline">privacy@studyko.app</a></li>
                <li><strong>Destek:</strong> <a href="mailto:support@studyko.app" className="text-primary-600 hover:underline">support@studyko.app</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. GDPR (Avrupa Birliği)</h2>
              <p className="text-gray-700 mb-4">Avrupa Birliği vatandaşları için ek haklar:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Veri taşınabilirliği hakkı:</strong> Verilerinizi başka bir servise aktarabilirsiniz</li>
                <li><strong>İtiraz hakkı:</strong> Veri işlemeye itiraz edebilirsiniz</li>
                <li><strong>Unutulma hakkı:</strong> Verilerinizin silinmesini talep edebilirsiniz</li>
                <li><strong>Düzeltme hakkı:</strong> Yanlış verilerin düzeltilmesini isteyebilirsiniz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. KVKK (Türkiye)</h2>
              <p className="text-gray-700 mb-4">Türkiye vatandaşları için (KVKK - Kişisel Verilerin Korunması Kanunu):</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Kişisel verileriniz 6698 sayılı KVKK uyarınca işlenmektedir</li>
                <li>KVKK kapsamında tüm haklarınızı kullanabilirsiniz</li>
              </ul>
            </section>

            <hr className="my-8" />

            <p className="text-gray-600 text-center">
              <strong>Kabul Tarihi:</strong> Uygulamayı kullanarak bu Gizlilik Politikasını kabul etmiş sayılırsınız.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

