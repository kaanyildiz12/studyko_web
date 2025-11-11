# StudyKo Web Panel - Hızlı Başlangıç Rehberi

Bu rehber, StudyKo web panelini sıfırdan kurmak için gerekli tüm adımları içerir.

## 📋 Ön Gereksinimler

- Node.js 18+ kurulu olmalı
- Firebase projesi oluşturulmuş olmalı
- Firebase Admin SDK service account anahtarı
- Git kurulu olmalı

## 🚀 Hızlı Başlangıç (5 Dakika)

### 1. Projeyi Klonla

```bash
cd web-panel
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. Environment Variables Ayarla

`.env.local` dosyası oluştur (proje root'unda):

```bash
# Firebase Admin SDK (Backend)
FIREBASE_ADMIN_PROJECT_ID=studypomodoro-f9da1
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@studypomodoro-f9da1.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Firebase Client SDK (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studypomodoro-f9da1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studypomodoro-f9da1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studypomodoro-f9da1.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx

# Admin Users (virgülle ayrılmış)
ADMIN_EMAILS=admin@studyko.app,support@studyko.app

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/studyko
NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=com.studyko.app
```

### 4. Firebase Admin SDK Anahtarını Al

1. [Firebase Console](https://console.firebase.google.com) → Projenizi seçin
2. ⚙️ Settings → Service Accounts
3. "Generate New Private Key" butonuna tıklayın
4. İndirilen JSON dosyasını açın
5. Şu değerleri kopyalayın:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY` (dikkat: \n karakterlerini koru)

**Önemli:** Private key'i kopyalarken `\n` karakterlerini koruyun:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhki...\n-----END PRIVATE KEY-----\n"
```

### 5. Firebase Client SDK Ayarları

1. Firebase Console → ⚙️ Project Settings → General
2. "Your apps" bölümünde web app'inizi seçin (yoksa oluşturun)
3. Firebase SDK snippet → Config
4. Aşağıdaki değerleri `.env.local` dosyanıza ekleyin:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

### 6. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Tarayıcıda açın: **http://localhost:3000**

### 7. Admin Paneline Giriş Yap

1. http://localhost:3000/admin/login adresine git
2. `ADMIN_EMAILS` içinde belirttiğin bir e-posta ile giriş yap
3. Şifre: Firebase Authentication'da kayıtlı şifren

**İlk admin kullanıcısını oluşturmak için:**
```bash
# Firebase Console → Authentication → Users → Add User
# E-posta: admin@studyko.app
# Şifre: [güçlü bir şifre]
```

## 🧪 Test Et

### Landing Page
- ✅ http://localhost:3000 → Ana sayfa
- ✅ http://localhost:3000/privacy → Gizlilik politikası
- ✅ http://localhost:3000/terms → Kullanım şartları

### Admin Panel
- ✅ http://localhost:3000/admin/login → Giriş
- ✅ http://localhost:3000/admin → Dashboard
- ✅ http://localhost:3000/admin/users → Kullanıcı yönetimi
- ✅ http://localhost:3000/admin/rooms → Oda yönetimi
- ✅ http://localhost:3000/admin/reports → Şikayet yönetimi
- ✅ http://localhost:3000/admin/premium → Premium yönetimi

## 🔧 Sorun Giderme

### "Firebase Admin Error" Hatası

**Neden:** Private key yanlış formatlanmış olabilir.

**Çözüm:**
```bash
# Private key'i doğru formatta kopyala:
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhki...\n-----END PRIVATE KEY-----\n"
```

### "Unauthorized" Hatası (Admin Panel)

**Neden:** E-posta adresi `ADMIN_EMAILS` listesinde değil.

**Çözüm:**
```bash
# .env.local dosyasında
ADMIN_EMAILS=admin@studyko.app,youremail@example.com
```

### "Module not found" Hatası

**Çözüm:**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Port 3000 Zaten Kullanımda

**Çözüm:**
```bash
# Farklı port kullan
PORT=3001 npm run dev
```

### Environment Variables Çalışmıyor

**Not:** 
- `NEXT_PUBLIC_` prefix'i olan değişkenler browser'da çalışır
- Prefix olmayanlar sadece server-side'da çalışır
- `.env.local` değişikliklerinden sonra sunucuyu restart et

## 📁 Proje Yapısı

```
web-panel/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin panel sayfaları
│   │   ├── api/admin/          # API routes
│   │   ├── privacy/            # Privacy policy
│   │   ├── terms/              # Terms of service
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   ├── lib/                    # Utilities & Firebase
│   └── types/                  # TypeScript types
├── public/                     # Static files
├── .env.local                  # Environment variables (GİT'E EKLEME!)
├── package.json
├── next.config.js
└── tailwind.config.ts
```

## 🎨 Sayfalar

### Public Pages (Herkes Erişebilir)
- `/` - Landing page
- `/privacy` - Gizlilik politikası
- `/terms` - Kullanım şartları
- `/admin/login` - Admin giriş

### Admin Pages (Sadece Admin)
- `/admin` - Dashboard
- `/admin/users` - Kullanıcı yönetimi
- `/admin/rooms` - Oda yönetimi
- `/admin/reports` - Şikayet yönetimi
- `/admin/premium` - Premium yönetimi

## 🔐 Admin Kullanıcı Ekleme

### Yöntem 1: Firebase Console
1. Firebase Console → Authentication → Users
2. "Add User" butonuna tıkla
3. E-posta ve şifre gir
4. E-postayı `.env.local` → `ADMIN_EMAILS` listesine ekle

### Yöntem 2: Kod ile
```javascript
// Firebase Admin SDK ile
const admin = require('firebase-admin');
await admin.auth().createUser({
  email: 'newadmin@studyko.app',
  password: 'SecurePassword123!',
  displayName: 'New Admin'
});

// .env.local dosyasına ekle
ADMIN_EMAILS=admin@studyko.app,newadmin@studyko.app
```

## 🚀 Production'a Deploy

### Vercel (Önerilen)

1. GitHub'a push yap
2. [Vercel.com](https://vercel.com) → "Import Project"
3. GitHub repo seç
4. Environment Variables ekle (`.env.local` değerleri)
5. Deploy!

Detaylı deployment rehberi için: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 Sonraki Adımlar

1. ✅ Environment variables'ı ayarla
2. ✅ İlk admin kullanıcısını oluştur
3. ✅ Admin paneline giriş yap
4. ✅ Privacy Policy ve Terms'i güncelle (şirket bilgileri)
5. ✅ App Store ve Play Store linklerini ekle
6. ✅ Production'a deploy et
7. ✅ Custom domain ekle (studyko.app)
8. ✅ Google Analytics ekle (opsiyonel)

## 🆘 Yardım

Sorun yaşıyorsan:

1. **README.md** dosyasını oku
2. **DEPLOYMENT.md** dosyasını oku
3. Konsol'da hata mesajlarını kontrol et
4. E-posta gönder: support@studyko.app

## 🎉 Tebrikler!

Web panelin hazır! Şimdi:
- Landing page'i ziyaret et: http://localhost:3000
- Admin panele giriş yap: http://localhost:3000/admin/login
- Kullanıcıları yönet, odaları moderasyon et, premium analytics'i gör!

---

**StudyKo Web Panel v1.0.0**  
© 2025 StudyKo. Tüm hakları saklıdır.

