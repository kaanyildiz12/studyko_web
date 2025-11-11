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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Check cache first
    const cacheKey = `premium_${page}_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // Get premium users (without ordering first to avoid missing index issues)
    let query = adminDb
      .collection('users')
      .where('isPremium', '==', true);

    // Get total count
    const countSnapshot = await query.count().get();
    const totalPremiumUsers = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    const usersSnapshot = await query.limit(limit).offset(offset).get();

    const premiumUsers = usersSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email || '',
        displayName: data.displayName || 'Unnamed',
        photoURL: data.photoURL || null,
        isPremium: data.isPremium || false,
        premiumStartedAt: data.premiumStartedAt?.toDate?.() || data.createdAt?.toDate?.() || null,
        premiumUntil: data.premiumUntil?.toDate?.() || null,
        premiumType: data.premiumType || 'monthly', // monthly, yearly
        totalMinutes: data.totalMinutes || data.totalWorkMinutes || 0,
      };
    }).sort((a, b) => {
      // Sort by premiumStartedAt in memory
      const dateA = a.premiumStartedAt?.getTime() || 0;
      const dateB = b.premiumStartedAt?.getTime() || 0;
      return dateB - dateA;
    });

    // Calculate revenue estimates
    const monthlyRevenue = premiumUsers.filter(u => u.premiumType === 'monthly').length * 29;
    const yearlyRevenue = premiumUsers.filter(u => u.premiumType === 'yearly').length * 200;
    const totalMonthlyRevenue = monthlyRevenue + (yearlyRevenue / 12);

    // Get growth stats (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPremiumSnapshot = await adminDb
      .collection('users')
      .where('isPremium', '==', true)
      .where('premiumStartedAt', '>', thirtyDaysAgo)
      .count()
      .get();
    const newPremiumLast30Days = recentPremiumSnapshot.data().count;

    const result = {
      premiumUsers,
      totalPremiumUsers,
      currentPage: page,
      totalPages: Math.ceil(totalPremiumUsers / limit),
      analytics: {
        totalMonthlyRevenue: Math.round(totalMonthlyRevenue),
        totalYearlyRevenue: Math.round(totalMonthlyRevenue * 12),
        newPremiumLast30Days,
        monthlySubscribers: premiumUsers.filter(u => u.premiumType === 'monthly').length,
        yearlySubscribers: premiumUsers.filter(u => u.premiumType === 'yearly').length,
      },
    };

    // Cache for 3 minutes
    cache.set(cacheKey, result, 3);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching premium users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { userId, premiumType, duration } = body; // duration in days

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const currentPremiumUntil = userData?.premiumUntil?.toDate() || new Date();
    
    // Extend from current end date (or now if expired)
    const startDate = currentPremiumUntil > new Date() ? currentPremiumUntil : new Date();
    const premiumUntil = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    await userRef.update({
      isPremium: true,
      premiumStartedAt: userData?.premiumStartedAt || new Date(),
      premiumUntil: premiumUntil,
      premiumType: premiumType || userData?.premiumType || 'monthly',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error granting premium:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing userId or action' },
        { status: 400 }
      );
    }

    const userRef = adminDb.collection('users').doc(userId);

    switch (action) {
      case 'cancel':
        await userRef.update({
          isPremium: false,
          premiumUntil: null,
          premiumCancelledAt: new Date(),
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating premium:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
