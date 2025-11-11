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
    const filter = searchParams.get('filter') || 'all'; // all, active, private, reported

    // Check cache first
    const cacheKey = `rooms_${filter}_${page}_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    let query: any = adminDb.collection('study_rooms');

    // Apply filters
    if (filter === 'active') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      query = query.where('lastActivityAt', '>', oneDayAgo);
    } else if (filter === 'private') {
      query = query.where('isPrivate', '==', true);
    } else if (filter === 'reported') {
      query = query.where('hasReports', '==', true);
    }

    // Order by creation date
    query = query.orderBy('createdAt', 'desc');

    // Get total count
    const countSnapshot = await query.count().get();
    const totalRooms = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    const roomsSnapshot = await query.limit(limit).offset(offset).get();

    const rooms = roomsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unnamed Room',
        description: data.description || '',
        hostId: data.hostId || data.createdBy || '',
        hostName: data.hostName || 'Unknown',
        memberCount: data.memberIds?.length || data.members?.length || 0,
        isPrivate: data.isPrivate || false,
        category: data.category || 'Diğer',
        createdAt: data.createdAt?.toDate?.() || null,
        lastActivityAt: data.lastActivityAt?.toDate?.() || data.lastActivity?.toDate?.() || null,
        hasReports: data.hasReports || false,
      };
    });

    const result = {
      rooms,
      totalRooms,
      currentPage: page,
      totalPages: Math.ceil(totalRooms / limit),
    };

    // Cache for 3 minutes
    cache.set(cacheKey, result, 3);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Missing roomId' },
        { status: 400 }
      );
    }

    const roomRef = adminDb.collection('study_rooms').doc(roomId);
    
    // Delete room and all subcollections (messages, etc.)
    await roomRef.delete();
    
    // TODO: Delete subcollections (messages, user_timers, etc.)
    // This requires a more complex deletion process
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting room:', error);
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
    const { roomId, action } = body;

    if (!roomId || !action) {
      return NextResponse.json(
        { error: 'Missing roomId or action' },
        { status: 400 }
      );
    }

    const roomRef = adminDb.collection('study_rooms').doc(roomId);

    switch (action) {
      case 'disable':
        await roomRef.update({ isDisabled: true, disabledAt: new Date() });
        break;

      case 'enable':
        await roomRef.update({ isDisabled: false, disabledAt: null });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
