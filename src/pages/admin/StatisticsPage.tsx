import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity, DollarSign, Target, Users, TrendingUp, Trophy, Star } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { formatIDR } from '@/lib/utils';
import type { MitraProfile } from '@/types/user.types';

export default function StatisticsPage() {

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'statistics', 'full'],
    queryFn: async () => {
      // 1. Fetch orders for revenue & breakdown
      const { data: ordersData } = await supabase
        .from('orders')
        .select('status, platform_commission, completed_at, created_at');

      // 2. Fetch profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('role, created_at');

      // 3. Fetch mitra profiles
      const { data: mitraProfilesData } = await supabase
        .from('mitra_profiles')
        .select('verification_status');

      // 4. Fetch Top 5 Mitras
      const { data: topMitrasData } = await supabase
        .from('mitra_profiles')
        .select(`
          *,
          profiles!inner (full_name, avatar_url)
        `)
        .eq('verification_status', 'verified')
        .order('total_orders_completed', { ascending: false })
        .limit(5);

      const orders = ordersData || [];
      const profiles = profilesData || [];
      const mitraProfiles = mitraProfilesData || [];

      // Calculate Revenue
      let totalRevenue = 0;
      let thisMonthRevenue = 0;
      let lastMonthRevenue = 0;
      const monthlyRevenue: Record<string, number> = {};

      const now = new Date();
      const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const lastMonthDate = new Date(now);
      lastMonthDate.setMonth(now.getMonth() - 1);
      const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

      orders.forEach((o) => {
        if (o.status === 'completed' && o.platform_commission && o.completed_at) {
          const amount = Number(o.platform_commission);
          totalRevenue += amount;
          
          const month = o.completed_at.substring(0, 7);
          monthlyRevenue[month] = (monthlyRevenue[month] || 0) + amount;

          if (month === currentMonthStr) thisMonthRevenue += amount;
          if (month === lastMonthStr) lastMonthRevenue += amount;
        }
      });

      // Prepare data for bar chart (last 6 months to keep it simple)
      const chartData = [];
      let maxMonthly = 1; // prevent div by zero
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(now.getMonth() - i);
        const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        const val = monthlyRevenue[mStr] || 0;
        if (val > maxMonthly) maxMonthly = val;
        chartData.push({ label, value: val, max: 0 }); // max will be updated later
      }
      chartData.forEach(c => c.max = maxMonthly);

      // Revenue growth
      let revenueGrowth = 0;
      if (lastMonthRevenue > 0) {
        revenueGrowth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
      } else if (thisMonthRevenue > 0) {
        revenueGrowth = 100;
      }

      // Orders Breakdown
      const totalOrders = orders.length;
      let completedOrders = 0;
      let cancelledOrders = 0;
      let activeOrders = 0;

      orders.forEach(o => {
        if (o.status === 'completed') completedOrders++;
        else if (['cancelled_user', 'cancelled_mitra', 'expired'].includes(o.status)) cancelledOrders++;
        else activeOrders++;
      });

      // Users Breakdown
      const totalUsers = profiles.length;
      let newUsersThisMonth = 0;
      profiles.forEach(p => {
        if (p.created_at && p.created_at.substring(0, 7) === currentMonthStr) {
          newUsersThisMonth++;
        }
      });

      let verifiedMitra = 0;
      let pendingMitra = 0;
      let rejectedMitra = 0;
      mitraProfiles.forEach(m => {
        if (m.verification_status === 'verified') verifiedMitra++;
        else if (m.verification_status === 'pending') pendingMitra++;
        else if (m.verification_status === 'rejected') rejectedMitra++;
      });

      return {
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growth: revenueGrowth,
          chartData
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          active: activeOrders,
          avgPerDay: thisMonthRevenue > 0 ? (totalOrders / now.getDate()).toFixed(1) : '0' // rough estimate
        },
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          mitra: {
            verified: verifiedMitra,
            pending: pendingMitra,
            rejected: rejectedMitra,
            total: mitraProfiles.length
          }
        },
        topMitras: (topMitrasData || []) as (MitraProfile & { profiles: { full_name: string; avatar_url: string } })[]
      };
    },
    refetchInterval: 60000 * 5, // 5 minutes
  });

  if (isLoading || !stats) {
    return (
      <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </PageTransition>
    );
  }

  // --- Helpers for simple progress bars ---
  const orderPct = (val: number) => stats.orders.total > 0 ? (val / stats.orders.total) * 100 : 0;
  const mitraPct = (val: number) => stats.users.mitra.total > 0 ? (val / stats.users.mitra.total) * 100 : 0;

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
              <Activity className="h-6 w-6 text-info" />
              Statistik Platform
            </h1>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
              Analisa finansial dan pertumbuhan ekosistem BeLink.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live Data
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Revenue Overview */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-success/10 text-success rounded-full">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">Pendapatan Komisi</h3>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Dari potongan 10% setiap order selesai</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">Total Sepanjang Waktu</div>
              <div className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                {formatIDR(stats.revenue.total)}
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg flex-1">
                  <div className="text-text-muted-light dark:text-text-muted-dark text-xs mb-1">Bulan Ini</div>
                  <div className="font-bold">{formatIDR(stats.revenue.thisMonth)}</div>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <TrendingUp className={`h-8 w-8 ${stats.revenue.growth >= 0 ? 'text-success' : 'text-danger'}`} />
                  <div>
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Pertumbuhan</div>
                    <div className={`font-bold ${stats.revenue.growth >= 0 ? 'text-success' : 'text-danger'}`}>
                      {stats.revenue.growth > 0 ? '+' : ''}{stats.revenue.growth.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-semibold mb-3">Grafik 6 Bulan Terakhir</h4>
            <div className="space-y-3">
              {stats.revenue.chartData.map((item, i) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-12 text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                    {item.label}
                  </span>
                  <div className="flex-1 h-5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                    <motion.div
                      className="absolute top-0 bottom-0 left-0 rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.max > 0 ? (item.value / item.max) * 100 : 0}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="w-20 text-right text-xs font-medium text-text-primary-light dark:text-text-primary-dark">
                    {formatIDR(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Statistics */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-info/10 text-info rounded-full">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">Statistik Pesanan</h3>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Distribusi status dari total pesanan</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <div className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {stats.orders.total}
              </div>
              <div className="text-sm text-text-muted-light dark:text-text-muted-dark">total pesanan tercatat</div>
            </div>

            <div className="space-y-6">
              {/* Progress Bar Group */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-success"></span> Selesai ({stats.orders.completed})
                  </span>
                  <span className="text-success font-bold">{orderPct(stats.orders.completed).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div 
                    className="h-full bg-success" 
                    initial={{ width: 0 }} animate={{ width: `${orderPct(stats.orders.completed)}%` }} transition={{ duration: 0.8 }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-info"></span> Berjalan/Aktif ({stats.orders.active})
                  </span>
                  <span className="text-info font-bold">{orderPct(stats.orders.active).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div 
                    className="h-full bg-info" 
                    initial={{ width: 0 }} animate={{ width: `${orderPct(stats.orders.active)}%` }} transition={{ duration: 0.8, delay: 0.1 }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-danger"></span> Dibatalkan ({stats.orders.cancelled})
                  </span>
                  <span className="text-danger font-bold">{orderPct(stats.orders.cancelled).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div 
                    className="h-full bg-danger" 
                    initial={{ width: 0 }} animate={{ width: `${orderPct(stats.orders.cancelled)}%` }} transition={{ duration: 0.8, delay: 0.2 }} 
                  />
                </div>
              </div>
              
              <div className="mt-8 bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1 uppercase tracking-wider">Performa Rata-rata</div>
                  <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">Rata-rata Order / Hari</div>
                </div>
                <div className="text-xl font-bold text-primary">~{stats.orders.avgPerDay}</div>
              </div>
            </div>
          </Card>

          {/* User Growth */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">Pertumbuhan Pengguna</h3>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Akun terdaftar dan mitra mekanik</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-border-light dark:border-border-dark">
                <div className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Total Akun</div>
                <div className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{stats.users.total}</div>
              </div>
              <div className="bg-purple-500/5 dark:bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">User Baru (Bulan ini)</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">+{stats.users.newThisMonth}</div>
              </div>
            </div>

            <h4 className="text-sm font-semibold mb-4">Distribusi Status Mitra ({stats.users.mitra.total})</h4>
            <div className="flex h-3 w-full rounded-full overflow-hidden mb-3">
              <motion.div className="bg-success" initial={{ width: 0 }} animate={{ width: `${mitraPct(stats.users.mitra.verified)}%` }} transition={{ duration: 1 }} />
              <motion.div className="bg-warning" initial={{ width: 0 }} animate={{ width: `${mitraPct(stats.users.mitra.pending)}%` }} transition={{ duration: 1 }} />
              <motion.div className="bg-danger" initial={{ width: 0 }} animate={{ width: `${mitraPct(stats.users.mitra.rejected)}%` }} transition={{ duration: 1 }} />
            </div>
            
            <div className="flex justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-success rounded-full" /> Verified ({stats.users.mitra.verified})</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-warning rounded-full" /> Pending ({stats.users.mitra.pending})</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-danger rounded-full" /> Rejected ({stats.users.mitra.rejected})</div>
            </div>
          </Card>

          {/* Top Mitra */}
          <Card className="p-0 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">Top 5 Mitra</h3>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Berdasarkan order diselesaikan</p>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-text-muted-light dark:text-text-muted-dark">
                  <tr>
                    <th className="px-6 py-3 font-medium">Mitra</th>
                    <th className="px-6 py-3 font-medium text-center">Rating</th>
                    <th className="px-6 py-3 font-medium text-center">Order Selesai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {stats.topMitras.length > 0 ? (
                    stats.topMitras.map((mitra, idx) => (
                      <tr key={mitra.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-400 w-4">{idx + 1}.</span>
                            <img 
                              src={mitra.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(mitra.profiles.full_name)}&background=random`} 
                              alt="" 
                              className="w-8 h-8 rounded-full object-cover" 
                            />
                            <div>
                              <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">{mitra.profiles.full_name}</div>
                              <div className="text-[10px] text-text-muted-light dark:text-text-muted-dark truncate max-w-[120px]">
                                {mitra.business_name || 'Independen'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex items-center justify-center gap-1 font-medium text-orange-500">
                            <Star className="h-4 w-4 fill-current" />
                            {mitra.average_rating.toFixed(1)}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center font-bold text-text-primary-light dark:text-text-primary-dark">
                          {mitra.total_orders_completed}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">Belum ada mitra yang menyelesaikan pesanan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>
    </PageTransition>
  );
}
