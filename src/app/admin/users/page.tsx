'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import TableSkeleton from '@/components/admin/TableSkeleton';
import ErrorState from '@/components/admin/ErrorState';
import EmptyState from '@/components/admin/EmptyState';
import { auth } from '@/lib/firebase-client';
import { FiUsers, FiSearch, FiFilter, FiMoreVertical, FiShield, FiTrash2, FiDollarSign, FiEye } from 'react-icons/fi';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isPremium: boolean;
  isBanned: boolean;
  totalMinutes: number;
  createdAt: Date | null;
  lastActiveAt: Date | null;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        setError('Oturum açmanız gerekiyor.');
        return;
      }
      
      const idToken = await user.getIdToken();
      const response = await fetch(
        `/api/admin/users?page=${page}&limit=20&filter=${filter}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setError('Kullanıcılar yüklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string, data?: any) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Oturum açmanız gerekiyor.');
        return;
      }
      
      const idToken = await user.getIdToken();
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userId, action, data }),
      });

      if (response.ok) {
        fetchUsers();
        setShowActionMenu(null);
        alert('İşlem başarılı!');
      } else {
        alert('İşlem başarısız!');
      }
    } catch (error) {
      console.error('Failed to perform action:', error);
      alert('Bir hata oluştu!');
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

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            <p className="text-gray-600 mt-1">Tüm kullanıcıları görüntüle ve yönet</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="badge-primary">
              <FiUsers className="inline w-4 h-4 mr-1" />
              {users.length} kullanıcı
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="E-posta veya isim ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-primary pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-primary"
              >
                <option value="all">Tümü</option>
                <option value="premium">Premium</option>
                <option value="banned">Yasaklı</option>
                <option value="recent">Son 7 Gün</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          {loading ? (
            <TableSkeleton rows={20} columns={7} />
          ) : error ? (
            <ErrorState 
              message={error}
              onRetry={fetchUsers}
            />
          ) : filteredUsers.length === 0 ? (
            <EmptyState 
              title="Kullanıcı Bulunamadı"
              message={searchTerm ? `"${searchTerm}" için sonuç bulunamadı.` : 'Henüz kayıtlı kullanıcı yok.'}
              icon={<FiUsers className="w-8 h-8 text-gray-400" />}
            />
          ) : (
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Kullanıcı</th>
                    <th className="table-header-cell">E-posta</th>
                    <th className="table-header-cell">Durum</th>
                    <th className="table-header-cell">Çalışma Süresi</th>
                    <th className="table-header-cell">Kayıt Tarihi</th>
                    <th className="table-header-cell">Son Aktif</th>
                    <th className="table-header-cell text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredUsers.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.displayName}</div>
                          <div className="text-xs text-gray-500">{user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{user.email}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        {user.isPremium && (
                          <span className="badge-warning">
                            <FiDollarSign className="w-3 h-3 mr-1 inline" />
                            Premium
                          </span>
                        )}
                        {user.isBanned && (
                          <span className="badge-danger">
                            <FiShield className="w-3 h-3 mr-1 inline" />
                            Yasaklı
                          </span>
                        )}
                        {!user.isPremium && !user.isBanned && (
                          <span className="badge-gray">Ücretsiz</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatMinutes(user.totalMinutes)}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatDate(user.createdAt)}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatDate(user.lastActiveAt)}</span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                          className="btn-ghost p-2"
                        >
                          <FiMoreVertical className="w-5 h-5" />
                        </button>
                        
                        {showActionMenu === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowActionMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <FiEye className="w-4 h-4 mr-2" />
                                Detayları Gör
                              </button>
                              
                              {!user.isBanned ? (
                                <button
                                  onClick={() => {
                                    if (confirm(`${user.displayName} kullanıcısını yasaklamak istediğinize emin misiniz? Kullanıcı uygulamaya giriş yapamayacak.`)) {
                                      handleUserAction(user.id, 'ban');
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                                >
                                  <FiShield className="w-4 h-4 mr-2" />
                                  Yasakla
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (confirm(`${user.displayName} kullanıcısının yasağını kaldırmak istediğinize emin misiniz?`)) {
                                      handleUserAction(user.id, 'unban');
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center"
                                >
                                  <FiShield className="w-4 h-4 mr-2" />
                                  Yasağı Kaldır
                                </button>
                              )}
                              
                              <button
                                onClick={() => {
                                  if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
                                    handleUserAction(user.id, 'delete');
                                  }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                              >
                                <FiTrash2 className="w-4 h-4 mr-2" />
                                Sil
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
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

        {/* User Detail Modal */}
        {selectedUser && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedUser(null)}
          >
            <div 
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Kullanıcı Detayları</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">İsim</label>
                  <p className="text-gray-900">{selectedUser.displayName}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">E-posta</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Kullanıcı ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedUser.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Toplam Çalışma Süresi</label>
                  <p className="text-gray-900">{formatMinutes(selectedUser.totalMinutes)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Durum</label>
                  <div className="flex gap-2 mt-1">
                    {selectedUser.isPremium && <span className="badge-warning">Premium</span>}
                    {selectedUser.isBanned && <span className="badge-danger">Yasaklı</span>}
                    {!selectedUser.isPremium && !selectedUser.isBanned && (
                      <span className="badge-gray">Ücretsiz</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn-secondary flex-1"
                >
                  Kapat
                </button>
                {!selectedUser.isPremium && (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser.id, 'setPremium', {
                        isPremium: true,
                        premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                      });
                      setSelectedUser(null);
                    }}
                    className="btn-primary flex-1"
                  >
                    Premium Ver
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
