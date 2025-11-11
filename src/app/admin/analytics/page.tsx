'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserGrowthChart from '@/components/admin/UserGrowthChart';
import StudyTimeChart from '@/components/admin/StudyTimeChart';
import { auth } from '@/lib/firebase-client';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiClock, 
  FiMessageSquare, 
  FiCalendar,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';

interface AnalyticsData {
  userGrowth: { date: string; count: number }[];
  studyTime: { date: string; hours: number }[];
  activeUsers: { date: string; count: number }[];
  topCategories: { category: string; count: number }[];
  userRetention: { week: number; rate: number }[];
  deviceStats: { device: string; count: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // ✅ Fetch real data from API
      const user = auth.currentUser;
      if (!user) {
        console.error('No authenticated user');
        return;
      }
      
      const idToken = await user.getIdToken();
      const response = await fetch(
        `/api/admin/analytics?range=${timeRange}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        console.error('Failed to fetch analytics:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${formatNumber(hours)} saat`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="spinner w-12 h-12"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analitikler</h1>
            <p className="text-gray-600 mt-1">Detaylı istatistikler ve raporlar</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="input-primary"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
            <option value="all">Tüm Zamanlar</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Kullanıcı Artışı</span>
              <FiUsers className="text-primary-600 w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics?.userGrowth?.length 
                ? formatNumber(analytics.userGrowth[analytics.userGrowth.length - 1].count)
                : '0'}
            </p>
            <p className="text-sm text-green-600 mt-1">
              <FiTrendingUp className="inline w-4 h-4 mr-1" />
              +12.5% bu dönem
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Toplam Çalışma</span>
              <FiClock className="text-yellow-600 w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics?.studyTime?.reduce((acc, curr) => acc + curr.hours, 0) 
                ? `${formatNumber(analytics.studyTime.reduce((acc, curr) => acc + curr.hours, 0))} saat`
                : '0 saat'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Bu dönem</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Aktif Kullanıcı</span>
              <FiBarChart2 className="text-green-600 w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics?.activeUsers?.length
                ? formatNumber(analytics.activeUsers[analytics.activeUsers.length - 1].count)
                : '0'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Günlük ortalama</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Toplam Oda</span>
              <FiMessageSquare className="text-purple-600 w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(analytics?.topCategories?.reduce((acc, curr) => acc + curr.count, 0) || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Oluşturuldu</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiTrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Kullanıcı Büyümesi
            </h2>
            <div className="h-64">
              {analytics?.userGrowth && analytics.userGrowth.length > 0 ? (
                <UserGrowthChart data={analytics.userGrowth} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Veri yükleniyor...
                </div>
              )}
            </div>
          </div>

          {/* Study Time Chart */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiClock className="w-5 h-5 mr-2 text-yellow-600" />
              Çalışma Süresi Trendi
            </h2>
            <div className="h-64">
              {analytics?.studyTime && analytics.studyTime.length > 0 ? (
                <StudyTimeChart data={analytics.studyTime} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Veri yükleniyor...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiPieChart className="w-5 h-5 mr-2 text-purple-600" />
              Popüler Kategoriler
            </h2>
            <div className="space-y-3">
              {analytics?.topCategories?.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-gray-700 font-medium capitalize">{cat.category}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ 
                            width: `${(cat.count / (analytics.topCategories?.[0]?.count || 1)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-gray-600 font-semibold">{formatNumber(cat.count)}</span>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">Veri yok</div>
              )}
            </div>
          </div>

          {/* User Retention */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiUsers className="w-5 h-5 mr-2 text-green-600" />
              Kullanıcı Tutma Oranı
            </h2>
            <div className="space-y-3">
              {analytics?.userRetention?.map((ret, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700">Hafta {ret.week}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          ret.rate >= 70 ? 'bg-green-600' :
                          ret.rate >= 50 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${ret.rate}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">
                      {ret.rate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">Veri yok</div>
              )}
            </div>
          </div>
        </div>

        {/* Device Stats */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiBarChart2 className="w-5 h-5 mr-2 text-blue-600" />
            Cihaz Dağılımı
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics?.deviceStats?.map((device, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1 capitalize">{device.device}</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(device.count)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((device.count / (analytics.deviceStats?.reduce((acc, curr) => acc + curr.count, 0) || 1)) * 100).toFixed(1)}%
                </p>
              </div>
            )) || (
              <div className="col-span-full text-center py-8 text-gray-500">Veri yok</div>
            )}
          </div>
        </div>

        {/* Export Options */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Rapor İndir</h2>
          <div className="flex gap-3">
            <button className="btn-secondary">
              <FiCalendar className="inline w-4 h-4 mr-2" />
              PDF Rapor
            </button>
            <button className="btn-secondary">
              <FiBarChart2 className="inline w-4 h-4 mr-2" />
              Excel Rapor
            </button>
            <button className="btn-secondary">
              <FiPieChart className="inline w-4 h-4 mr-2" />
              CSV Dışa Aktar
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
