import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Wrench, FileText, DollarSign, ShieldAlert, AlertCircle, ChevronRight, Activity } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { formatIDR } from '@/lib/utils';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Total mitra
      const { count: totalMitra } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['mitra_independen', 'mitra_bengkel']);

      // Total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Total revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('platform_commission')
        .eq('status', 'completed')
        .not('platform_commission', 'is', null);
      const totalRevenue = (revenueData || []).reduce(
        (sum, o) => sum + Number(o.platform_commission), 0
      );

      // Pending verifications
      const { count: pendingVerification } = await supabase
        .from('mitra_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      // Open reports
      const { count: openReports } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      return {
        totalUsers: totalUsers || 0,
        totalMitra: totalMitra || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        pendingVerification: pendingVerification || 0,
        openReports: openReports || 0,
      };
    },
    refetchInterval: 60000, // refresh every minute
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const statCards = [
    {
      title: 'Total Pengguna',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Mitra',
      value: stats?.totalMitra || 0,
      icon: Wrench,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Pesanan',
      value: stats?.totalOrders || 0,
      icon: FileText,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Revenue Komisi',
      value: formatIDR(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Menunggu Verifikasi',
      value: stats?.pendingVerification || 0,
      icon: ShieldAlert,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Laporan Terbuka',
      value: stats?.openReports || 0,
      icon: AlertCircle,
      color: 'text-danger',
      bgColor: 'bg-danger/10',
    },
  ];

  const quickLinks = [
    {
      title: 'Verifikasi Mitra',
      description: 'Review dan setujui pendaftaran mitra baru',
      path: '/admin/verification',
      icon: ShieldAlert,
      badge: stats?.pendingVerification || 0,
      badgeColor: 'warning' as const,
    },
    {
      title: 'Kelola Pengguna',
      description: 'Manajemen akun user dan mitra aktif',
      path: '/admin/users',
      icon: Users,
      badge: 0,
      badgeColor: 'default' as const,
    },
    {
      title: 'Laporan Masalah',
      description: 'Tangani keluhan dan laporan dari pengguna',
      path: '/admin/reports',
      icon: AlertCircle,
      badge: stats?.openReports || 0,
      badgeColor: 'danger' as const,
    },
    {
      title: 'Statistik Platform',
      description: 'Lihat metrik dan performa keseluruhan aplikasi',
      path: '/admin/statistics',
      icon: Activity,
      badge: 0,
      badgeColor: 'default' as const,
    },
  ];

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('admin.dashboard_title', 'Dashboard Admin')}
          </h1>
          <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
            Ringkasan performa platform BeLink hari ini.
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 md:grid-cols-3"
          >
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <Card className="flex h-full flex-col p-5 border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                        {stat.title}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Akses Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Card 
                  key={idx}
                  className="group cursor-pointer p-0 overflow-hidden border border-border-light dark:border-border-dark transition-all hover:border-primary/50 hover:shadow-md"
                  onClick={() => navigate(link.path)}
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors text-gray-500 dark:text-gray-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">
                          {link.title}
                        </h3>
                        {link.badge > 0 && (
                          <Badge variant={link.badgeColor}>{link.badge} baru</Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                        {link.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
