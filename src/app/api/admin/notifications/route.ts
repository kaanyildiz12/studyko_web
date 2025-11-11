import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { adminDb, adminMessaging } from '@/lib/firebase-admin';
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

    // Check cache first
    const cacheKey = 'notifications_list';
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // Get sent notifications
    const snapshot = await adminDb.collection('notifications')
      .orderBy('sentAt', 'desc')
      .limit(50)
      .get();

    const notifications = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      sentAt: doc.data().sentAt?.toDate(),
    }));

    const result = { notifications };

    // Cache for 1 minute (notifications change frequently)
    cache.set(cacheKey, result, 1);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Bildirim gönderme isteği alındı');
    
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      console.error('Token bulunamadı');
      return NextResponse.json({ error: 'Unauthorized - Token eksik' }, { status: 401 });
    }

    console.log('Admin doğrulanıyor...');
    const admin = await verifyAdminToken(token);
    if (!admin) {
      console.error('Admin doğrulanamadı');
      return NextResponse.json({ error: 'Forbidden - Admin yetkisi yok' }, { status: 403 });
    }

    console.log('Admin doğrulandı:', admin.email);
    const notification = await request.json();
    console.log('Bildirim verisi:', notification);

    // Get target users based on targetType
    let targetUserIds: string[] = [];
    
    console.log('Hedef kitle:', notification.targetType);
    
    if (notification.targetType === 'all') {
      console.log('Tüm kullanıcılar getiriliyor...');
      const usersSnapshot = await adminDb.collection('users').get();
      targetUserIds = usersSnapshot.docs.map((doc: any) => doc.id);
      console.log('Toplam kullanıcı:', targetUserIds.length);
    } else if (notification.targetType === 'premium') {
      const usersSnapshot = await adminDb.collection('users')
        .where('isPremium', '==', true)
        .get();
      targetUserIds = usersSnapshot.docs.map((doc: any) => doc.id);
      console.log('Premium kullanıcı sayısı:', targetUserIds.length);
    } else if (notification.targetType === 'free') {
      const usersSnapshot = await adminDb.collection('users')
        .where('isPremium', '==', false)
        .get();
      targetUserIds = usersSnapshot.docs.map((doc: any) => doc.id);
      console.log('Free kullanıcı sayısı:', targetUserIds.length);
    } else if (notification.targetType === 'active') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const usersSnapshot = await adminDb.collection('users')
        .where('lastActiveAt', '>=', sevenDaysAgo)
        .get();
      targetUserIds = usersSnapshot.docs.map((doc: any) => doc.id);
      console.log('Aktif kullanıcı sayısı:', targetUserIds.length);
    } else if (notification.targetType === 'inactive') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const usersSnapshot = await adminDb.collection('users')
        .where('lastActiveAt', '<', thirtyDaysAgo)
        .get();
      targetUserIds = usersSnapshot.docs.map((doc: any) => doc.id);
      console.log('Pasif kullanıcı sayısı:', targetUserIds.length);
    } else if (notification.targetType === 'specific') {
      // Parse email list
      const emails = notification.targetUsers
        .split(',')
        .map((e: string) => e.trim())
        .filter((e: string) => e);
      
      console.log('Belirli kullanıcılar:', emails);
      
      const userDocs = await Promise.all(
        emails.map((email: string) => 
          adminDb.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get()
        )
      );
      
      targetUserIds = userDocs
        .filter(snapshot => !snapshot.empty)
        .map(snapshot => snapshot.docs[0].id);
      
      console.log('Bulunan kullanıcı sayısı:', targetUserIds.length);
    }

    if (targetUserIds.length === 0) {
      console.warn('Hedef kullanıcı bulunamadı!');
      return NextResponse.json({ 
        error: 'Hedef kullanıcı bulunamadı',
        recipientCount: 0 
      }, { status: 400 });
    }

    // Save notification to database
    const notificationDoc = {
      title: notification.title,
      message: notification.message,
      targetType: notification.targetType,
      priority: notification.priority,
      sentAt: notification.scheduleType === 'now' ? new Date() : null,
      scheduledFor: notification.scheduleType === 'scheduled' 
        ? new Date(notification.scheduledTime) 
        : null,
      recipientCount: targetUserIds.length,
      status: notification.scheduleType === 'now' ? 'sent' : 'scheduled',
      sentBy: admin.email,
      ...(notification.deepLink && { 
        deepLink: notification.deepLink,
        deepLinkData: notification.deepLinkData || '',
      }),
    };

    console.log('Bildirim kaydediliyor...');
    const docRef = await adminDb.collection('notifications').add(notificationDoc);
    console.log('Bildirim kaydedildi, ID:', docRef.id);

    // Send actual push notifications and create in-app notifications
    if (notification.scheduleType === 'now') {
      console.log('Push bildirimleri ve kullanıcı bildirimleri gönderiliyor...');
      
      // Get user documents with FCM tokens
      const userDocs = await Promise.all(
        targetUserIds.map(id => adminDb.collection('users').doc(id).get())
      );
      
      const usersWithTokens = userDocs
        .filter(doc => doc.exists && doc.data()?.fcmToken)
        .map(doc => ({
          id: doc.id,
          fcmToken: doc.data()!.fcmToken as string,
        }));
      
      console.log(`${usersWithTokens.length}/${targetUserIds.length} kullanıcının FCM token'ı var`);
      
      let fcmSuccessCount = 0;
      let fcmFailureCount = 0;
      
      // Send FCM notifications in batches (FCM allows up to 500 tokens per batch)
      if (usersWithTokens.length > 0) {
        const batchSize = 500;
        for (let i = 0; i < usersWithTokens.length; i += batchSize) {
          const batch = usersWithTokens.slice(i, i + batchSize);
          const tokens = batch.map(u => u.fcmToken);
          
          try {
            const response = await adminMessaging.sendEachForMulticast({
              tokens,
              notification: {
                title: notification.title,
                body: notification.message,
              },
              data: {
                notificationId: docRef.id,
                priority: notification.priority,
                type: 'admin_notification',
                ...(notification.deepLink && { 
                  deepLink: notification.deepLink,
                  deepLinkData: notification.deepLinkData || '',
                }),
              },
              android: {
                priority: notification.priority === 'high' ? 'high' : 'normal',
                notification: {
                  sound: 'default',
                  channelId: 'default',
                  clickAction: notification.deepLink ? 'FLUTTER_NOTIFICATION_CLICK' : undefined,
                },
              },
              apns: {
                payload: {
                  aps: {
                    sound: 'default',
                    badge: 1,
                    category: notification.deepLink || undefined,
                  },
                },
              },
            });
            
            fcmSuccessCount += response.successCount;
            fcmFailureCount += response.failureCount;
            
            console.log(`FCM Batch ${Math.floor(i / batchSize) + 1}: ${response.successCount} başarılı, ${response.failureCount} başarısız`);
            
            // Clean up invalid tokens
            if (response.failureCount > 0) {
              const invalidTokenUsers: string[] = [];
              response.responses.forEach((resp: any, idx: number) => {
                if (!resp.success && 
                    (resp.error?.code === 'messaging/invalid-registration-token' ||
                     resp.error?.code === 'messaging/registration-token-not-registered')) {
                  invalidTokenUsers.push(batch[idx].id);
                }
              });
              
              if (invalidTokenUsers.length > 0) {
                console.log(`${invalidTokenUsers.length} geçersiz token temizleniyor...`);
                const cleanupBatch = adminDb.batch();
                invalidTokenUsers.forEach((userId: string) => {
                  cleanupBatch.update(
                    adminDb.collection('users').doc(userId),
                    { fcmToken: null }
                  );
                });
                await cleanupBatch.commit();
              }
            }
          } catch (error: any) {
            console.error(`FCM batch ${Math.floor(i / batchSize) + 1} hatası:`, error);
            fcmFailureCount += tokens.length;
          }
        }
      }
      
      console.log(`FCM Toplam: ${fcmSuccessCount} başarılı, ${fcmFailureCount} başarısız`);
      
      // Create in-app notifications for all users (including those without FCM tokens)
      console.log('Uygulama içi bildirimler oluşturuluyor...');
      const usersToNotify = targetUserIds.slice(0, 500); // Firestore batch limit is 500
      
      const batch = adminDb.batch();
      usersToNotify.forEach(userId => {
        const userNotifRef = adminDb.collection('users')
          .doc(userId)
          .collection('notifications')
          .doc();
        
        batch.set(userNotifRef, {
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          read: false,
          createdAt: new Date(),
          ...(notification.deepLink && { 
            deepLink: notification.deepLink,
            deepLinkData: notification.deepLinkData || '',
          }),
        });
      });
      
      await batch.commit();
      console.log('Kullanıcı bildirimleri oluşturuldu:', usersToNotify.length);
      
      // If there are more than 500 users, handle remaining in batches
      if (targetUserIds.length > 500) {
        console.log('500+ kullanıcı var, kalan bildirimleri işliyoruz...');
        for (let i = 500; i < targetUserIds.length; i += 500) {
          const batch = adminDb.batch();
          const batchUsers = targetUserIds.slice(i, i + 500);
          
          batchUsers.forEach(userId => {
            const userNotifRef = adminDb.collection('users')
              .doc(userId)
              .collection('notifications')
              .doc();
            
            batch.set(userNotifRef, {
              title: notification.title,
              message: notification.message,
              priority: notification.priority,
              read: false,
              createdAt: new Date(),
              ...(notification.deepLink && { 
                deepLink: notification.deepLink,
                deepLinkData: notification.deepLinkData || '',
              }),
            });
          });
          
          await batch.commit();
          console.log(`Batch ${Math.floor(i / 500) + 1} tamamlandı`);
        }
      }
      
      // Update notification document with send stats
      await adminDb.collection('notifications').doc(docRef.id).update({
        fcmSuccessCount,
        fcmFailureCount,
        totalRecipients: targetUserIds.length,
        tokensFound: usersWithTokens.length,
      });
    }

    console.log('Bildirim gönderimi başarılı!');
    return NextResponse.json({ 
      success: true, 
      notificationId: docRef.id,
      recipientCount: targetUserIds.length,
      message: notification.scheduleType === 'now' 
        ? `Bildirim ${targetUserIds.length} kullanıcıya gönderildi`
        : `Bildirim ${targetUserIds.length} kullanıcı için zamanlandı`
    });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
