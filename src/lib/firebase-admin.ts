import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Method 1: Use base64 encoded service account (recommended for Vercel)
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountBase64) {
      const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountBase64, 'base64').toString('utf8')
      );
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      });
      
      console.log('Firebase Admin initialized successfully (base64 method)');
    } else {
      // Method 2: Use individual environment variables
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

      // Validate required environment variables
      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          'Missing Firebase Admin credentials. Please check environment variables: ' +
          `FIREBASE_ADMIN_PROJECT_ID=${!!projectId}, ` +
          `FIREBASE_ADMIN_CLIENT_EMAIL=${!!clientEmail}, ` +
          `FIREBASE_ADMIN_PRIVATE_KEY=${!!privateKey}`
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
      
      console.log('Firebase Admin initialized successfully (env vars method)');
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    throw error; // Re-throw to prevent app from starting with invalid config
  }
}

// Export getters that check if admin is initialized
export const getAdminAuth = () => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin is not initialized');
  }
  return admin.auth();
};

export const getAdminDb = () => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin is not initialized');
  }
  return admin.firestore();
};

export const getAdminMessaging = () => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin is not initialized');
  }
  return admin.messaging();
};

// Legacy exports for backward compatibility
export const adminAuth = admin.apps.length ? admin.auth() : null as any;
export const adminDb = admin.apps.length ? admin.firestore() : null as any;
export const adminMessaging = admin.apps.length ? admin.messaging() : null as any;
export default admin;

