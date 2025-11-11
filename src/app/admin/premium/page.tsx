'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import PremiumRevenueChart from '@/components/admin/PremiumRevenueChart';
import { auth } from '@/lib/firebase-client';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiUsers, 
  FiCalendar,
  FiStar,
  FiAward
} from 'react-icons/fi';

interface PremiumUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isPremium: boolean;
  premiumStartedAt: Date | null;
  premiumUntil: Date | null;
  premiumType: string;
  totalMinutes: number;
}

interface Analytics {
  totalMonthlyRevenue: number;
  totalYearlyRevenue: number;
  newPremiumLast30Days: number;
  monthlySubscribers: number;
  yearlySubscribers: number;
}

export default function PremiumManagementPage() {
  const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalMonthlyRevenue: 0,
    totalYearlyRevenue: 0,
    newPremiumLast30Days: 0,
    monthlySubscribers: 0,
    yearlySubscribers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<PremiumUser | null>(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDuration, setExtendDuration] = useState(30); // days
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    fetchPremiumUsers();
    fetchRevenueData();
  }, [page]);

  const fetchRevenueData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const idToken = await user.getIdToken();
      const response = await fetch('/api/admin/premium/analytics?months=6', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data.chartData);
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    }
  };

  const fetchPremiumUsers = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;
      
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/admin/premium?page=${page}&limit=20`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPremiumUsers(data.premiumUsers);
        setAnalytics(data.analytics);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch premium users:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}s ${minutes % 60}dk`;
  };

  const getDaysRemaining = (premiumUntil: Date | null) => {
    if (!premiumUntil) return '-';
    const now = new Date();
    const until = new Date(premiumUntil);
    const diff = until.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} gün` : 'Süresi dolmuş';
  };

  const handleExtendPremium = async () => {
    if (!selectedUser) return;

    if (!confirm(`${selectedUser.displayName} için premium süresini ${extendDuration} gün uzatmak istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const idToken = await user.getIdToken();
      const response = await fetch('/api/admin/premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          premiumType: selectedUser.premiumType,
          duration: extendDuration,
        }),
      });

      if (response.ok) {
        alert('Premium süresi başarıyla uzatıldı!');
        setShowExtendModal(false);
        setSelectedUser(null);
        fetchPremiumUsers();
      } else {
        alert('İşlem başarısız!');
      }
    } catch (error) {
      console.error('Failed to extend premium:', error);
      alert('Bir hata oluştu!');
    }
  };

  const handleCancelPremium = async (user: PremiumUser) => {
    if (!confirm(`${user.displayName} kullanıcısının premium üyeliğini iptal etmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const idToken = await currentUser.getIdToken();
      const response = await fetch('/api/admin/premium', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          action: 'cancel',
        }),
      });

      if (response.ok) {
        alert('Premium üyelik iptal edildi!');
        fetchPremiumUsers();
      } else {
        alert('İşlem başarısız!');
      }
    } catch (error) {
      console.error('Failed to cancel premium:', error);
      alert('Bir hata oluştu!');
    }
  };

  if (loading && premiumUsers.length === 0) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Premium Yönetimi</h1>
          <p className="text-gray-600 mt-1">Premium üyelikler ve gelir analizi</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Aylık Gelir"
            value={`${analytics.totalMonthlyRevenue.toLocaleString('tr-TR')}₺`}
            icon={<FiDollarSign size={32} />}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Yıllık Tahmini"
            value={`${analytics.totalYearlyRevenue.toLocaleString('tr-TR')}₺`}
            icon={<FiTrendingUp size={32} />}
          />
          <StatsCard
            title="Premium Kullanıcı"
            value={(analytics.monthlySubscribers + analytics.yearlySubscribers).toLocaleString('tr-TR')}
            icon={<FiStar size={32} />}
            trend={{ value: analytics.newPremiumLast30Days, isPositive: true }}
          />
          <StatsCard
            title="Son 30 Gün"
            value={`+${analytics.newPremiumLast30Days}`}
            icon={<FiAward size={32} />}
          />
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Gelir & Abonelik Grafiği (Son 6 Ay)</h2>
          <div className="h-80">
            <PremiumRevenueChart data={revenueData} />
          </div>
        </div>

        {/* Subscription Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Abonelik Dağılımı</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Aylık Abonelikler</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {analytics.monthlySubscribers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Yıllık Abonelikler</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {analytics.yearlySubscribers}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Gelir Dağılımı</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Aylık Abonelikler</span>
                <span className="font-semibold text-gray-900">
                  {(analytics.monthlySubscribers * 29).toLocaleString('tr-TR')}₺
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Yıllık Abonelikler (Aylık)</span>
                <span className="font-semibold text-gray-900">
                  {Math.round((analytics.yearlySubscribers * 200) / 12).toLocaleString('tr-TR')}₺
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Toplam Aylık</span>
                  <span className="font-bold text-primary-600 text-xl">
                    {analytics.totalMonthlyRevenue.toLocaleString('tr-TR')}₺
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Users Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Premium Kullanıcılar</h2>
            <span className="badge-warning">
              <FiUsers className="inline w-4 h-4 mr-1" />
              {premiumUsers.length} kullanıcı
            </span>
          </div>

          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Kullanıcı</th>
                  <th className="table-header-cell">E-posta</th>
                  <th className="table-header-cell">Abonelik Tipi</th>
                  <th className="table-header-cell">Başlangıç</th>
                  <th className="table-header-cell">Bitiş</th>
                  <th className="table-header-cell">Kalan Süre</th>
                  <th className="table-header-cell">Çalışma Süresi</th>
                  <th className="table-header-cell text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {premiumUsers.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center">
                            {user.displayName}
                            <FiStar className="w-4 h-4 ml-1 text-yellow-500" />
                          </div>
                          <div className="text-xs text-gray-500">{user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{user.email}</span>
                    </td>
                    <td className="table-cell">
                      {user.premiumType === 'monthly' ? (
                        <span className="badge-primary">Aylık (29₺)</span>
                      ) : (
                        <span className="badge-warning">Yıllık (200₺)</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatDate(user.premiumStartedAt)}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatDate(user.premiumUntil)}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{getDaysRemaining(user.premiumUntil)}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatMinutes(user.totalMinutes)}</span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowExtendModal(true);
                          }}
                          className="btn-primary text-sm py-1 px-3"
                          title="Premium Süresini Uzat"
                        >
                          Uzat
                        </button>
                        <button
                          onClick={() => handleCancelPremium(user)}
                          className="btn-danger text-sm py-1 px-3"
                          title="Premium İptal Et"
                        >
                          İptal
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki
          </button>
          <span className="text-gray-700">
            Sayfa {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
          </button>
        </div>

        {/* Extend Premium Modal */}
        {showExtendModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowExtendModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Premium Süresini Uzat</h3>
                <button
                  onClick={() => setShowExtendModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">{selectedUser.displayName}</span> için premium süresini uzatın
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Mevcut Bitiş:</span>
                      <span className="font-medium">{formatDate(selectedUser.premiumUntil)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kalan Süre:</span>
                      <span className="font-medium">{getDaysRemaining(selectedUser.premiumUntil)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uzatma Süresi (Gün)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[30, 60, 90, 365].map((days) => (
                      <button
                        key={days}
                        onClick={() => setExtendDuration(days)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          extendDuration === days
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {days} gün
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={extendDuration}
                    onChange={(e) => setExtendDuration(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                    max="730"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                  <strong>Yeni bitiş tarihi:</strong>{' '}
                  {new Date(
                    new Date(selectedUser.premiumUntil || new Date()).getTime() +
                      extendDuration * 24 * 60 * 60 * 1000
                  ).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setShowExtendModal(false)}
                  className="btn-secondary"
                >
                  İptal
                </button>
                <button onClick={handleExtendPremium} className="btn-primary">
                  Süreyi Uzat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
