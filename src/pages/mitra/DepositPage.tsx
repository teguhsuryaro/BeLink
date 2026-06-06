import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowUpCircle, ArrowDownCircle, AlertTriangle, Wallet, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { formatIDR, formatDate, cn } from '@/lib/utils';
import { LOW_DEPOSIT_THRESHOLD, MIN_DEPOSIT_BALANCE } from '@/lib/constants';
import type { MitraProfile } from '@/types/user.types';

import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';

interface DepositTransaction {
  id: string;
  mitra_id: string;
  amount: number;
  type: 'topup' | 'top_up' | 'commission_deduction' | 'withdrawal';
  balance_after: number;
  reference_order_id: string | null;
  notes: string | null;
  created_at: string;
}

export default function DepositPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpStep, setTopUpStep] = useState<'input' | 'qr'>('input');
  const [topUpAmount, setTopUpAmount] = useState<number>(0);
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);

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

  const handleConfirmTopUp = async () => {
    if (!profile || topUpAmount < MIN_DEPOSIT_BALANCE) return;

    setIsProcessingTopUp(true);
    try {
      const newBalance = currentBalance + topUpAmount;

      const { error: updateError } = await supabase
        .from('mitra_profiles')
        .update({ deposit_balance: newBalance })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      const { error: txError } = await supabase
        .from('deposit_transactions')
        .insert({
          mitra_id: profile.id,
          type: 'topup',
          amount: topUpAmount,
          balance_after: newBalance,
          notes: `Top up saldo via QR (Demo)`,
        });

      if (txError) throw txError;

      queryClient.invalidateQueries({ queryKey: ['mitra-profile'] });
      queryClient.invalidateQueries({ queryKey: ['deposit-transactions'] });

      toast.success(`Saldo bertambah ${formatIDR(topUpAmount)}`);
      setIsTopUpModalOpen(false);
      setTopUpStep('input');
      setTopUpAmount(0);
    } catch (error) {
      console.error('Top up error:', error);
      toast.error('Gagal melakukan top up');
    } finally {
      setIsProcessingTopUp(false);
    }
  };

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
                className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow bg-white text-primary hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-700"
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
                  const isPositive = tx.type === 'topup' || tx.type === 'top_up';
                  
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
        onOpenChange={(open) => {
          setIsTopUpModalOpen(open);
          if (!open) {
            setTopUpStep('input');
            setTopUpAmount(0);
          }
        }}
        title="Top Up Saldo"
      >
        {topUpStep === 'input' && (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                Masukkan Nominal Top Up
              </h4>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Minimum top up: {formatIDR(MIN_DEPOSIT_BALANCE)}
              </p>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-muted-light dark:text-text-muted-dark">Rp</span>
              <input
                type="number"
                min={MIN_DEPOSIT_BALANCE}
                value={topUpAmount || ''}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                placeholder="10000"
                className="w-full rounded-xl border border-border-light bg-card-light py-4 pl-12 pr-4 text-2xl font-bold text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark dark:text-white"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[10000, 25000, 50000, 100000, 200000, 500000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTopUpAmount(amount)}
                  className={cn(
                    "rounded-lg border py-2 text-sm font-medium transition-colors",
                    topUpAmount === amount
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border-light hover:border-primary/50 dark:border-border-dark"
                  )}
                >
                  {formatIDR(amount)}
                </button>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={topUpAmount < MIN_DEPOSIT_BALANCE}
              onClick={() => setTopUpStep('qr')}
            >
              Lanjut
            </Button>
          </div>
        )}

        {topUpStep === 'qr' && (
          <div className="space-y-6 text-center">
            <div>
              <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                Scan QR untuk Pembayaran
              </h4>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Nominal: <span className="font-bold text-primary">{formatIDR(topUpAmount)}</span>
              </p>
            </div>

            {/* QR Code Gimmick */}
            <div className="mx-auto w-48 h-48 bg-white rounded-xl p-4 shadow-inner border flex items-center justify-center">
              <div className="w-full h-full border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-2">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`bg-gray-800 rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`} />
                  ))}
                </div>
                <div className="bg-white p-2 z-10 rounded shadow">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              (Demo mode — pembayaran disimulasikan)
            </p>

            <div className="flex gap-3">
              <Button variant="outline" className="w-1/3" onClick={() => setTopUpStep('input')}>
                Kembali
              </Button>
              <Button
                className="w-2/3"
                size="lg"
                isLoading={isProcessingTopUp}
                onClick={handleConfirmTopUp}
              >
                Konfirmasi Pembayaran
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
}
