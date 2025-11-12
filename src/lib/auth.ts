import { adminAuth } from './firebase-admin';

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
}

// Get admin emails from environment variable
// Format: email1@example.com,email2@example.com,email3@example.com
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    console.log('🔐 Admin token doğrulama başladı...');
    console.log('📧 Admin email sayısı:', ADMIN_EMAILS.length);
    
    if (ADMIN_EMAILS.length === 0) {
      console.error('⚠️ ADMIN_EMAILS ortam değişkeni tanımlı değil veya boş!');
      console.error('💡 Vercel Settings → Environment Variables → ADMIN_EMAILS ekleyin');
      return null;
    }
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    const email = decodedToken.email?.toLowerCase();
    
    console.log('✉️ Token decode edildi, email:', email);

    if (!email) {
      console.error('❌ Token\'da email bulunamadı');
      return null;
    }
    
    if (!ADMIN_EMAILS.includes(email)) {
      console.error('❌ Email admin listesinde değil:', email);
      console.error('📋 Kayıtlı admin sayısı:', ADMIN_EMAILS.length);
      console.error('💡 Bu emaili admin yapmak için Vercel\'de ADMIN_EMAILS değişkenine ekleyin');
      return null;
    }

    console.log('✅ Admin doğrulandı:', email);
    return {
      uid: decodedToken.uid,
      email: email,
      displayName: decodedToken.name,
      isAdmin: true,
    };
  } catch (error) {
    console.error('💥 Error verifying admin token:', error);
    return null;
  }
}

export async function checkIsAdmin(email: string): Promise<boolean> {
  return ADMIN_EMAILS.includes(email);
}

