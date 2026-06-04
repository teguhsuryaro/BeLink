import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpCircle, ArrowDownCircle, AlertTriangle, Wallet, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { formatIDR, formatDate } from '@/lib/utils';
import { LOW_DEPOSIT_THRESHOLD, MIN_DEPOSIT_BALANCE } from '@/lib/constants';
import type { MitraProfile } from '@/types/user.types';

import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface DepositTransaction {
  id: string;
  mitra_id: string;
  amount: number;
  type: 'top_up' | 'commission_deduction' | 'withdrawal';
  balance_after: number;
  reference_order_id: string | null;
  notes: string | null;
  created_at: string;
}

export default function DepositPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  const { data: mitraProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['mitra-profile', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mitra_profiles')
        .select('*')
        .eq('id', profile!.id)
        .single();
      if (error) throw error;
      return data as MitraProfile;
    },
    enabled: !!profile,
  });

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['deposit-transactions', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deposit_transactions')
        .select('*')
        .eq('mitra_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data || []) as DepositTransaction[];
    },
    enabled: !!profile,
  });

  const isLoading = isProfileLoading || isTransactionsLoading;
  const currentBalance = mitraProfile?.deposit_balance || 0;
  const isLowBalance = currentBalance < LOW_DEPOSIT_THRESHOLD;
  const isInsufficientBalance = currentBalance < MIN_DEPOSIT_BALANCE;

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/mitra/dashboard')} className="h-10 w-10 rounded-full p-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Saldo & Deposit
            </h1>
          </div>
        </div>

        {/* Saldo Card */}
        {isLoading ? (
          <div className="h-48 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        ) : (
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-xl">
            {/* Decorative background elements */}
            <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-24 w-24 rounded-full bg-black/10 blur-xl" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary-light">
                  <Wallet className="h-5 w-5" />
                  <span className="font-medium">Saldo Deposit Anda</span>
                </div>
                <div className="text-4xl font-bold tracking-tight">
                  {formatIDR(currentBalance)}
                </div>
                
                {isLowBalance && (
                  <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isInsufficientBalance ? 'bg-danger/20 text-red-100' : 'bg-warning/20 text-orange-100'}`}>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {isInsufficientBalance 
                      ? `Saldo di bawah minimum (Rp${MIN_DEPOSIT_BALANCE.toLocaleString('id-ID')}). Harap isi ulang.` 
                      : 'Saldo hampir habis. Bersiap isi ulang.'}
                  </div>
                )}
              </div>

              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow bg-white text-primary hover:bg-gray-50"
                onClick={() => setIsTopUpModalOpen(true)}
              >
                Top Up Saldo
              </Button>
            </div>
          </Card>
        )}

        {/* Transaction History */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
            Riwayat Transaksi
          </h2>
          
          <Card className="overflow-hidden border border-border-light dark:border-border-dark p-0">
            {isLoading ? (
              <div className="space-y-4 p-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="divide-y divide-border-light dark:divide-border-dark">
                {transactions.map((tx) => {
                  const isPositive = tx.type === 'top_up';
                  
                  return (
                    <div key={tx.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {isPositive ? <ArrowUpCircle className="h-6 w-6" /> : <ArrowDownCircle className="h-6 w-6" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                            {isPositive ? 'Top Up Saldo' : 'Potongan Komisi'}
                          </h4>
                          <span className={`font-bold whitespace-nowrap ml-2 ${isPositive ? 'text-success' : 'text-danger'}`}>
                            {isPositive ? '+' : '-'}{formatIDR(tx.amount)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-text-muted-light dark:text-text-muted-dark truncate max-w-[60%]">
                            {tx.notes || (isPositive ? 'Pengisian deposit' : 'Potongan komisi platform (10%)')}
                          </p>
                          <span className="text-xs text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                            {formatDate(tx.created_at)}
                          </span>
                        </div>
                        <div className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                          Saldo Akhir: {formatIDR(tx.balance_after)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Wallet className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                  Belum Ada Transaksi
                </h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark max-w-[250px]">
                  Riwayat pengisian saldo dan pemotongan komisi akan muncul di sini.
                </p>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Top Up Modal */}
      <Modal
        open={isTopUpModalOpen}
        onOpenChange={setIsTopUpModalOpen}
        title="Instruksi Top Up Saldo"
      >
        <div className="space-y-6">
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <h4 className="font-bold text-primary mb-2">Transfer Manual ke Admin BeLink</h4>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Saat ini sistem Top Up dilakukan secara manual. Silakan transfer sejumlah saldo yang ingin Anda isi ke rekening di bawah ini:
            </p>
          </div>
          
          <div className="space-y-4">
            <Card className="p-4 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Bank BCA</span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png" alt="BCA" className="h-4 object-contain" />
              </div>
              <div className="font-bold text-xl tracking-wider text-text-primary-light dark:text-text-primary-dark">
                123 456 7890
              </div>
              <div className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                a.n. PT BeLink Digital Nusantara
              </div>
            </Card>
            
            <div className="space-y-3">
              <h5 className="font-bold text-text-primary-light dark:text-text-primary-dark text-sm">Langkah selanjutnya:</h5>
              <ol className="list-decimal list-inside space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                <li>Lakukan transfer sesuai nominal yang diinginkan.</li>
                <li>Simpan bukti transfer (struk/screenshot).</li>
                <li>Kirim bukti transfer ke WhatsApp Admin BeLink.</li>
                <li>Admin akan memverifikasi dan menambahkan saldo ke akun Anda dalam waktu maks. 15 menit.</li>
              </ol>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={() => {
              window.open('https://wa.me/6281234567890?text=Halo%20Admin%20BeLink,%20saya%20ingin%20konfirmasi%20top%20up%20deposit', '_blank');
              setIsTopUpModalOpen(false);
            }}
          >
            Konfirmasi via WhatsApp
          </Button>
        </div>
      </Modal>
    </PageTransition>
  );
}
