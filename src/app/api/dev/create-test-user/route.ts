import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST() {
  try {
    const testUsers = [
      {
        email: 'test1@example.com',
        displayName: 'Test User 1',
        isPremium: false,
        isBanned: false,
        totalMinutes: 120,
        createdAt: new Date(),
        lastActiveAt: new Date(),
      },
      {
        email: 'test2@example.com',
        displayName: 'Test User 2 (Premium)',
        isPremium: true,
        premiumSince: new Date(),
        premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        premiumType: 'monthly',
        isBanned: false,
        totalMinutes: 300,
        createdAt: new Date(),
        lastActiveAt: new Date(),
      },
      {
        email: 'test3@example.com',
        displayName: 'Test User 3',
        isPremium: false,
        isBanned: false,
        totalMinutes: 60,
        createdAt: new Date(),
        lastActiveAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
    ];

    const batch = adminDb.batch();
    const createdIds: string[] = [];

    testUsers.forEach(user => {
      const ref = adminDb.collection('users').doc();
      batch.set(ref, user);
      createdIds.push(ref.id);
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `${testUsers.length} test kullanıcısı oluşturuldu`,
      users: testUsers.map((user, index) => ({
        id: createdIds[index],
        ...user,
      })),
    });
  } catch (error: any) {
    console.error('Error creating test users:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
