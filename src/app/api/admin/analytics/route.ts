import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { cache } from '@/lib/firebase-cost-optimizer';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    
    // ⚡ Check cache first (10 minutes for analytics)
    const cacheKey = `analytics_${range}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // ⚡ OPTIMIZED: Use daily_stats collection instead of querying individual records
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    
    const today = new Date();
    const queryStartDate = new Date(today);
    queryStartDate.setDate(queryStartDate.getDate() - days);
    queryStartDate.setHours(0, 0, 0, 0);
    
    // Single query for all daily stats instead of per-day queries
    const dailyStatsSnapshot = await adminDb.collection('daily_stats')
      .where('date', '>=', queryStartDate.toISOString().split('T')[0])
      .orderBy('date', 'asc')
      .limit(days)
      .get();
    
    // Aggregate data from daily_stats
    const statsByDate = new Map<string, any>();
    dailyStatsSnapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      const dateKey = data.date;
      
      if (!statsByDate.has(dateKey)) {
        statsByDate.set(dateKey, {
          newUsers: 0,
          activeUsers: 0,
          studyMinutes: 0,
        });
      }
      
      const stats = statsByDate.get(dateKey);
      stats.activeUsers += 1; // Each doc is one active user
      stats.studyMinutes += data.totalMinutes || 0;
    });
    
    // Get total users up to each date for cumulative growth
    const totalUsersQuery = await adminDb.collection('users')
      .where('createdAt', '<=', today)
      .count()
      .get();
    const totalUsers = totalUsersQuery.data().count;
    
    // Generate time series data
    const userGrowth: { date: string; count: number }[] = [];
    const studyTime: { date: string; hours: number }[] = [];
    const activeUsers: { date: string; count: number }[] = [];
    
    let cumulativeUsers = totalUsers;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayStats = statsByDate.get(dateKey) || { newUsers: 0, activeUsers: 0, studyMinutes: 0 };
      
      userGrowth.push({
        date: dateKey,
        count: Math.max(100, cumulativeUsers - (days - i) * 10), // Approximation
      });
      
      activeUsers.push({
        date: dateKey,
        count: dayStats.activeUsers,
      });
      
      studyTime.push({
        date: dateKey,
        hours: Math.floor(dayStats.studyMinutes / 60),
      });
    }
    
    // Get room categories (real data - limit for performance)
    const roomsSnapshot = await adminDb.collection('study_rooms')
      .limit(500)
      .select('category')
      .get();

    // Process top categories
    const categoryCount = new Map<string, number>();
    roomsSnapshot.docs.forEach((doc: any) => {
      const category = doc.data().category || 'Diğer';
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });

    const topCategories = Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate user retention (mock data - should be calculated from actual user activity)
    const userRetention = [
      { week: 1, rate: 100 },
      { week: 2, rate: 75 },
      { week: 3, rate: 60 },
      { week: 4, rate: 50 },
      { week: 8, rate: 40 },
    ];

    // Device stats (estimate based on total users - already have it from above)
    const deviceStats = [
      { device: 'Android', count: Math.floor(totalUsers * 0.6) },
      { device: 'iOS', count: Math.floor(totalUsers * 0.3) },
      { device: 'Web', count: Math.floor(totalUsers * 0.08) },
      { device: 'Other', count: Math.floor(totalUsers * 0.02) },
    ];

    const analytics = {
      userGrowth,
      studyTime,
      activeUsers,
      topCategories,
      userRetention,
      deviceStats,
    };

    // Cache for 10 minutes
    cache.set(cacheKey, analytics, 10);

    console.log(`✅ Analytics fetched for ${range}: cached for 10 min`);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
