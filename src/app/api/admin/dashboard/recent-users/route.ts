import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminToken } from '@/lib/auth';
import { cache } from '@/lib/firebase-cost-optimizer';

export async function GET(request: Request) {
  try {
    // ✅ Authentication check
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check cache first
    const cacheKey = 'dashboard_recent_users';
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // Get last 5 registered users
    const usersSnapshot = await adminDb
      .collection('users')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    const recentUsers = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        displayName: data.displayName || 'Unnamed',
        email: data.email || '',
        photoURL: data.photoURL || null,
        isPremium: data.isPremium || false,
        createdAt: data.createdAt?.toDate() || null,
      };
    });

    const result = { recentUsers };

    // Cache for 2 minutes
    cache.set(cacheKey, result, 2);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
