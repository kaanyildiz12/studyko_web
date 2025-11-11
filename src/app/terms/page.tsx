'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Kullanım Şartları</h1>
          <p className="text-gray-600 mb-8">
            <strong>Son Güncelleme:</strong> 3 Kasım 2025<br />
            <strong>Yürürlük Tarihi:</strong> 3 Kasım 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Kabul ve Onay</h2>
              <p className="text-gray-700">
                StudyKo uygulamasını ("Uygulama") kullanarak, bu Kullanım Şartlarını kabul etmiş 
                sayılırsınız. Bu şartları kabul etmiyorsanız, lütfen Uygulamayı kullanmayın.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Hizmet Tanımı</h2>
              <p className="text-gray-700">
                StudyKo, kullanıcıların Pomodoro tekniği ile çalışmalarını organize etmelerini, 
                sosyal odalar oluşturmalarını, istatistiklerini takip etmelerini ve başarımlar 
                kazanmalarını sağlayan bir mobil uygulamadır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Kullanıcı Hesapları</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Hesap Oluşturma</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Hesap oluşturmak için 13 yaş ve üzeri olmalısınız</li>
                <li>Doğru ve güncel bilgiler sağlamalısınız</li>
                <li>Hesap güvenliğinden siz sorumlusunuz</li>
                <li>Şifrenizi başkalarıyla paylaşmamalısınız</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Hesap Askıya Alma/Kapatma</h3>
              <p className="text-gray-700">
                Aşağıdaki durumlarda hesabınız askıya alınabilir veya kapatılabilir:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Bu şartları ihlal etmeniz</li>
                <li>Spam veya taciz içerikli davranışlar</li>
                <li>Başkalarının haklarını ihlal etmeniz</li>
                <li>Sahte bilgiler kullanmanız</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Kullanıcı Davranış Kuralları</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Yasak Davranışlar</h3>
              <p className="text-gray-700 mb-4">Aşağıdaki davranışlar kesinlikle yasaktır:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Taciz, zorbalık veya tehdit içerikli mesajlar</li>
                <li>Irkçı, ayrımcı veya nefret söylemi</li>
                <li>Cinsel içerikli veya uygunsuz mesajlar</li>
                <li>Spam veya reklam içerikli mesajlar</li>
                <li>Başka kullanıcıların kimliğine bürünme</li>
                <li>Sistemin güvenliğini tehdit etme</li>
                <li>Bot veya otomasyon kullanma</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Sosyal Odalar</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Oda içi sohbetlerde saygılı olun</li>
                <li>Başkalarının çalışmasını bölmeyin</li>
                <li>Oda kurallarına uyun</li>
                <li>Moderatörlerin uyarılarına uyun</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Fikri Mülkiyet Hakları</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Uygulama İçeriği</h3>
              <p className="text-gray-700">
                Uygulamanın tasarımı, logosu, grafikleri ve içeriği StudyKo'nun fikri mülkiyetidir. 
                İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Kullanıcı İçeriği</h3>
              <p className="text-gray-700">
                Yüklediğiniz içeriğin (profil fotoğrafı, mesajlar vb.) telif haklarına sahibi olduğunuzu 
                veya kullanma iznine sahip olduğunuzu garanti edersiniz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Premium Abonelik</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Ücretlendirme</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Premium abonelik aylık veya yıllık olarak faturalandırılır</li>
                <li>Ödeme App Store veya Google Play üzerinden yapılır</li>
                <li>Fiyatlar değişiklik gösterebilir (mevcut abonelere bildirim yapılır)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.2 İptal ve İade</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>İptal işlemleri App Store veya Google Play üzerinden yapılır</li>
                <li>İptal sonrası mevcut dönem sonuna kadar erişim devam eder</li>
                <li>İade politikası App Store/Google Play şartlarına tabidir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Hizmet Kesintileri</h2>
              <p className="text-gray-700">
                StudyKo, herhangi bir zamanda bakım, güncelleme veya teknik nedenlerle hizmeti 
                geçici olarak durdurma hakkını saklı tutar. Mümkün olduğunca önceden bildirim 
                yapılacaktır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Sorumluluk Sınırlaması</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">8.1 Hizmet "Olduğu Gibi" Sunulur</h3>
              <p className="text-gray-700">
                Uygulama "olduğu gibi" ve "kullanılabilir olduğu şekilde" sunulur. Hiçbir garanti 
                verilmez.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Veri Kaybı</h3>
              <p className="text-gray-700">
                Teknik arızalar, siber saldırılar veya diğer nedenlerle oluşabilecek veri kaybından 
                StudyKo sorumlu değildir. Düzenli yedekleme yapılması önerilir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Üçüncü Taraf Servisler</h2>
              <p className="text-gray-700">
                Uygulama, Firebase (Google), Google Sign-In gibi üçüncü taraf servisleri kullanır. 
                Bu servislerin kendi kullanım şartları ve gizlilik politikaları geçerlidir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Değişiklikler</h2>
              <p className="text-gray-700">
                Bu Kullanım Şartları zaman zaman güncellenebilir. Önemli değişiklikler için kullanıcılar 
                bilgilendirilecektir. Güncellemelerden sonra Uygulamayı kullanmaya devam etmeniz, 
                yeni şartları kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Uygulanacak Hukuk</h2>
              <p className="text-gray-700">
                Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar Türkiye mahkemelerinde 
                çözülecektir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">12. İletişim</h2>
              <p className="text-gray-700">
                Kullanım Şartları ile ilgili sorularınız için:
              </p>
              <ul className="list-none space-y-2 text-gray-700 mt-4">
                <li><strong>E-posta:</strong> <a href="mailto:legal@studyko.app" className="text-primary-600 hover:underline">legal@studyko.app</a></li>
                <li><strong>Destek:</strong> <a href="mailto:support@studyko.app" className="text-primary-600 hover:underline">support@studyko.app</a></li>
              </ul>
            </section>

            <hr className="my-8" />

            <p className="text-gray-600 text-center">
              <strong>Son Güncelleme:</strong> 3 Kasım 2025
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

