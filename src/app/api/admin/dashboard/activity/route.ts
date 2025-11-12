import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { headers } from 'next/headers';
import { cache } from '@/lib/firebase-cost-optimizer';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * ⚡ DASHBOARD ACTIVITY API
 * 
 * Son 7 günün kullanıcı aktivitesi
 * Cache: 5 dakika
 * Cost: ~14 reads (7 gün * 2 query)
 */

export async function GET() {
  try {
    // 🔐 Auth check
    const headersList = headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
      
      if (!adminEmails.includes(decodedToken.email || '')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch (authError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 💰 Check cache first
    const cacheKey = 'dashboard_activity';
    const cached = cache.get<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached, fromCache: true });
    }

    // ⚡ Gerçek veri: Son 7 günün aktivitesi
    const activityData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dateKey = date.toISOString().split('T')[0];
      
      // Paralel queries: aktif kullanıcılar + yeni kullanıcılar
      const [activeUsersCount, newUsersCount] = await Promise.all([
        // Aktif kullanıcılar (lastActiveAt bugün olan)
        adminDb.collection('users')
          .where('lastActiveAt', '>=', date)
          .where('lastActiveAt', '<', nextDay)
          .count()
          .get(),
        
        // Yeni kullanıcılar (createdAt bugün olan)
        adminDb.collection('users')
          .where('createdAt', '>=', date)
          .where('createdAt', '<', nextDay)
          .count()
          .get(),
      ]);
      
      activityData.push({
        date: dateKey,
        activeUsers: activeUsersCount.data().count,
        newUsers: newUsersCount.data().count,
      });
    }

    // Cache for 5 minutes
    cache.set(cacheKey, activityData, 5);

    console.log('✅ Dashboard activity fetched:', {
      days: activityData.length,
      reads: activityData.length * 2, // Her gün için 2 count query
      cached: false,
    });

    return NextResponse.json({ data: activityData });
  } catch (error: any) {
    console.error('Dashboard activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
