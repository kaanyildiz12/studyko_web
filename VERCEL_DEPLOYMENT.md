# Vercel'e Deployment Talimatları

## 🚨 ÖNEMLİ: Ortam Değişkenlerini Ayarlama

Vercel'de projenizi deploy etmeden önce aşağıdaki ortam değişkenlerini **mutlaka** ayarlamanız gerekmektedir.

### 1. Vercel Dashboard'a Gidin
1. [Vercel Dashboard](https://vercel.com/dashboard) adresine gidin
2. Projenizi seçin
3. **Settings** → **Environment Variables** bölümüne gidin

### 2. Aşağıdaki Ortam Değişkenlerini Ekleyin

#### Firebase Admin SDK (Server-side - GİZLİ)
```
FIREBASE_ADMIN_PROJECT_ID=studypomodoro-f9da1
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@studypomodoro-f9da1.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY=
```

**⚠️ PRIVATE_KEY İÇİN ÖNEMLİ NOT:**
Private key'i eklerken aşağıdaki formatta ekleyin (çift tırnak içinde):
```
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCymNusPW2jY7Lm...\n-----END PRIVATE KEY-----\n"
```

**VEYA** daha güvenli yöntem olarak, Firebase Service Account JSON dosyasını base64'e çevirip tek bir değişken olarak kullanabilirsiniz:
```
FIREBASE_SERVICE_ACCOUNT_KEY=<base64-encoded-json>
```

#### Firebase Client Configuration (Public)
```
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studypomodoro-f9da1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studypomodoro-f9da1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studypomodoro-f9da1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your-measurement-id>
```

#### NextAuth (Opsiyonel)
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate-a-random-secret>
```

### 3. Ortam Değişkeni Scope'ları
Her değişken için doğru environment'ları seçin:
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Yeniden Deploy Edin
Ortam değişkenlerini ekledikten sonra:
```bash
git commit --allow-empty -m "trigger deployment"
git push origin master
```

## 🔒 Güvenlik Önerileri

1. **ASLA** Firebase service account JSON dosyasını git'e commit etmeyin
2. `.gitignore` dosyasına şunları eklediğinizden emin olun:
   ```
   .env.local
   .env
   *firebase*adminsdk*.json
   ```
3. Private key'leri Vercel'in Environment Variables bölümünde saklayın
4. Production için mutlaka `NEXTAUTH_SECRET` kullanın

## 📝 Service Account JSON'ı Base64'e Çevirme (Alternatif Yöntem)

Windows PowerShell:
```powershell
$content = Get-Content studypomodoro-f9da1-firebase-adminsdk-fbsvc-81a82502d0.json -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Set-Clipboard
```

Sonra Vercel'de:
```
FIREBASE_SERVICE_ACCOUNT_KEY=<paste-base64-string>
```

## 🐛 Sorun Giderme

Hala "project_id" hatası alıyorsanız:
1. Vercel Dashboard'da tüm değişkenlerin doğru girildiğinden emin olun
2. Özellikle `FIREBASE_ADMIN_PRIVATE_KEY` değişkeninin **çift tırnak içinde** ve `\n` karakterlerinin korunduğundan emin olun
3. Değişiklikleri kaydettikten sonra projeyi yeniden deploy edin
4. Vercel build loglarını kontrol edin: "Missing Firebase Admin credentials" mesajını arayın

## ✅ Test Etme

Deploy sonrası test için:
1. `https://your-domain.vercel.app/api/admin/verify` endpoint'ini ziyaret edin
2. Firebase bağlantısının çalıştığını doğrulayın
3. Build log'larında "Firebase Admin initialized successfully" mesajını arayın
