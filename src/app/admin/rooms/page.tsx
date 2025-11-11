'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { auth } from '@/lib/firebase-client';
import { FiHome, FiSearch, FiMoreVertical, FiEye, FiLock, FiTrash2, FiUsers, FiActivity } from 'react-icons/fi';

interface Room {
  id: string;
  name: string;
  description: string;
  hostId: string;
  hostName: string;
  memberCount: number;
  isPrivate: boolean;
  category: string;
  createdAt: Date | null;
  lastActivityAt: Date | null;
  hasReports: boolean;
}

export default function RoomsManagementPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, [page, filter]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;
      
      const idToken = await user.getIdToken();
      const response = await fetch(
        `/api/admin/rooms?page=${page}&limit=20&filter=${filter}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomAction = async (roomId: string, action: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const idToken = await user.getIdToken();
      let response;
      
      if (action === 'delete') {
        response = await fetch(`/api/admin/rooms?roomId=${roomId}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${idToken}`,
          },
        });
      } else {
        response = await fetch('/api/admin/rooms', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({ roomId, action }),
        });
      }

      if (response.ok) {
        fetchRooms();
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

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, string> = {
      study: 'badge-primary',
      work: 'badge-warning',
      coding: 'badge-success',
      reading: 'badge-gray',
      other: 'badge-gray',
    };
    return badges[category] || 'badge-gray';
  };

  if (loading && rooms.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Oda Yönetimi</h1>
            <p className="text-gray-600 mt-1">Tüm çalışma odalarını görüntüle ve yönet</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="badge-primary">
              <FiHome className="inline w-4 h-4 mr-1" />
              {rooms.length} oda
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
                  placeholder="Oda adı ara..."
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
                <option value="active">Aktif</option>
                <option value="private">Özel</option>
                <option value="reported">Şikayetli</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="card p-0">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Oda</th>
                  <th className="table-header-cell">Kategori</th>
                  <th className="table-header-cell">Host</th>
                  <th className="table-header-cell">Üyeler</th>
                  <th className="table-header-cell">Durum</th>
                  <th className="table-header-cell">Oluşturulma</th>
                  <th className="table-header-cell">Son Aktivite</th>
                  <th className="table-header-cell text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {rooms.map((room) => (
                  <tr key={room.id} className="table-row">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center">
                          {room.isPrivate && <FiLock className="w-3 h-3 mr-1 text-gray-400" />}
                          {room.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {room.description?.substring(0, 50)}
                          {room.description && room.description.length > 50 && '...'}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={getCategoryBadge(room.category)}>
                        {room.category}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="text-gray-900">{room.hostName}</div>
                        <div className="text-xs text-gray-500">{room.hostId.substring(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <FiUsers className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-gray-700">{room.memberCount}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        {room.hasReports && (
                          <span className="badge-danger">Şikayetli</span>
                        )}
                        {room.isPrivate && (
                          <span className="badge-gray">Özel</span>
                        )}
                        {!room.hasReports && !room.isPrivate && (
                          <span className="badge-success">Aktif</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatDate(room.createdAt)}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <FiActivity className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-gray-700">{formatDate(room.lastActivityAt)}</span>
                      </div>
                    </td>
                    <td className="table-cell text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === room.id ? null : room.id)}
                          className="btn-ghost p-2"
                        >
                          <FiMoreVertical className="w-5 h-5" />
                        </button>
                        
                        {showActionMenu === room.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedRoom(room);
                                  setShowActionMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <FiEye className="w-4 h-4 mr-2" />
                                Detayları Gör
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (confirm(`${room.name} odasını devre dışı bırakmak istediğinize emin misiniz? Kullanıcılar bu odaya erişemeyecek.`)) {
                                    handleRoomAction(room.id, 'disable');
                                  }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 flex items-center"
                              >
                                <FiLock className="w-4 h-4 mr-2" />
                                Devre Dışı Bırak
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (confirm('Bu odayı silmek istediğinize emin misiniz?')) {
                                    handleRoomAction(room.id, 'delete');
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

        {/* Room Detail Modal */}
        {selectedRoom && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedRoom(null)}
          >
            <div 
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Oda Detayları</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Oda Adı</label>
                  <p className="text-gray-900">{selectedRoom.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Açıklama</label>
                  <p className="text-gray-900">{selectedRoom.description || 'Açıklama yok'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Oda ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedRoom.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Host</label>
                  <p className="text-gray-900">{selectedRoom.hostName}</p>
                  <p className="text-xs text-gray-500 font-mono">{selectedRoom.hostId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Üye Sayısı</label>
                  <p className="text-gray-900">{selectedRoom.memberCount} kişi</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Kategori</label>
                  <span className={getCategoryBadge(selectedRoom.category)}>
                    {selectedRoom.category}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Durum</label>
                  <div className="flex gap-2 mt-1">
                    {selectedRoom.isPrivate && <span className="badge-gray">Özel Oda</span>}
                    {selectedRoom.hasReports && <span className="badge-danger">Şikayetli</span>}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="btn-secondary flex-1"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    if (confirm('Bu odayı silmek istediğinize emin misiniz?')) {
                      handleRoomAction(selectedRoom.id, 'delete');
                      setSelectedRoom(null);
                    }
                  }}
                  className="btn-danger flex-1"
                >
                  Odayı Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
