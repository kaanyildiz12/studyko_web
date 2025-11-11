# StudyKo Web Panel

StudyKo uygulaması için resmi web sitesi ve admin yönetim paneli.

## 🌟 Özellikler

### Landing Page (Ana Sayfa)
- ✅ Modern ve responsive tasarım
- ✅ Özellikler showcase
- ✅ Kullanıcı yorumları (testimonials)
- ✅ Fiyatlandırma planları
- ✅ Nasıl çalışır bölümü
- ✅ Privacy Policy ve Terms of Service sayfaları

### Admin Paneli
- ✅ Dashboard (İstatistikler ve genel bakış)
- ✅ Kullanıcı Yönetimi (ban, premium, silme)
- ✅ Oda Yönetimi (moderasyon, silme)
- ✅ Şikayet Yönetimi (onaylama, reddetme)
- ✅ Premium Yönetimi (gelir analizi, abonelikler)
- ✅ Firebase Authentication entegrasyonu
- ✅ Admin yetkilendirme sistemi

## 🛠️ Teknolojiler

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Firebase Admin SDK
- **Authentication:** Firebase Auth
- **Database:** Cloud Firestore
- **Charts:** Recharts
- **Icons:** React Icons

## 📦 Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd web-panel
npm install
```

### 2. Environment Variables Ayarla

`.env.local` dosyası oluştur:

```bash
# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_PROJECT_ID=studypomodoro-f9da1
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@studypomodoro-f9da1.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client SDK (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studypomodoro-f9da1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studypomodoro-f9da1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studypomodoro-f9da1.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Admin Users (Comma separated emails)
ADMIN_EMAILS=admin@studyko.app,support@studyko.app

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://studyko.app
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/studyko
NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=com.studyko.app
```

### 3. Firebase Admin SDK Anahtarı

1. Firebase Console → Project Settings → Service Accounts
2. "Generate New Private Key" butonuna tıkla
3. İndirilen JSON dosyasından aşağıdaki bilgileri kopyala:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

### 4. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Tarayıcıda açın: [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Önerilen)

1. GitHub'a push yap
2. [Vercel](https://vercel.com) hesabına giriş yap
3. "Import Project" → GitHub repository'sini seç
4. Environment variables'ı ekle
5. Deploy!

```bash
# Alternatif: Vercel CLI ile deploy
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# dist klasörünü Netlify'a yükle
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 📁 Proje Yapısı

```
web-panel/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel sayfaları
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── users/         # Kullanıcı yönetimi
│   │   │   ├── rooms/         # Oda yönetimi
│   │   │   ├── reports/       # Şikayet yönetimi
│   │   │   ├── premium/       # Premium yönetimi
│   │   │   └── login/         # Admin login
│   │   ├── api/               # API Routes
│   │   │   └── admin/         # Admin API endpoints
│   │   ├── privacy/           # Privacy Policy
│   │   ├── terms/             # Terms of Service
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── admin/             # Admin components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── lib/                   # Utilities
│   │   ├── firebase-admin.ts  # Firebase Admin SDK
│   │   ├── firebase-client.ts # Firebase Client SDK
│   │   └── auth.ts            # Auth utilities
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🔐 Admin Erişimi

Admin paneline erişmek için:

1. `/admin/login` sayfasına git
2. Admin e-posta ve şifre ile giriş yap
3. E-posta adresi `ADMIN_EMAILS` environment variable'ında olmalı

**Admin e-postaları eklemek için:**
```env
ADMIN_EMAILS=admin@studyko.app,moderator@studyko.app,support@studyko.app
```

## 🎨 Tasarım Sistemi

### Renkler
- **Primary:** #0284c7 (Mavi)
- **Accent:** #c026d3 (Mor)
- **Success:** #10b981 (Yeşil)
- **Warning:** #f59e0b (Turuncu)
- **Danger:** #ef4444 (Kırmızı)

### Componentler
- `btn-primary` - Ana butonlar
- `btn-secondary` - İkincil butonlar
- `btn-danger` - Tehlikeli işlemler
- `card` - Kartlar
- `badge-*` - Etiketler
- `table-*` - Tablolar

## 📊 API Endpoints

### Stats
- `GET /api/admin/stats` - Genel istatistikler

### Users
- `GET /api/admin/users` - Kullanıcıları listele
- `PATCH /api/admin/users` - Kullanıcı güncelle (ban, premium, delete)

### Rooms
- `GET /api/admin/rooms` - Odaları listele
- `PATCH /api/admin/rooms` - Oda güncelle (disable, enable)
- `DELETE /api/admin/rooms` - Oda sil

### Reports
- `GET /api/admin/reports` - Şikayetleri listele
- `PATCH /api/admin/reports` - Şikayeti güncelle (resolve, reject)

### Premium
- `GET /api/admin/premium` - Premium kullanıcıları ve analitikleri
- `POST /api/admin/premium` - Manuel premium ver

## 🧪 Test

```bash
npm run lint        # ESLint
npm run type-check  # TypeScript check
```

## 📝 Lisans

© 2025 StudyKo. Tüm hakları saklıdır.

## 📞 İletişim

- **Website:** https://studyko.app
- **Email:** support@studyko.app
- **Privacy:** privacy@studyko.app
- **Legal:** legal@studyko.app

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 🎯 Roadmap

- [ ] Google Analytics entegrasyonu
- [ ] Email bildirimleri (SendGrid/SES)
- [ ] Gelişmiş arama ve filtreleme
- [ ] Bulk işlemler
- [ ] Export/Import özellikleri
- [ ] Çoklu dil desteği (i18n)
- [ ] Dark mode
- [ ] Real-time updates (WebSocket)
