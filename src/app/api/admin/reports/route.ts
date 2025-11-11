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
    const status = searchParams.get('status') || 'all'; // all, pending, resolved, rejected

    // Check cache first
    const cacheKey = `reports_${status}_${page}_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    let query: any = adminDb.collection('reports');

    // Apply status filter
    if (status !== 'all') {
      query = query.where('status', '==', status);
    }

    // Order by creation date (newest first)
    query = query.orderBy('createdAt', 'desc');

    // Get total count
    const countSnapshot = await query.count().get();
    const totalReports = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    const reportsSnapshot = await query.limit(limit).offset(offset).get();

    const reports = reportsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        reporterId: data.reporterId,
        reporterName: data.reporterName,
        reportedUserId: data.reportedUserId,
        reportedUserName: data.reportedUserName,
        reportType: data.reportType, // user, room, message
        reason: data.reason,
        description: data.description,
        status: data.status, // pending, resolved, rejected
        createdAt: data.createdAt?.toDate?.() || null,
        resolvedAt: data.resolvedAt?.toDate?.() || null,
        resolvedBy: data.resolvedBy,
        roomId: data.roomId,
        messageId: data.messageId,
      };
    });

    const result = {
      reports,
      totalReports,
      currentPage: page,
      totalPages: Math.ceil(totalReports / limit),
    };

    // Cache for 2 minutes
    cache.set(cacheKey, result, 2);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching reports:', error);
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
    const { reportId, action, adminId, notes } = body;

    if (!reportId || !action) {
      return NextResponse.json(
        { error: 'Missing reportId or action' },
        { status: 400 }
      );
    }

    const reportRef = adminDb.collection('reports').doc(reportId);
    const reportDoc = await reportRef.get();

    if (!reportDoc.exists) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const reportData = reportDoc.data();

    switch (action) {
      case 'resolve':
        await reportRef.update({
          status: 'resolved',
          resolvedAt: new Date(),
          resolvedBy: adminId || 'admin',
          notes: notes || '',
        });

        // If user report, optionally ban the user
        if (reportData?.reportedUserId) {
          // This is optional - admins can manually ban users separately
        }
        break;

      case 'reject':
        await reportRef.update({
          status: 'rejected',
          resolvedAt: new Date(),
          resolvedBy: adminId || 'admin',
          notes: notes || '',
        });
        break;

      case 'delete':
        await reportRef.delete();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
