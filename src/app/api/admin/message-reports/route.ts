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
    const status = searchParams.get('status') || 'all'; // all, pending, reviewing, resolved, rejected
    const roomId = searchParams.get('roomId') || null;

    // Check cache first
    const cacheKey = `message_reports_${status}_${page}_${limit}_${roomId || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    let query: any = adminDb.collection('messageReports');

    // Apply status filter
    if (status !== 'all') {
      query = query.where('status', '==', status);
    }

    // Apply room filter
    if (roomId) {
      query = query.where('roomId', '==', roomId);
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
        roomId: data.roomId,
        reportedMessages: data.reportedMessages || [],
        reportedUserId: data.reportedUserId,
        reportedUserName: data.reportedUserName,
        reportedUserAvatar: data.reportedUserAvatar,
        reporterUserId: data.reporterUserId,
        reporterUserName: data.reporterUserName,
        reporterUserAvatar: data.reporterUserAvatar,
        reason: data.reason,
        description: data.description || null,
        status: data.status, // pending, reviewing, resolved, rejected
        createdAt: data.createdAt?.toDate?.() || null,
        reviewedAt: data.reviewedAt?.toDate?.() || null,
        reviewedBy: data.reviewedBy || null,
        adminNotes: data.adminNotes || null,
      };
    });

    const result = {
      reports,
      totalReports,
      currentPage: page,
      totalPages: Math.ceil(totalReports / limit),
    };

    // Cache for 1 minute (fresher data for reports)
    cache.set(cacheKey, result, 1);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching message reports:', error);
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
    const { reportId, status, adminId, notes } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { error: 'Missing reportId or status' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'reviewing', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const reportRef = adminDb.collection('messageReports').doc(reportId);
    const reportDoc = await reportRef.get();

    if (!reportDoc.exists) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const reportData = reportDoc.data();

    // Update report status
    await reportRef.update({
      status: status,
      reviewedAt: new Date(),
      reviewedBy: adminId || admin.email || 'admin',
      adminNotes: notes || reportData?.adminNotes || '',
    });

    // If resolved, optionally take action on reported user
    if (status === 'resolved' && reportData?.reportedUserId) {
      // Optional: You can add logic here to:
      // 1. Warn the user
      // 2. Temporarily ban the user
      // 3. Delete the reported messages
      // 4. Send notification to reported user
      
      // For now, just log it
      console.log(`Report resolved for user: ${reportData.reportedUserId}`);
    }

    // Clear cache
    cache.clear();

    return NextResponse.json({ 
      success: true,
      message: 'Report updated successfully'
    });
  } catch (error) {
    console.error('Error updating message report:', error);
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
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json(
        { error: 'Missing reportId' },
        { status: 400 }
      );
    }

    const reportRef = adminDb.collection('messageReports').doc(reportId);
    const reportDoc = await reportRef.get();

    if (!reportDoc.exists) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Delete the report
    await reportRef.delete();

    // Clear cache
    cache.clear();

    return NextResponse.json({ 
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
