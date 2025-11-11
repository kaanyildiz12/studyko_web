import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminToken } from '@/lib/auth';

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

    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '6');

    // Calculate date range
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Get all premium users with their start dates
    const premiumUsersSnapshot = await adminDb
      .collection('users')
      .where('isPremium', '==', true)
      .get();

    // Build monthly data
    const monthlyData: { [key: string]: { revenue: number; subscriptions: number; monthly: number; yearly: number } } = {};
    
    // Initialize months
    for (let i = 0; i < months; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - (months - 1 - i));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('tr-TR', { month: 'short' });
      
      monthlyData[monthKey] = {
        revenue: 0,
        subscriptions: 0,
        monthly: 0,
        yearly: 0,
      };
    }

    // Count subscriptions by month
    premiumUsersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const premiumStartedAt = data.premiumStartedAt?.toDate();
      const premiumType = data.premiumType || 'monthly';
      
      if (premiumStartedAt) {
        const monthKey = `${premiumStartedAt.getFullYear()}-${String(premiumStartedAt.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].subscriptions += 1;
          
          if (premiumType === 'monthly') {
            monthlyData[monthKey].monthly += 1;
            monthlyData[monthKey].revenue += 29; // 29₺
          } else {
            monthlyData[monthKey].yearly += 1;
            monthlyData[monthKey].revenue += 200; // 200₺
          }
        }
      }
    });

    // Format response
    const chartData = Object.entries(monthlyData).map(([monthKey, data]) => {
      const [year, month] = monthKey.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const monthName = date.toLocaleDateString('tr-TR', { month: 'short' });
      
      return {
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        revenue: data.revenue,
        subscriptions: data.subscriptions,
        monthly: data.monthly,
        yearly: data.yearly,
      };
    });

    return NextResponse.json({ chartData });
  } catch (error) {
    console.error('Error fetching premium analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
