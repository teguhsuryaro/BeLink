import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Wrench, Settings, Sun, Moon, Globe, LogOut, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { validateFile, editProfileSchema, type EditProfileFormData } from '@/lib/validators';
import { MAX_FILE_SIZE } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { toast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

export default function ProfilePage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile, updateProfile, signOut, isUser, isMitra, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    },
  });

  // Reset form when profile data changes
  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name,
        phone: profile.phone || '',
      });
    }
  }, [profile, reset]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const validation = validateFile(file, MAX_FILE_SIZE.AVATAR);
    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }

    const toastId = toast.loading('Mengupload foto...');
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar-${Date.now()}.${fileExt}`;

      // Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Dapatkan public URL
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Update profile
      await updateProfile({ avatar_url: urlData.publicUrl });
      toast.dismiss(toastId);
      toast.success('Foto profil berhasil diperbarui');
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error('Gagal mengupload foto');
      console.error(err);
    }
  };

  const onSubmit = async (data: EditProfileFormData) => {
    setIsUpdating(true);
    try {
      await updateProfile({
        full_name: data.full_name,
        phone: data.phone || null,
      });
      setIsEditing(false);
    } catch (error: any) {
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await signOut();
    navigate('/');
  };

  if (!profile) return null;

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-lg space-y-4">
        
        {/* Profile Header Card */}
        <Card className="flex flex-col items-center justify-center p-6 text-center border border-border-light dark:border-border-dark">
          <div className="relative mb-4">
            <Avatar 
              src={profile.avatar_url || undefined} 
              name={profile.full_name} 
              size="xl" 
            />
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110"
            >
              <Camera className="h-4 w-4" />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {profile.full_name}
          </h2>
          {profile.email && (
            <p className="text-text-muted-light dark:text-text-muted-dark">
              {profile.email}
            </p>
          )}
          
          <div className="mt-3 flex flex-col items-center gap-2">
            <Badge variant="default" className="capitalize">
              {profile.role.replace('_', ' ')}
            </Badge>
            {profile.created_at && (
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                Member since {formatRelativeTime(profile.created_at, i18n.language)}
              </p>
            )}
          </div>
        </Card>

        {/* Edit Profile Section */}
        <Card className="p-6 border border-border-light dark:border-border-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Informasi Pribadi
            </h3>
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nama Lengkap"
                {...register('full_name')}
                error={errors.full_name?.message}
              />
              <Input
                label="Nomor Telepon (Opsional)"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <div className="flex gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  isLoading={isUpdating}
                >
                  Simpan
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                  Nama Lengkap
                </p>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {profile.full_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                  Nomor Telepon
                </p>
                <p className="text-text-primary-light dark:text-text-primary-dark">
                  {profile.phone || '-'}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Settings Section */}
        <Card className="p-6 border border-border-light dark:border-border-dark">
          <h3 className="mb-4 text-lg font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pengaturan
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-text-primary-light dark:text-text-primary-dark">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="font-medium">Tema Gelap</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={theme === 'dark'}
                  onChange={() => {
                    toggleTheme();
                    updateProfile({ theme_preference: theme === 'light' ? 'dark' : 'light' }).catch(console.error);
                  }}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-text-primary-light dark:text-text-primary-dark">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Bahasa</span>
              </div>
              <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                <button
                  onClick={() => {
                    setLanguage('id');
                    updateProfile({ language_preference: 'id' }).catch(console.error);
                  }}
                  className={cn(
                    'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                    language === 'id' ? 'bg-white text-text-primary-light shadow dark:bg-gray-700 dark:text-text-primary-dark' : 'text-text-muted-light dark:text-text-muted-dark'
                  )}
                >
                  🇮🇩 ID
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    updateProfile({ language_preference: 'en' }).catch(console.error);
                  }}
                  className={cn(
                    'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                    language === 'en' ? 'bg-white text-text-primary-light shadow dark:bg-gray-700 dark:text-text-primary-dark' : 'text-text-muted-light dark:text-text-muted-dark'
                  )}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Actions */}
        <div className="space-y-4">
          {isUser && (
            <Card 
              className="cursor-pointer border-2 border-dashed border-primary/30 p-4 transition-colors hover:border-primary hover:bg-primary/5"
              onClick={() => navigate('/register-mitra')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-primary">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <span className="font-bold">Daftar Menjadi Mitra</span>
                </div>
                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </Card>
          )}

          {isMitra && (
            <Button 
              className="w-full justify-between border border-border-light dark:border-border-dark" 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/mitra/dashboard')}
            >
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                <span className="text-text-primary-light dark:text-text-primary-dark">Dashboard Mitra</span>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
            </Button>
          )}

          {isAdmin && (
            <Button 
              className="w-full justify-between border border-border-light dark:border-border-dark" 
              size="lg"
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <span className="text-text-primary-light dark:text-text-primary-dark">Admin Panel</span>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
            </Button>
          )}
        </div>

        {/* Logout Button */}
        <div className="pt-6">
          <Button 
            variant="danger" 
            className="w-full bg-transparent border-danger text-danger hover:bg-danger hover:text-white border"
            onClick={() => setShowLogoutModal(true)}
            leftIcon={<LogOut className="h-5 w-5" />}
          >
            Keluar
          </Button>
        </div>
      </div>

      {/* Logout Modal */}
      <Modal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari akun ini?"
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Ya, Keluar
          </Button>
        </div>
      </Modal>
    </PageTransition>
  );
}
