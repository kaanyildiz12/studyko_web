# 🔥 Firebase API Key Hatası - Çözüm

## ❌ Hata:
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

## ✅ Çözüm: Vercel'e Firebase Client Ortam Değişkenlerini Ekleyin

### 📍 Nereden Bulacaksın?

1. **Firebase Console'a Git:** [console.firebase.google.com](https://console.firebase.google.com)
2. **Projen:** `studypomodoro-f9da1`
3. **⚙️ Project Settings** → **General** → Scroll down
4. **"Your apps"** bölümünde **Web** uygulamanı bul
5. **Config** butonuna tıkla

### 🔑 Vercel'e Eklenecek Ortam Değişkenleri:

```bash
# Firebase Client Configuration (Public - Güvenli)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studypomodoro-f9da1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studypomodoro-f9da1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studypomodoro-f9da1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...
```

### 📝 Vercel'de Nasıl Eklerim?

1. [Vercel Dashboard](https://vercel.com/dashboard) → **studyko_web**
2. **Settings** → **Environment Variables**
3. Her değişken için **Add New** tıkla:
   - Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: Firebase'den kopyala
   - Environments: ✅ Production, ✅ Preview, ✅ Development
4. **Tüm değişkenler için tekrarla** (7 tane)
5. **Save**

### 🎯 Kontrol Listesi:

- [ ] Firebase Admin (Server-side):
  - ✅ `FIREBASE_SERVICE_ACCOUNT_KEY` (Base64) - **ZATEN EKLENDİ**
  
- [ ] Firebase Client (Public):
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### ⚠️ Önemli Notlar:

1. **`NEXT_PUBLIC_` prefix'li değişkenler PUBLIC'tir** - Bu normal ve güvenlidir
2. Firebase bu değişkenlerin client-side'da kullanılmasına izin verir
3. Güvenlik Firebase Rules ile sağlanır, API key ile değil
4. **Ortam değişkenlerini ekledikten sonra Vercel otomatik olarak yeniden deploy edecek**

### 🚀 Son Adımlar:

1. Tüm `NEXT_PUBLIC_*` değişkenlerini ekle
2. Vercel'de Redeploy başlayacak (~3 dakika)
3. Build başarılı olacak ✅
4. Site yayında! 🎉

---

**Not:** Dynamic rendering sorunu zaten düzeltildi! Sadece Firebase Client config kaldı.
