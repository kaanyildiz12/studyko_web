# 👥 Admin Kullanıcı Yönetimi

## 🚨 Sorun: "Bu hesap admin yetkisine sahip değil"

Admin kullanıcıları `ADMIN_EMAILS` ortam değişkeni ile tanımlanır.

## ✅ Çözüm: Vercel'de ADMIN_EMAILS Ekle

### 1️⃣ Admin Olacak Email Adreslerini Belirle

Örnek:
```
kaan@example.com
admin@studyko.com
yonetici@studyko.com
```

### 2️⃣ Vercel'e Ekle

1. **[Vercel Dashboard](https://vercel.com/dashboard)** → **studyko_web** projesine git
2. **Settings** → **Environment Variables**
3. **Add New** butonuna tıkla

**Değişken Bilgileri:**
```
Name:         ADMIN_EMAILS
Value:        kaan@example.com,admin@studyko.com,yonetici@studyko.com
Environments: ✅ Production
              ✅ Preview
              ✅ Development
```

**⚠️ ÖNEMLİ:**
- Email'ler **virgül** ile ayrılmalı (boşluk yok)
- Küçük/büyük harf önemli DEĞİL (otomatik lowercase yapılır)
- Boşluklar otomatik temizlenir

### 3️⃣ Kaydet ve Redeploy

1. **Save** butonuna tıkla
2. Vercel otomatik olarak yeniden deploy edecek (~2-3 dakika)
3. Build tamamlandıktan sonra admin kullanıcılar giriş yapabilir ✅

## 📝 Örnek Formatlar:

### ✅ Doğru:
```bash
ADMIN_EMAILS=user1@gmail.com,user2@gmail.com,user3@gmail.com
```

```bash
ADMIN_EMAILS=kaan.yildiz@studyko.com, admin@studyko.com, test@studyko.com
# Boşluklar otomatik temizlenir
```

### ❌ Yanlış:
```bash
ADMIN_EMAILS=user1@gmail.com; user2@gmail.com
# Noktalı virgül kullanma
```

```bash
ADMIN_EMAILS=user1@gmail.com user2@gmail.com
# Virgül eksik
```

## 🔍 Test Etme:

1. Admin paneline git: `https://your-domain.vercel.app/admin/login`
2. Firebase Auth ile giriş yap
3. Eğer email'in `ADMIN_EMAILS` listesindeyse → ✅ Giriş başarılı
4. Eğer listede değilse → ❌ "Bu hesap admin yetkisine sahip değil" hatası

## 🐛 Sorun Giderme:

### "Hala giriş yapamıyorum"

1. **Vercel Log'larını Kontrol Et:**
   - Vercel Dashboard → Projeniz → Deployments → Son deployment
   - Runtime Logs'a bak
   - Şu mesajları ara:
     ```
     📧 Admin email sayısı: 0  ← ADMIN_EMAILS boş!
     ❌ Email admin listesinde değil
     ```

2. **Email Kontrolü:**
   - Firebase'de giriş yaptığın email ile Vercel'deki `ADMIN_EMAILS` aynı mı?
   - Typo var mı?
   - Log'larda email'i görebilirsin

3. **Cache Temizleme:**
   - Tarayıcı cache'ini temizle
   - Incognito/Private mode'da dene
   - Farklı tarayıcıda dene

### "Vercel'de değişkeni ekledim ama çalışmıyor"

- **Redeploy oldu mu?** Settings'te değişiklik yaptıktan sonra otomatik redeploy olması gerekir
- **Doğru environment seçildi mi?** Production, Preview, Development hepsi seçili olmalı
- **Syntax doğru mu?** Virgüllerle ayrılmış, tırnak işareti YOK

## 🔒 Güvenlik Notları:

1. ✅ `ADMIN_EMAILS` server-side ortam değişkenidir (güvenli)
2. ✅ Client-side'da görünmez
3. ✅ Sadece backend'de kullanılır
4. ⚠️ Admin email'lerini public repository'ye COMMIT ETMEYİN
5. ✅ Ortam değişkeni olarak saklamak en güvenli yöntemdir

## 📊 Admin Ekleme/Çıkarma:

### Yeni Admin Eklemek:
1. Vercel → Settings → Environment Variables
2. `ADMIN_EMAILS` değişkenini bul
3. **Edit** butonuna tıkla
4. Yeni email'i virgülle ekle: `,yeni@email.com`
5. **Save** → Otomatik redeploy

### Admin Çıkarmak:
1. Aynı değişkeni edit et
2. İlgili email'i sil
3. **Save** → Otomatik redeploy

## 💡 Pro Tips:

1. **İlk Admin:** Kendi email'ini mutlaka ekle
2. **Test Kullanıcısı:** Test için ayrı bir email ekle
3. **Yedek Admin:** En az 2 admin email'i olsun
4. **Email Format:** Firebase'de kayıtlı email formatını kullan

---

## 🎯 Hızlı Checklist:

- [ ] Vercel'de `ADMIN_EMAILS` değişkeni oluşturuldu
- [ ] Email'ler virgülle ayrıldı
- [ ] Tüm environment'lar seçildi (Production, Preview, Development)
- [ ] Save yapıldı
- [ ] Redeploy tamamlandı (2-3 dakika)
- [ ] Admin login sayfasından test edildi
- [ ] Giriş başarılı ✅

**Sorun devam ederse Vercel Runtime Logs'ları paylaş, birlikte bakalım!**
