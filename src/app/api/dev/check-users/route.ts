import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const usersSnapshot = await adminDb.collection('users').limit(10).get();
    
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      totalCount: usersSnapshot.size,
      users,
      message: `Toplam ${usersSnapshot.size} kullanıcı bulundu (ilk 10 gösteriliyor)`
    });
  } catch (error: any) {
    console.error('Error checking users:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
