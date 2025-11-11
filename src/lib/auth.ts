import { adminAuth } from './firebase-admin';

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
}

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    console.log('Admin token doğrulama başladı...');
    console.log('Admin email listesi:', ADMIN_EMAILS);
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    const email = decodedToken.email;
    
    console.log('Token decode edildi, email:', email);

    if (!email) {
      console.error('Token\'da email bulunamadı');
      return null;
    }
    
    if (!ADMIN_EMAILS.includes(email)) {
      console.error('Email admin listesinde değil:', email);
      console.error('Admin listesi:', ADMIN_EMAILS);
      return null;
    }

    console.log('Admin doğrulandı:', email);
    return {
      uid: decodedToken.uid,
      email: email,
      displayName: decodedToken.name,
      isAdmin: true,
    };
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return null;
  }
}

export async function checkIsAdmin(email: string): Promise<boolean> {
  return ADMIN_EMAILS.includes(email);
}

