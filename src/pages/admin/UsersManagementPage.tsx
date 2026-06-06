import { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Search, Shield, Ban, CheckCircle, UserX, UserCheck, AlertCircle } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { cn, formatDate } from '@/lib/utils';
import type { Profile } from '@/types/user.types';

type TabType = 'all' | 'user' | 'mitra' | 'banned';

export default function UsersManagementPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Profile[];
    },
  });

  const filteredUsers = useMemo(() => {
    let result = users;

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(u =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }

    // Tab filter
    switch (activeTab) {
      case 'user': 
        result = result.filter(u => u.role === 'user');
        break;
      case 'mitra': 
        result = result.filter(u => ['mitra_independen', 'mitra_bengkel'].includes(u.role));
        break;
      case 'banned': 
        result = result.filter(u => u.is_banned);
        break;
    }

    return result;
  }, [users, debouncedSearch, activeTab]);

  const handleBanToggle = async () => {
    if (!selectedUser) return;
    
    setIsProcessing(true);
    const willBan = !selectedUser.is_banned;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_banned: willBan, is_online: false })
        .eq('id', selectedUser.id);

      if (profileError) throw profileError;

      // If banning a mitra, set offline
      if (willBan && ['mitra_independen', 'mitra_bengkel'].includes(selectedUser.role)) {
        await supabase
          .from('mitra_profiles')
          .update({ is_accepting_orders: false })
          .eq('id', selectedUser.id);
      }

      await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success(willBan ? 'User berhasil di-ban' : 'User berhasil dipulihkan (unban)');
      setIsBanModalOpen(false);
    } catch (error) {
      console.error('Ban error:', error);
      toast.error('Gagal memperbarui status user');
    } finally {
      setIsProcessing(false);
      setSelectedUser(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Badge variant="warning">Superadmin</Badge>;
      case 'mitra_independen':
      case 'mitra_bengkel':
        return <Badge variant="default">Mitra</Badge>;
      default:
        return <Badge variant="neutral">User</Badge>;
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'Semua User' },
    { id: 'user', label: 'Pengguna Biasa' },
    { id: 'mitra', label: 'Mitra Mekanik' },
    { id: 'banned', label: 'Banned' },
  ];

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Header & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              {t('admin.user_management', 'Manajemen Pengguna')}
            </h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
              Kelola akun pengguna, mitra, dan status suspensi.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama atau email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
            </button>
          ))}
        </div>

        {/* User List */}
        <Card className="overflow-hidden border-border-light dark:border-border-dark p-0">
          {isLoading ? (
            <div className="divide-y divide-border-light dark:divide-border-dark">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <>
              {/* Mobile View: Cards */}
              <div className="divide-y divide-border-light dark:divide-border-dark md:hidden">
                {filteredUsers.map((user) => (
                  <div key={user.id} className={cn("p-4 space-y-3", user.is_banned && "opacity-60 bg-danger/5 dark:bg-danger/10")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img 
                            src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} 
                            alt={user.full_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900", user.is_online ? "bg-success" : "bg-gray-400")} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                            {user.full_name}
                          </div>
                          <div className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {user.role !== 'superadmin' && (
                          <Button
                            variant={user.is_banned ? "success" : "danger"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsBanModalOpen(true);
                            }}
                          >
                            {user.is_banned ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        {user.is_banned ? (
                          <span className="flex items-center gap-1 font-medium text-danger"><Ban className="h-3 w-3"/> Banned</span>
                        ) : (
                          <span className="flex items-center gap-1 font-medium text-success"><CheckCircle className="h-3 w-3"/> Aktif</span>
                        )}
                      </div>
                      <div className="text-text-muted-light dark:text-text-muted-dark">
                        {formatDate(user.created_at).split(',')[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left text-sm table-auto md:table-fixed">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-text-muted-light dark:text-text-muted-dark border-b border-border-light dark:border-border-dark">
                    <tr>
                      <th className="w-2/5 px-4 py-4 font-medium">Pengguna</th>
                      <th className="w-1/5 px-4 py-4 font-medium whitespace-nowrap">Role</th>
                      <th className="w-1/5 px-4 py-4 font-medium whitespace-nowrap">Status</th>
                      <th className="w-1/5 px-4 py-4 font-medium whitespace-nowrap">Terdaftar</th>
                      <th className="w-auto px-4 py-4 font-medium text-right whitespace-nowrap">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className={cn("transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50", user.is_banned && "opacity-60 bg-danger/5 dark:bg-danger/10")}>
                        <td className="px-4 py-4 truncate">
                          <div className="flex items-center gap-3 w-full">
                            <div className="relative shrink-0">
                              <img 
                                src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} 
                                alt={user.full_name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900", user.is_online ? "bg-success" : "bg-gray-400")} />
                            </div>
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <div className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate w-full" title={user.full_name}>
                                {user.full_name}
                              </div>
                              <div className="text-xs text-text-muted-light dark:text-text-muted-dark truncate w-full" title={user.email}>
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {user.is_banned ? (
                            <Badge variant="danger" className="gap-1"><Ban className="h-3 w-3"/> Banned</Badge>
                          ) : (
                            <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3"/> Aktif</Badge>
                          )}
                        </td>
                        <td className="px-4 py-4 text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          {user.role !== 'superadmin' && (
                            <Button
                              variant={user.is_banned ? "success" : "danger"}
                              size="sm"
                              className="h-8 px-3"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsBanModalOpen(true);
                              }}
                            >
                              {user.is_banned ? (
                                <><UserCheck className="h-4 w-4 mr-2" /> <span>Unban</span></>
                              ) : (
                                <><UserX className="h-4 w-4 mr-2" /> <span>Ban</span></>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Tidak ada pengguna ditemukan
              </h3>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                Coba ubah kata kunci pencarian atau tab filter.
              </p>
            </div>
          )}
        </Card>

      </div>

      {/* Ban Confirmation Modal */}
      <Modal
        open={isBanModalOpen}
        onOpenChange={setIsBanModalOpen}
        title={selectedUser?.is_banned ? "Konfirmasi Pulihkan Pengguna" : "Konfirmasi Suspend Pengguna"}
      >
        <div className="space-y-4">
          <p className="text-text-primary-light dark:text-text-primary-dark">
            Apakah Anda yakin ingin <strong>{selectedUser?.is_banned ? 'memulihkan' : 'melakukan BAN pada'}</strong> akun berikut?
          </p>
          
          {selectedUser && (
            <div className="rounded-xl border border-border-light dark:border-border-dark p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
               <img 
                  src={selectedUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.full_name)}&background=random`} 
                  alt={selectedUser.full_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold">{selectedUser.full_name}</div>
                  <div className="text-sm text-gray-500">{selectedUser.email}</div>
                </div>
            </div>
          )}

          {!selectedUser?.is_banned && (
            <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger flex gap-2 items-start">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p>Pengguna yang di-ban tidak akan bisa login ke dalam aplikasi dan jika mereka adalah mitra, statusnya akan otomatis diubah menjadi Offline.</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsBanModalOpen(false)} disabled={isProcessing}>
              Batal
            </Button>
            <Button 
              variant={selectedUser?.is_banned ? "success" : "danger"} 
              onClick={handleBanToggle}
              isLoading={isProcessing}
            >
              {selectedUser?.is_banned ? 'Ya, Pulihkan Akun' : 'Ya, Ban Akun'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
