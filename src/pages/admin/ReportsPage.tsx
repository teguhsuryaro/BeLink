import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, Check, Search, Eye, MessageSquare, Ban, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/lib/supabase';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { cn, formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/Input';

type ReportStatus = 'open' | 'reviewed' | 'resolved' | 'dismissed';

interface Report {
  id: string;
  reporter_id: string;
  reported_id: string;
  order_id: string | null;
  reason: string;
  status: ReportStatus;
  admin_notes: string | null;
  created_at: string;
  reporter: { full_name: string; avatar_url: string | null; email: string };
  reported: { full_name: string; avatar_url: string | null; email: string; is_banned: boolean; role: string };
}

export default function ReportsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ReportStatus>('open');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  
  const [banModalOpen, setBanModalOpen] = useState(false);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin', 'reports', activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:profiles!reports_reporter_id_fkey (full_name, avatar_url, email),
          reported:profiles!reports_reported_id_fkey (full_name, avatar_url, email, is_banned, role)
        `)
        .eq('status', activeTab)
        .order('created_at', { ascending: activeTab === 'open' || activeTab === 'reviewed' });

      if (error) throw error;
      return data as Report[];
    },
  });

  const handleUpdateStatus = async (reportId: string, newStatus: ReportStatus) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      toast.success(`Status laporan diperbarui ke ${newStatus}`);
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Gagal memperbarui status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedReport) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: 'resolved', admin_notes: adminNotes })
        .eq('id', selectedReport.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      toast.success('Laporan diselesaikan');
      setResolveModalOpen(false);
      setAdminNotes('');
      setSelectedReport(null);
    } catch (error) {
      console.error('Resolve error:', error);
      toast.error('Gagal menyelesaikan laporan');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBanUser = async () => {
    if (!selectedReport) return;
    setIsProcessing(true);
    try {
      // 1. Ban user
      const { error: banError } = await supabase
        .from('profiles')
        .update({ is_banned: true, is_online: false })
        .eq('id', selectedReport.reported_id);

      if (banError) throw banError;

      // 2. Offline if mitra
      if (['mitra_independen', 'mitra_bengkel'].includes(selectedReport.reported.role)) {
        await supabase
          .from('mitra_profiles')
          .update({ is_accepting_orders: false })
          .eq('id', selectedReport.reported_id);
      }

      // 3. Resolve report
      const note = adminNotes || 'Tindakan: Pengguna di-ban secara permanen.';
      const { error: resolveError } = await supabase
        .from('reports')
        .update({ status: 'resolved', admin_notes: note })
        .eq('id', selectedReport.id);
        
      if (resolveError) throw resolveError;

      await queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      
      toast.success('Pengguna berhasil di-ban dan laporan diselesaikan');
      setBanModalOpen(false);
      setAdminNotes('');
      setSelectedReport(null);
    } catch (error) {
      console.error('Ban error:', error);
      toast.error('Gagal mem-ban pengguna');
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs: { id: ReportStatus; label: string }[] = [
    { id: 'open', label: 'Terbuka' },
    { id: 'reviewed', label: 'Ditinjau' },
    { id: 'resolved', label: 'Selesai' },
    { id: 'dismissed', label: 'Diabaikan' },
  ];

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-danger" />
            Manajemen Laporan
          </h1>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            Tinjau dan ambil tindakan atas keluhan atau pelanggaran antar pengguna.
          </p>
        </div>

        {/* Tabs */}
        <div className="no-scrollbar flex overflow-x-auto border-b border-border-light dark:border-border-dark">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted-light hover:border-gray-300 hover:text-gray-700 dark:text-text-muted-dark dark:hover:border-gray-600 dark:hover:text-gray-300'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="reportTabBubble"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <Card 
                key={report.id} 
                className={cn(
                  "overflow-hidden border p-0",
                  report.status === 'open' ? 'border-l-4 border-l-danger border-border-light dark:border-border-dark' :
                  report.status === 'reviewed' ? 'border-l-4 border-l-warning border-border-light dark:border-border-dark' :
                  report.status === 'resolved' ? 'border-l-4 border-l-success border-border-light dark:border-border-dark' :
                  'border-border-light dark:border-border-dark opacity-70'
                )}
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Users Info side-by-side */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 border-r-0 md:border-r border-border-light dark:border-border-dark md:pr-6">
                      
                      {/* Pelapor */}
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark font-medium mb-2 uppercase tracking-wider">
                          Pelapor
                        </div>
                        <div className="flex items-center gap-3">
                          <img 
                            src={report.reporter.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reporter.full_name)}&background=random`}
                            alt={report.reporter.full_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold text-text-primary-light dark:text-text-primary-dark text-sm">
                              {report.reporter.full_name}
                            </div>
                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                              {report.reporter.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dilaporkan */}
                      <div className="bg-danger/5 dark:bg-danger/10 rounded-lg p-3">
                        <div className="text-xs text-danger font-medium mb-2 uppercase tracking-wider">
                          Terlapor
                        </div>
                        <div className="flex items-center gap-3">
                          <img 
                            src={report.reported.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reported.full_name)}&background=random`}
                            alt={report.reported.full_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold text-text-primary-light dark:text-text-primary-dark text-sm flex items-center gap-1">
                              {report.reported.full_name}
                              {report.reported.is_banned && <Badge variant="danger" className="text-[10px] px-1 py-0 h-4">Banned</Badge>}
                            </div>
                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                              {report.reported.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Report Reason */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            variant={report.status === 'open' ? 'danger' : report.status === 'reviewed' ? 'warning' : report.status === 'resolved' ? 'success' : 'neutral'}
                          >
                            {report.status}
                          </Badge>
                          <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            {formatDate(report.created_at)}
                          </span>
                        </div>
                        
                        <div className="mt-3 space-y-1">
                          <h4 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-1.5">
                            <MessageSquare className="h-4 w-4" /> Alasan Laporan:
                          </h4>
                          <p className="text-sm text-text-muted-light dark:text-text-muted-dark italic border-l-2 border-border-light dark:border-border-dark pl-3 py-1">
                            "{report.reason}"
                          </p>
                        </div>
                        
                        {report.order_id && (
                          <div className="mt-3">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/order/${report.order_id}`)} className="h-7 px-2 text-xs">
                              Lihat Order Terkait <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        )}
                        
                        {report.admin_notes && (
                          <div className="mt-3 bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs">
                            <strong>Catatan Admin:</strong> {report.admin_notes}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Actions */}
                {(report.status === 'open' || report.status === 'reviewed') && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 md:px-6 border-t border-border-light dark:border-border-dark flex flex-wrap justify-end gap-2">
                    {report.status === 'open' && (
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                        disabled={isProcessing}
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        Tinjau
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                      disabled={isProcessing}
                    >
                      Abaikan
                    </Button>
                    <Button 
                      variant="success"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setAdminNotes('');
                        setResolveModalOpen(true);
                      }}
                      disabled={isProcessing}
                      leftIcon={<Check className="h-4 w-4" />}
                    >
                      Selesaikan
                    </Button>
                    {!report.reported.is_banned && (
                      <Button 
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setAdminNotes('Pengguna di-ban permanen karena pelanggaran.');
                          setBanModalOpen(true);
                        }}
                        disabled={isProcessing}
                        leftIcon={<Ban className="h-4 w-4" />}
                      >
                        Ban Terlapor
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="py-20 text-center border rounded-xl border-dashed border-border-light dark:border-border-dark">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Tidak Ada Laporan
              </h3>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                Tidak ada laporan masuk pada kategori ini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      <Modal open={resolveModalOpen} onOpenChange={setResolveModalOpen} title="Selesaikan Laporan">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              Catatan Penyelesaian (Opsional)
            </label>
            <Input
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Misal: Sudah diberikan teguran pertama."
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setResolveModalOpen(false)} disabled={isProcessing}>
              Batal
            </Button>
            <Button variant="success" onClick={handleResolve} isLoading={isProcessing}>
              Simpan & Selesaikan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Ban Confirm Modal */}
      <Modal open={banModalOpen} onOpenChange={setBanModalOpen} title="Ban Pengguna">
        <div className="space-y-4">
          <p className="text-text-primary-light dark:text-text-primary-dark">
            Tindakan ini akan <strong>me-suspend</strong> {selectedReport?.reported.full_name} dan menandai laporan ini sebagai "Selesai".
          </p>
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              Catatan Penalti (Opsional)
            </label>
            <Input
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setBanModalOpen(false)} disabled={isProcessing}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleBanUser} isLoading={isProcessing}>
              Ya, Ban Pengguna
            </Button>
          </div>
        </div>
      </Modal>

    </PageTransition>
  );
}
