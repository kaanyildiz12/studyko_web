import { NextRequest, NextResponse } from 'next/server';
import { FirebaseCostOptimizer } from '@/lib/firebase-cost-optimizer';

/**
 * 🌐 PUBLIC STATS API
 * 
 * Landing page için public istatistikler
 * Cache: 10 dakika
 * Auth: Gerekli DEĞİL
 * 
 * Cost: ~4-5 reads (cache hit durumunda 0)
 */

export async function GET(request: NextRequest) {
  try {
    const stats = await FirebaseCostOptimizer.getPublicStats();

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: stats.totalUsers,
        activeUsers: Math.floor(stats.totalUsers * 0.15), // %15'i aktif varsayımı
        completedSessions: stats.completedSessions,
        totalMinutes: stats.totalMinutes,
        totalHours: Math.floor(stats.totalMinutes / 60),
        totalRooms: stats.totalRooms,
        // UI için formatted
        stats: {
          users: `${Math.floor(stats.totalUsers / 1000)}K+`,
          sessions: `${Math.floor(stats.completedSessions / 1000)}K+`,
          minutes: `${Math.floor(stats.totalMinutes / 1000000)}M+`,
          rooms: `${Math.floor(stats.totalRooms / 1000)}K+`,
        }
      },
      cached: true, // Always from cache after first request
    });
  } catch (error: any) {
    console.error('Public stats error:', error);
    
    // Fallback değerler (Firebase erişilemezse)
    return NextResponse.json({
      success: false,
      data: {
        stats: {
          users: '10K+',
          sessions: '500K+',
          minutes: '1M+',
          rooms: '50K+',
        }
      },
      fallback: true,
    });
  }
}
