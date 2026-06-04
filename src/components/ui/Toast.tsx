
import { toast as sonnerToast } from 'sonner';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Wrapper toast functions dengan ikon dari Lucide.
 * Menggantikan toast bawaan Sonner agar lebih konsisten.
 *
 * Penggunaan:
 * toast.success('Berhasil disimpan');
 * toast.error('Gagal menyimpan data');
 * toast.warning('Saldo deposit menipis');
 * toast.info('Pesanan baru masuk');
 */
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      icon: <CheckCircle2 className="h-5 w-5 text-success" />,
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      icon: <AlertCircle className="h-5 w-5 text-danger" />,
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      icon: <AlertTriangle className="h-5 w-5 text-warning" />,
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      icon: <Info className="h-5 w-5 text-primary" />,
    });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  promise: sonnerToast.promise,
};
