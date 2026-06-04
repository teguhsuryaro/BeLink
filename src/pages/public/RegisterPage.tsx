import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data);
      navigate('/home');
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat akun');
    }
  };

  return (
    <PageTransition className="flex min-h-screen items-center justify-center bg-surface-light p-4 dark:bg-surface-dark">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/5" />

      <div className="z-10 w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-soft">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Be<span className="text-primary">Link</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('auth.register_title', 'Buat Akun Baru')}
          </h1>
          <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
            {t('auth.register_subtitle', 'Mulai perjalanan Anda bersama BeLink')}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border-light bg-card-light p-6 shadow-medium dark:border-border-dark dark:bg-card-dark dark:shadow-dark-medium">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <StaggerContainer>
              <StaggerItem>
                <Input
                  label={t('auth.full_name', 'Nama Lengkap')}
                  placeholder="John Doe"
                  {...register('full_name')}
                  error={errors.full_name?.message}
                />
              </StaggerItem>

              <StaggerItem>
                <Input
                  label={t('auth.email', 'Email')}
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </StaggerItem>

              <StaggerItem>
                <Input
                  label={t('auth.password', 'Kata Sandi')}
                  type="password"
                  placeholder="Min. 6 karakter"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </StaggerItem>

              <StaggerItem>
                <Input
                  label={t('auth.confirm_password', 'Konfirmasi Kata Sandi')}
                  type="password"
                  placeholder="Ulangi kata sandi"
                  {...register('confirm_password')}
                  error={errors.confirm_password?.message}
                />
              </StaggerItem>

              <StaggerItem>
                <Input
                  label={t('auth.phone', 'Nomor Telepon (Opsional)')}
                  type="tel"
                  placeholder="0812xxxxxxxx"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
              </StaggerItem>

              <StaggerItem className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  {t('auth.register', 'Daftar Sekarang')}
                </Button>
              </StaggerItem>
            </StaggerContainer>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
            {t('auth.has_account', 'Sudah punya akun? ')}{' '}
            <Link
              to="/login"
              className="font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              {t('auth.login_here', 'Masuk di sini')}
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
