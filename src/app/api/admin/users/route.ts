import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { cache } from '@/lib/firebase-cost-optimizer';

export async function GET(request: Request) {
  try {
    // 🔐 Auth check
    const authHeader = request.headers.get('authorization');
    
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
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all'; // all, premium, banned, recent

    let query: any = adminDb.collection('users');

    // Apply filters
    if (filter === 'premium') {
      query = query.where('isPremium', '==', true);
    } else if (filter === 'banned') {
      query = query.where('isBanned', '==', true);
    } else if (filter === 'recent') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      query = query.where('createdAt', '>', sevenDaysAgo);
    }

    // Apply search (if provided)
    // Note: Firestore doesn't support full-text search, so this is a basic implementation
    // For production, consider using Algolia or similar

    // Order by creation date
    query = query.orderBy('createdAt', 'desc');

    // 💰 Check cache for this specific query (2 dakika cache)
    const cacheKey = `users_${filter}_${search}_${page}_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // Get total count
    const countSnapshot = await query.count().get();
    const totalUsers = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    const usersSnapshot = await query.limit(limit).offset(offset).get();

    const users = usersSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        displayName: data.displayName || 'Unnamed',
        photoURL: data.photoURL,
        isPremium: data.isPremium || false,
        isBanned: data.isBanned || false,
        totalMinutes: data.totalMinutes || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        lastActiveAt: data.lastActiveAt?.toDate?.() || null,
      };
    });

    const result = {
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    };

    // Cache for 2 minutes
    cache.set(cacheKey, result, 2);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // 🔐 Auth check
    const authHeader = request.headers.get('authorization');
    
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
    
    const body = await request.json();
    const { userId, action, data } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing userId or action' },
        { status: 400 }
      );
    }

    const userRef = adminDb.collection('users').doc(userId);

    switch (action) {
      case 'ban':
        await userRef.update({ isBanned: true, bannedAt: new Date() });
        // Also disable Firebase Auth
        await adminAuth.updateUser(userId, { disabled: true });
        break;

      case 'unban':
        await userRef.update({ isBanned: false, bannedAt: null });
        await adminAuth.updateUser(userId, { disabled: false });
        break;

      case 'setPremium':
        await userRef.update({
          isPremium: data.isPremium,
          premiumUntil: data.premiumUntil || null,
        });
        break;

      case 'delete':
        // Delete user data
        await userRef.delete();
        // Delete Firebase Auth user
        await adminAuth.deleteUser(userId);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
