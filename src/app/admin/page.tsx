'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import UserActivityChart from '@/components/admin/UserActivityChart';
import { FiUsers, FiMessageSquare, FiClock, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { auth } from '@/lib/firebase-client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers24h: 0,
    activeUsers7d: 0,
    totalPremiumUsers: 0,
    totalStudyMinutes: 0,
    totalRooms: 0,
    activeRooms: 0,
    totalMessages: 0,
    pendingReports: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activityData, setActivityData] = useState<Array<{
    date: string;
    activeUsers: number;
    newUsers: number;
  }>>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        const idToken = await user.getIdToken();
        const response = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch real activity data from API
    const fetchActivityData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        const idToken = await user.getIdToken();
        const response = await fetch('/api/admin/dashboard/activity', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        
        if (response.ok) {
          const { data } = await response.json();
          setActivityData(data);
        } else {
          console.error('Failed to fetch activity data');
        }
      } catch (error) {
        console.error('Activity data error:', error);
      }
    };

    // Fetch recent users
    const fetchRecentUsers = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        const idToken = await user.getIdToken();
        const response = await fetch('/api/admin/dashboard/recent-users', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        
        if (response.ok) {
          const { recentUsers } = await response.json();
          setRecentUsers(recentUsers);
        }
      } catch (error) {
        console.error('Failed to fetch recent users:', error);
      }
    };

    // Fetch recent reports
    const fetchRecentReports = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        const idToken = await user.getIdToken();
        const response = await fetch('/api/admin/dashboard/recent-reports', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        
        if (response.ok) {
          const { recentReports } = await response.json();
          setRecentReports(recentReports);
        }
      } catch (error) {
        console.error('Failed to fetch recent reports:', error);
      }
    };

    fetchStats();
    fetchActivityData();
    fetchRecentUsers();
    fetchRecentReports();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Genel bakış ve istatistikler</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Toplam Kullanıcı"
            value={stats.totalUsers.toLocaleString('tr-TR')}
            icon={<FiUsers size={32} />}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Aktif Kullanıcı (24s)"
            value={stats.activeUsers24h.toLocaleString('tr-TR')}
            icon={<FiActivity size={32} />}
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="Premium Üye"
            value={stats.totalPremiumUsers.toLocaleString('tr-TR')}
            icon={<FiDollarSign size={32} />}
            trend={{ value: 8.3, isPositive: true }}
          />
          <StatsCard
            title="Toplam Çalışma"
            value={`${Math.floor(stats.totalStudyMinutes / 60).toLocaleString('tr-TR')}s`}
            icon={<FiClock size={32} />}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Aktif Odalar"
            value={`${stats.activeRooms}/${stats.totalRooms}`}
            icon={<FiMessageSquare size={24} />}
          />
          <StatsCard
            title="Toplam Mesaj"
            value={stats.totalMessages.toLocaleString('tr-TR')}
            icon={<FiMessageSquare size={24} />}
          />
          <StatsCard
            title="Bekleyen Raporlar"
            value={stats.pendingReports}
            icon={<FiTrendingUp size={24} />}
            className={stats.pendingReports > 0 ? 'border-l-4 border-red-500' : ''}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Son Kayıtlar</h2>
            <div className="space-y-3">
              {recentUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Henüz kayıtlı kullanıcı yok
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {user.displayName}
                          {user.isPremium && (
                            <span className="badge-warning text-xs">Premium</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.createdAt && new Date(user.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Son Raporlar</h2>
            <div className="space-y-3">
              {recentReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Henüz rapor yok
                </div>
              ) : (
                recentReports.map((report) => (
                  <div key={report.id} className="py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">
                          {report.reporterName}
                        </span>
                        <span className="text-gray-500 text-xs">→</span>
                        <span className="text-gray-700 text-sm">
                          {report.reportedUserName}
                        </span>
                      </div>
                      {report.status === 'pending' ? (
                        <span className="badge-warning text-xs">Beklemede</span>
                      ) : report.status === 'resolved' ? (
                        <span className="badge-success text-xs">Çözüldü</span>
                      ) : (
                        <span className="badge-danger text-xs">Reddedildi</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">{report.reason}</div>
                      <div className="text-xs text-gray-500">
                        {report.createdAt && new Date(report.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Kullanıcı Aktivitesi (Son 7 Gün)</h2>
          <div className="h-64">
            <UserActivityChart data={activityData} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

