import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, Check, X, MapPin, ZoomIn, Search } from 'lucide-react';
import { motion } from 'framer-motion';

import { supabase } from '@/lib/supabase';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MapView } from '@/components/map/MapView';
import { toast } from '@/components/ui/Toast';
import { cn, formatDate } from '@/lib/utils';
import type { MitraProfile } from '@/types/user.types';

type VerificationStatus = 'pending' | 'verified' | 'rejected';

export default function MitraVerificationPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<VerificationStatus>('pending');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectMitraId, setRejectMitraId] = useState<string | null>(null);

  const { data: mitraApplications = [], isLoading } = useQuery({
    queryKey: ['admin', 'mitra-verification', activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mitra_profiles')
        .select(`
          *,
          profiles!inner (full_name, email, avatar_url, phone)
        `)
        .eq('verification_status', activeTab)
        .order('created_at', { ascending: activeTab === 'pending' });

      if (error) throw error;
      return data as (MitraProfile & { 
        profiles: { full_name: string; email: string; avatar_url: string; phone: string | null } 
      })[];
    },
  });

  const handleApprove = async (mitraId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('mitra_profiles')
        .update({ verification_status: 'verified' })
        .eq('id', mitraId);

      if (error) throw error;

      await supabase.from('notifications').insert({
        user_id: mitraId,
        title: 'Pendaftaran Disetujui',
        body: 'Selamat! Pendaftaran mitra Anda telah disetujui. Anda sekarang bisa mulai menerima pesanan.',
        type: 'system',
      });

      await queryClient.invalidateQueries({ queryKey: ['admin', 'mitra-verification'] });
      toast.success('Mitra berhasil diverifikasi');
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Gagal menyetujui mitra');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (mitraId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('mitra_profiles')
        .update({ verification_status: 'rejected' })
        .eq('id', mitraId);

      if (error) throw error;

      await supabase.from('notifications').insert({
        user_id: mitraId,
        title: 'Pendaftaran Ditolak',
        body: 'Mohon maaf, pendaftaran mitra Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.',
        type: 'system',
      });

      await queryClient.invalidateQueries({ queryKey: ['admin', 'mitra-verification'] });
      toast.info('Pendaftaran mitra ditolak');
      setRejectMitraId(null);
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Gagal menolak pendaftaran mitra');
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs: { id: VerificationStatus; label: string }[] = [
    { id: 'pending', label: 'Menunggu' },
    { id: 'verified', label: 'Disetujui' },
    { id: 'rejected', label: 'Ditolak' },
  ];

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-warning" />
            Verifikasi Mitra
          </h1>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            Review dan setujui pendaftaran mitra mekanik dan bengkel baru.
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
                  layoutId="verificationTabBubble"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : mitraApplications.length > 0 ? (
            mitraApplications.map((app) => (
              <Card key={app.id} className="overflow-hidden border border-border-light dark:border-border-dark p-0">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  
                  {/* Left Column: Data */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={app.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.profiles.full_name)}&background=random`}
                          alt={app.profiles.full_name}
                          className="h-16 w-16 rounded-full object-cover border border-border-light dark:border-border-dark"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                            {app.profiles.full_name}
                          </h3>
                          <div className="text-sm text-text-muted-light dark:text-text-muted-dark space-y-0.5 mt-0.5">
                            <div>{app.profiles.email}</div>
                            {app.profiles.phone && <div>{app.profiles.phone}</div>}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={activeTab === 'pending' ? 'warning' : activeTab === 'verified' ? 'success' : 'danger'}
                      >
                        {activeTab === 'pending' ? 'Pending' : activeTab === 'verified' ? 'Verified' : 'Rejected'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-text-muted-light dark:text-text-muted-dark font-medium">Nama Bisnis/Bengkel</span>
                        <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                          {app.business_name || 'Tidak ada (Independen)'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-text-muted-light dark:text-text-muted-dark font-medium">Spesialisasi</span>
                        <div className="font-semibold text-text-primary-light dark:text-text-primary-dark capitalize">
                          {app.specializations?.join(', ') || '-'}
                        </div>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <span className="text-text-muted-light dark:text-text-muted-dark font-medium">Alamat</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark flex items-start gap-1">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                          <span>{app.address || 'Belum mengatur alamat'}</span>
                        </div>
                      </div>
                      {app.bio && (
                        <div className="space-y-1 sm:col-span-2">
                          <span className="text-text-muted-light dark:text-text-muted-dark font-medium">Bio</span>
                          <p className="text-text-primary-light dark:text-text-primary-dark italic">"{app.bio}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Documents & Map */}
                  <div className="flex-1 space-y-4 border-t md:border-t-0 md:border-l border-border-light dark:border-border-dark pt-6 md:pt-0 md:pl-8">
                    <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      Dokumen Pendaftaran
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'KTP', url: app.ktp_url },
                        { label: 'Selfie KTP', url: app.selfie_url },
                        { label: 'Foto Bengkel', url: app.workshop_photo_url }
                      ].map((doc, idx) => (
                        <div 
                          key={idx} 
                          className="relative aspect-square rounded-lg border border-border-light dark:border-border-dark overflow-hidden group cursor-pointer bg-gray-100 dark:bg-gray-800"
                          onClick={() => doc.url && setPreviewImage(doc.url)}
                        >
                          {doc.url ? (
                            <>
                              <img src={doc.url} alt={doc.label} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ZoomIn className="h-6 w-6 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center p-2">
                              {doc.label}<br/>Tidak Ada
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1 truncate px-1">
                            {doc.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 text-sm">
                        Lokasi Operasi
                      </h4>
                      <div className="h-32 w-full rounded-lg overflow-hidden border border-border-light dark:border-border-dark relative z-0">
                        {app.lat && app.lng ? (
                          <MapView 
                            markers={[{ id: app.id, lat: app.lat, lng: app.lng }]}
                            interactive={false}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-sm text-gray-400">
                            Lokasi tidak disetel
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark text-right pt-2">
                      Mendaftar pada: {formatDate(app.created_at)}
                    </div>
                  </div>
                </div>

                {/* Actions (only for pending) */}
                {activeTab === 'pending' && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-border-light dark:border-border-dark flex justify-end gap-3">
                    <Button 
                      variant="danger" 
                      onClick={() => setRejectMitraId(app.id)}
                      disabled={isProcessing}
                      leftIcon={<X className="h-4 w-4" />}
                    >
                      Tolak
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={() => handleApprove(app.id)}
                      isLoading={isProcessing}
                      leftIcon={<Check className="h-4 w-4" />}
                    >
                      Setujui
                    </Button>
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
                Tidak Ada Data
              </h3>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                Tidak ada pendaftaran mitra dalam status ini.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Document Preview Modal */}
      <Modal open={!!previewImage} onOpenChange={() => setPreviewImage(null)} title="Pratinjau Dokumen">
        {previewImage && (
          <img
            src={previewImage}
            alt="Document preview"
            className="w-full rounded-lg object-contain max-h-[70vh]"
          />
        )}
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal 
        open={!!rejectMitraId} 
        onOpenChange={() => setRejectMitraId(null)} 
        title="Konfirmasi Penolakan"
      >
        <div className="space-y-4">
          <p className="text-text-primary-light dark:text-text-primary-dark">
            Apakah Anda yakin ingin <strong>menolak</strong> pendaftaran mitra ini?
          </p>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Setelah ditolak, calon mitra akan menerima notifikasi penolakan dan tidak akan dapat menerima pesanan.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setRejectMitraId(null)} disabled={isProcessing}>
              Batal
            </Button>
            <Button 
              variant="danger" 
              onClick={() => rejectMitraId && handleReject(rejectMitraId)}
              isLoading={isProcessing}
            >
              Ya, Tolak Pendaftaran
            </Button>
          </div>
        </div>
      </Modal>

    </PageTransition>
  );
}
