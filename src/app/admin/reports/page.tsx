'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { auth } from '@/lib/firebase-client';
import { FiAlertTriangle, FiCheck, FiX, FiEye, FiSearch, FiMessageSquare, FiUser } from 'react-icons/fi';

interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reportType: string;
  reason: string;
  description: string;
  status: string;
  createdAt: Date | null;
  resolvedAt: Date | null;
  resolvedBy?: string;
  roomId?: string;
  messageId?: string;
}

interface MessageReport {
  id: string;
  roomId: string;
  reportedMessages: Array<{
    messageId: string;
    content: string;
    timestamp: { seconds: number; nanoseconds: number };
    isQuickMessage: boolean;
  }>;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserAvatar: string;
  reporterUserId: string;
  reporterUserName: string;
  reporterUserAvatar: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: Date | null;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  adminNotes: string | null;
}

interface UserReport {
  id: string;
  roomId: string;
  roomName: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserAvatar: string;
  reporterUserId: string;
  reporterUserName: string;
  reporterUserAvatar: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: Date | null;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  adminNotes: string | null;
}

export default function ReportsManagementPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [messageReports, setMessageReports] = useState<MessageReport[]>([]);
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportTypeFilter, setReportTypeFilter] = useState('all'); // all, user, message, userReport
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedMessageReport, setSelectedMessageReport] = useState<MessageReport | null>(null);
  const [selectedUserReport, setSelectedUserReport] = useState<UserReport | null>(null);
  const [resolveNotes, setResolveNotes] = useState('');

  useEffect(() => {
    fetchReports();
  }, [page, statusFilter, reportTypeFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;
      
      const idToken = await user.getIdToken();

      // Fetch user reports
      if (reportTypeFilter === 'all' || reportTypeFilter === 'user') {
        const userReportsResponse = await fetch(
          `/api/admin/reports?page=${page}&limit=20&status=${statusFilter}`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );
        
        if (userReportsResponse.ok) {
          const data = await userReportsResponse.json();
          setReports(data.reports || []);
          if (reportTypeFilter === 'user') {
            setTotalPages(data.totalPages || 1);
          }
        }
      } else {
        setReports([]);
      }

      // Fetch message reports
      if (reportTypeFilter === 'all' || reportTypeFilter === 'message') {
        const messageReportsResponse = await fetch(
          `/api/admin/message-reports?page=${page}&limit=20&status=${statusFilter}`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );
        
        if (messageReportsResponse.ok) {
          const data = await messageReportsResponse.json();
          setMessageReports(data.reports || []);
          if (reportTypeFilter === 'message') {
            setTotalPages(data.totalPages || 1);
          } else if (reportTypeFilter === 'all') {
            // Combine total pages for all types
            setTotalPages(Math.max(data.totalPages || 1, totalPages));
          }
        }
      } else {
        setMessageReports([]);
      }

      // Fetch user reports (oda-based user reports)
      if (reportTypeFilter === 'all' || reportTypeFilter === 'userReport') {
        const userReportsResponse = await fetch(
          `/api/admin/user-reports?page=${page}&limit=20&status=${statusFilter}`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );
        
        if (userReportsResponse.ok) {
          const data = await userReportsResponse.json();
          setUserReports(data.reports || []);
          if (reportTypeFilter === 'userReport') {
            setTotalPages(data.totalPages || 1);
          } else if (reportTypeFilter === 'all') {
            // Combine total pages for all types
            setTotalPages(Math.max(data.totalPages || 1, totalPages));
          }
        }
      } else {
        setUserReports([]);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: string, notes?: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const idToken = await user.getIdToken();
      const response = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ 
          reportId, 
          action, 
          adminId: user.email || 'admin',
          notes 
        }),
      });

      if (response.ok) {
        fetchReports();
        setSelectedReport(null);
        setResolveNotes('');
        alert('İşlem başarılı!');
      } else {
        alert('İşlem başarısız!');
      }
    } catch (error) {
      console.error('Failed to perform action:', error);
      alert('Bir hata oluştu!');
    }
  };

  const handleMessageReportAction = async (reportId: string, status: string, notes?: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const idToken = await user.getIdToken();
      const response = await fetch('/api/admin/message-reports', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ 
          reportId, 
          status, 
          adminId: user.email || 'admin',
          notes 
        }),
      });

      if (response.ok) {
        fetchReports();
        setSelectedMessageReport(null);
        setResolveNotes('');
        alert('İşlem başarılı!');
      } else {
        const error = await response.json();
        alert(`İşlem başarısız: ${error.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Failed to perform action:', error);
      alert('Bir hata oluştu!');
    }
  };

  const handleUserReportAction = async (reportId: string, status: string, notes?: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const idToken = await user.getIdToken();
      const response = await fetch('/api/admin/user-reports', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ 
          reportId, 
          status, 
          adminId: user.email || 'admin',
          notes 
        }),
      });

      if (response.ok) {
        fetchReports();
        setSelectedUserReport(null);
        setResolveNotes('');
        alert('İşlem başarılı!');
      } else {
        const error = await response.json();
        alert(`İşlem başarısız: ${error.error || 'Bilinmeyen hata'}`);
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReasonLabel = (reason: string) => {
    const reasonMap: { [key: string]: string } = {
      'spam': 'Spam/Reklam',
      'harassment': 'Taciz/Tehdit',
      'inappropriate': 'Uygunsuz İçerik',
      'insult': 'Hakaret',
      'fraud': 'Dolandırıcılık',
      'other': 'Diğer',
    };
    return reasonMap[reason] || reason;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="badge-warning">Beklemede</span>;
      case 'reviewing':
        return <span className="badge-primary">İnceleniyor</span>;
      case 'resolved':
        return <span className="badge-success">Çözüldü</span>;
      case 'rejected':
        return <span className="badge-danger">Reddedildi</span>;
      default:
        return <span className="badge-gray">{status}</span>;
    }
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'user':
        return <span className="badge-primary">Kullanıcı</span>;
      case 'room':
        return <span className="badge-warning">Oda</span>;
      case 'message':
        return <span className="badge-gray">Mesaj</span>;
      default:
        return <span className="badge-gray">{type}</span>;
    }
  };

  if (loading && reports.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Şikayet Yönetimi</h1>
            <p className="text-gray-600 mt-1">Kullanıcı ve mesaj şikayetlerini görüntüle ve yönet</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="badge-warning">
              <FiAlertTriangle className="inline w-4 h-4 mr-1" />
              {reports.filter(r => r.status === 'pending').length + messageReports.filter(r => r.status === 'pending').length} beklemede
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
                  placeholder="Şikayet ara..."
                  className="input-primary pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={reportTypeFilter}
                onChange={(e) => {
                  setReportTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="input-primary"
              >
                <option value="all">Tüm Tipler</option>
                <option value="user">Kullanıcı Şikayetleri (Eski)</option>
                <option value="userReport">Kullanıcı Şikayetleri (Oda)</option>
                <option value="message">Mesaj Şikayetleri</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="input-primary"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Beklemede</option>
                <option value="reviewing">İnceleniyor</option>
                <option value="resolved">Çözüldü</option>
                <option value="rejected">Reddedildi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="card p-0">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Tip</th>
                  <th className="table-header-cell">Şikayet Eden</th>
                  <th className="table-header-cell">Şikayet Edilen</th>
                  <th className="table-header-cell">Sebep</th>
                  <th className="table-header-cell">Durum</th>
                  <th className="table-header-cell">Tarih</th>
                  <th className="table-header-cell text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {/* User Reports */}
                {(reportTypeFilter === 'all' || reportTypeFilter === 'user') && reports.map((report) => (
                  <tr key={`user-${report.id}`} className="table-row">
                    <td className="table-cell">
                      <span className="badge-primary flex items-center gap-1">
                        <FiUser className="w-3 h-3" />
                        Kullanıcı
                      </span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="text-gray-900">{report.reporterName}</div>
                        <div className="text-xs text-gray-500">{report.reporterId.substring(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="text-gray-900">{report.reportedUserName}</div>
                        <div className="text-xs text-gray-500">{report.reportedUserId.substring(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900">{getReasonLabel(report.reason)}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {report.description || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatDate(report.createdAt)}</span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="btn-ghost p-2"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* Message Reports */}
                {(reportTypeFilter === 'all' || reportTypeFilter === 'message') && messageReports.map((report) => (
                  <tr key={`message-${report.id}`} className="table-row">
                    <td className="table-cell">
                      <span className="badge-secondary flex items-center gap-1">
                        <FiMessageSquare className="w-3 h-3" />
                        Mesaj ({report.reportedMessages.length})
                      </span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="text-gray-900">{report.reporterUserName}</div>
                        <div className="text-xs text-gray-500">{report.reporterUserId.substring(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="text-gray-900">{report.reportedUserName}</div>
                        <div className="text-xs text-gray-500">{report.reportedUserId.substring(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900">{getReasonLabel(report.reason)}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {report.description || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatDate(report.createdAt)}</span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSelectedMessageReport(report)}
                        className="btn-ghost p-2"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* User Reports (Room-based) */}
                {(reportTypeFilter === 'all' || reportTypeFilter === 'userReport') && userReports.map((report) => (
                  <tr key={`userreport-${report.id}`} className="table-row">
                    <td className="table-cell">
                      <span className="badge bg-orange-100 text-orange-800 flex items-center gap-1">
                        <FiUser className="w-3 h-3" />
                        Kullanıcı (Oda)
                      </span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="text-gray-900">{report.reporterUserName}</div>
                        <div className="text-xs text-gray-500">{report.reporterUserId.substring(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="text-gray-900">{report.reportedUserName}</div>
                        <div className="text-xs text-gray-500">{report.reportedUserId.substring(0, 8)}...</div>
                        <div className="text-xs text-blue-600 mt-1">Oda: {report.roomName}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900">{getReasonLabel(report.reason)}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {report.description || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="table-cell">
                      <span className="text-gray-700">{formatDate(report.createdAt)}</span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSelectedUserReport(report)}
                        className="btn-ghost p-2"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* Empty State */}
                {reports.length === 0 && messageReports.length === 0 && userReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="text-gray-500">Hiç şikayet bulunamadı</div>
                    </td>
                  </tr>
                )}
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

        {/* Report Detail Modal */}
        {selectedReport && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedReport(null)}
          >
            <div 
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Şikayet Detayları</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Şikayet ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedReport.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Şikayet Eden</label>
                    <p className="text-gray-900">{selectedReport.reporterName}</p>
                    <p className="text-xs text-gray-500 font-mono">{selectedReport.reporterId}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Şikayet Edilen</label>
                    <p className="text-gray-900">{selectedReport.reportedUserName}</p>
                    <p className="text-xs text-gray-500 font-mono">{selectedReport.reportedUserId}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tip</label>
                  <div className="mt-1">
                    {getReportTypeBadge(selectedReport.reportType)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Sebep</label>
                  <p className="text-gray-900">{selectedReport.reason}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Açıklama</label>
                  <p className="text-gray-900">{selectedReport.description || 'Açıklama yok'}</p>
                </div>

                {selectedReport.roomId && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Oda ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedReport.roomId}</p>
                  </div>
                )}

                {selectedReport.messageId && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mesaj ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedReport.messageId}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Durum</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tarih</label>
                  <p className="text-gray-900">{formatDate(selectedReport.createdAt)}</p>
                </div>

                {selectedReport.status !== 'pending' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Çözülme Tarihi</label>
                      <p className="text-gray-900">{formatDate(selectedReport.resolvedAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Çözümleyen</label>
                      <p className="text-gray-900">{selectedReport.resolvedBy || '-'}</p>
                    </div>
                  </>
                )}

                {selectedReport.status === 'pending' && (
                  <div>
                    <label className="label-primary">Notlar (İsteğe Bağlı)</label>
                    <textarea
                      value={resolveNotes}
                      onChange={(e) => setResolveNotes(e.target.value)}
                      className="input-primary"
                      rows={3}
                      placeholder="İşlem hakkında not ekleyin..."
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setResolveNotes('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Kapat
                </button>

                {selectedReport.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleReportAction(selectedReport.id, 'reject', resolveNotes)}
                      className="btn-danger flex-1"
                    >
                      <FiX className="inline w-4 h-4 mr-1" />
                      Reddet
                    </button>
                    <button
                      onClick={() => handleReportAction(selectedReport.id, 'resolve', resolveNotes)}
                      className="btn-success flex-1"
                    >
                      <FiCheck className="inline w-4 h-4 mr-1" />
                      Onayla
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message Report Detail Modal */}
        {selectedMessageReport && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedMessageReport(null)}
          >
            <div 
              className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiMessageSquare className="w-6 h-6" />
                Mesaj Şikayeti Detayları
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Rapor ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedMessageReport.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Şikayet Eden</label>
                    <p className="text-gray-900">{selectedMessageReport.reporterUserName}</p>
                    <p className="text-xs text-gray-500 font-mono">{selectedMessageReport.reporterUserId}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Şikayet Edilen</label>
                    <p className="text-gray-900">{selectedMessageReport.reportedUserName}</p>
                    <p className="text-xs text-gray-500 font-mono">{selectedMessageReport.reportedUserId}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Oda ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedMessageReport.roomId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Sebep</label>
                  <p className="text-gray-900 font-semibold">{getReasonLabel(selectedMessageReport.reason)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Açıklama</label>
                  <p className="text-gray-900">{selectedMessageReport.description || 'Açıklama yok'}</p>
                </div>

                {/* Reported Messages */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Şikayet Edilen Mesajlar ({selectedMessageReport.reportedMessages.length})
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                    {selectedMessageReport.reportedMessages.map((msg, idx) => (
                      <div key={msg.messageId} className="bg-white p-3 rounded border">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-mono text-gray-500">
                            #{idx + 1} - {msg.messageId.substring(0, 8)}...
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.timestamp.seconds * 1000).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <p className="text-gray-900 break-words">{msg.content}</p>
                        {msg.isQuickMessage && (
                          <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Hızlı Mesaj
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Durum</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedMessageReport.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Oluşturulma Tarihi</label>
                    <p className="text-gray-900">{formatDate(selectedMessageReport.createdAt)}</p>
                  </div>

                  {selectedMessageReport.reviewedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">İnceleme Tarihi</label>
                      <p className="text-gray-900">{formatDate(selectedMessageReport.reviewedAt)}</p>
                    </div>
                  )}
                </div>

                {selectedMessageReport.reviewedBy && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">İnceleyen</label>
                    <p className="text-gray-900">{selectedMessageReport.reviewedBy}</p>
                  </div>
                )}

                {selectedMessageReport.adminNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Admin Notları</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded border">{selectedMessageReport.adminNotes}</p>
                  </div>
                )}

                {selectedMessageReport.status === 'pending' && (
                  <div>
                    <label className="label-primary">Admin Notları (İsteğe Bağlı)</label>
                    <textarea
                      value={resolveNotes}
                      onChange={(e) => setResolveNotes(e.target.value)}
                      className="input-primary"
                      rows={3}
                      placeholder="İşlem hakkında not ekleyin..."
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedMessageReport(null);
                    setResolveNotes('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Kapat
                </button>

                {selectedMessageReport.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleMessageReportAction(selectedMessageReport.id, 'reviewing', resolveNotes)}
                      className="btn-primary flex-1"
                    >
                      <FiEye className="inline w-4 h-4 mr-1" />
                      İnceleniyor
                    </button>
                    <button
                      onClick={() => handleMessageReportAction(selectedMessageReport.id, 'rejected', resolveNotes)}
                      className="btn-danger flex-1"
                    >
                      <FiX className="inline w-4 h-4 mr-1" />
                      Reddet
                    </button>
                    <button
                      onClick={() => handleMessageReportAction(selectedMessageReport.id, 'resolved', resolveNotes)}
                      className="btn-success flex-1"
                    >
                      <FiCheck className="inline w-4 h-4 mr-1" />
                      Çözüldü
                    </button>
                  </>
                )}

                {selectedMessageReport.status === 'reviewing' && (
                  <>
                    <button
                      onClick={() => handleMessageReportAction(selectedMessageReport.id, 'rejected', resolveNotes)}
                      className="btn-danger flex-1"
                    >
                      <FiX className="inline w-4 h-4 mr-1" />
                      Reddet
                    </button>
                    <button
                      onClick={() => handleMessageReportAction(selectedMessageReport.id, 'resolved', resolveNotes)}
                      className="btn-success flex-1"
                    >
                      <FiCheck className="inline w-4 h-4 mr-1" />
                      Çözüldü
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Report Detail Modal */}
        {selectedUserReport && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedUserReport(null)}
          >
            <div 
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Kullanıcı Şikayeti Detayları</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Şikayet ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedUserReport.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Şikayet Eden</label>
                    <p className="text-gray-900">{selectedUserReport.reporterUserName}</p>
                    <p className="text-xs text-gray-500 font-mono">{selectedUserReport.reporterUserId}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Şikayet Edilen</label>
                    <p className="text-gray-900">{selectedUserReport.reportedUserName}</p>
                    <p className="text-xs text-gray-500 font-mono">{selectedUserReport.reportedUserId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Oda ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedUserReport.roomId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Oda Adı</label>
                    <p className="text-gray-900">{selectedUserReport.roomName}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Sebep</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded border">{getReasonLabel(selectedUserReport.reason)}</p>
                </div>

                {selectedUserReport.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Açıklama</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded border">{selectedUserReport.description}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Durum</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedUserReport.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Oluşturulma Tarihi</label>
                    <p className="text-gray-900">{formatDate(selectedUserReport.createdAt)}</p>
                  </div>

                  {selectedUserReport.reviewedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">İnceleme Tarihi</label>
                      <p className="text-gray-900">{formatDate(selectedUserReport.reviewedAt)}</p>
                    </div>
                  )}
                </div>

                {selectedUserReport.reviewedBy && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">İnceleyen</label>
                    <p className="text-gray-900">{selectedUserReport.reviewedBy}</p>
                  </div>
                )}

                {selectedUserReport.adminNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Admin Notları</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded border">{selectedUserReport.adminNotes}</p>
                  </div>
                )}

                {selectedUserReport.status === 'pending' && (
                  <div>
                    <label className="label-primary">Admin Notları (İsteğe Bağlı)</label>
                    <textarea
                      value={resolveNotes}
                      onChange={(e) => setResolveNotes(e.target.value)}
                      className="input-primary"
                      rows={3}
                      placeholder="İşlem hakkında not ekleyin..."
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedUserReport(null);
                    setResolveNotes('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Kapat
                </button>

                {selectedUserReport.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUserReportAction(selectedUserReport.id, 'reviewing', resolveNotes)}
                      className="btn-primary flex-1"
                    >
                      <FiEye className="inline w-4 h-4 mr-1" />
                      İnceleniyor
                    </button>
                    <button
                      onClick={() => handleUserReportAction(selectedUserReport.id, 'rejected', resolveNotes)}
                      className="btn-danger flex-1"
                    >
                      <FiX className="inline w-4 h-4 mr-1" />
                      Reddet
                    </button>
                    <button
                      onClick={() => handleUserReportAction(selectedUserReport.id, 'resolved', resolveNotes)}
                      className="btn-success flex-1"
                    >
                      <FiCheck className="inline w-4 h-4 mr-1" />
                      Çözüldü
                    </button>
                  </>
                )}

                {selectedUserReport.status === 'reviewing' && (
                  <>
                    <button
                      onClick={() => handleUserReportAction(selectedUserReport.id, 'rejected', resolveNotes)}
                      className="btn-danger flex-1"
                    >
                      <FiX className="inline w-4 h-4 mr-1" />
                      Reddet
                    </button>
                    <button
                      onClick={() => handleUserReportAction(selectedUserReport.id, 'resolved', resolveNotes)}
                      className="btn-success flex-1"
                    >
                      <FiCheck className="inline w-4 h-4 mr-1" />
                      Çözüldü
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
