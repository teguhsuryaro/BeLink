import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wrench, Upload, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { mitraRegistrationSchema, type MitraRegistrationFormData, validateFile } from '@/lib/validators';
import { MAX_FILE_SIZE } from '@/lib/constants';

import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { LocationPicker } from '@/components/map/LocationPicker';
import { toast } from '@/components/ui/Toast';

export default function RegisterMitraPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, fetchProfile } = useAuthStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [workshopFile, setWorkshopFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [workshopPreview, setWorkshopPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MitraRegistrationFormData>({
    resolver: zodResolver(mitraRegistrationSchema),
    defaultValues: {
      lat: -6.200000,
      lng: 106.816666,
    }
  });

  const watchLat = watch('lat');
  const watchLng = watch('lng');

  const handleLocationChange = (location: { lat: number; lng: number }) => {
    setValue('lat', location.lat, { shouldValidate: true });
    setValue('lng', location.lng, { shouldValidate: true });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, MAX_FILE_SIZE.DOCUMENT);
    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }

    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  async function uploadFile(bucket: string, file: File): Promise<string> {
    if (!profile) throw new Error('User not found');
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  const onSubmit = async (data: MitraRegistrationFormData) => {
    if (!profile) {
      toast.error('Kamu harus login terlebih dahulu');
      return;
    }
    
    if (!ktpFile || !selfieFile) {
      toast.error('KTP dan Foto Diri wajib diunggah');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Memproses pendaftaran...');
    
    try {
      // 1. Upload KTP
      const ktpUrl = await uploadFile('documents', ktpFile);
      
      // 2. Upload Selfie
      const selfieUrl = await uploadFile('documents', selfieFile);
      
      // 3. Upload Foto Bengkel (opsional)
      let workshopUrl = null;
      if (workshopFile) {
        workshopUrl = await uploadFile('documents', workshopFile);
      }

      // 4. Insert ke mitra_profiles
      const { error: mitraError } = await supabase.from('mitra_profiles').insert({
        id: profile.id,
        business_name: data.business_name,
        bio: data.bio || null,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        ktp_url: ktpUrl,
        selfie_url: selfieUrl,
        workshop_photo_url: workshopUrl,
        verification_status: 'pending',
      });

      if (mitraError) throw mitraError;

      // 5. Update role user menjadi mitra_independen
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'mitra_independen' })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // 6. Refresh profil
      await fetchProfile(profile.id);

      toast.dismiss(toastId);
      toast.success('Pendaftaran berhasil!', 'Menunggu verifikasi dari admin.');
      navigate('/mitra/dashboard');
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error('Gagal mendaftar mitra', err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadField = ({ 
    label, 
    id, 
    preview, 
    onChange, 
    required 
  }: { 
    label: string, 
    id: string, 
    preview: string | null, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      {!preview ? (
        <label
          htmlFor={id}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800"
        >
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Klik untuk mengunggah file
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            JPG, PNG, WebP (Max. 5MB)
          </p>
          <input
            id={id}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
            onChange={onChange}
          />
        </label>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <img src={preview} alt="Preview" className="h-48 w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <CheckCircle2 className="h-10 w-10 text-white mb-2" />
            <label htmlFor={id} className="cursor-pointer text-white text-sm bg-black/50 px-3 py-1 rounded-full hover:bg-black/70 transition-colors">
              Ganti Foto
            </label>
            <input
              id={id}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              className="hidden"
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-lg">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wrench className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('mitra.register_title', 'Daftar Menjadi Mitra')}
          </h1>
          <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
            {t('mitra.register_subtitle', 'Bergabunglah menjadi mitra mekanik BeLink dan dapatkan penghasilan tambahan.')}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Informasi Dasar */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-border-light pb-2 dark:border-border-dark">
                Informasi Usaha / Bengkel
              </h3>
              
              <Input
                label="Nama Bengkel / Usaha"
                placeholder="Misal: Bengkel Jaya Motor"
                {...register('business_name')}
                error={errors.business_name?.message}
                required
              />
              
              <Textarea
                label="Bio Singkat (Opsional)"
                placeholder="Ceritakan sedikit tentang keahlian atau bengkel Anda..."
                {...register('bio')}
                error={errors.bio?.message}
                rows={3}
              />
            </div>

            {/* Lokasi */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-border-light pb-2 dark:border-border-dark">
                Lokasi Bengkel / Base
              </h3>
              
              <LocationPicker 
                value={{ lat: watchLat, lng: watchLng }}
                onChange={handleLocationChange}
                error={errors.lat?.message || errors.lng?.message}
              />
              
              <Input
                label="Detail Alamat"
                placeholder="Masukkan alamat lengkap..."
                {...register('address')}
                error={errors.address?.message}
                required
              />
            </div>

            {/* Dokumen */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark border-b border-border-light pb-2 dark:border-border-dark">
                Dokumen Verifikasi
              </h3>
              
              <FileUploadField 
                id="ktp-upload"
                label="Foto KTP"
                preview={ktpPreview}
                onChange={(e) => handleFileChange(e, setKtpFile, setKtpPreview)}
                required
              />
              
              <FileUploadField 
                id="selfie-upload"
                label="Foto Diri (Selfie)"
                preview={selfiePreview}
                onChange={(e) => handleFileChange(e, setSelfieFile, setSelfiePreview)}
                required
              />
              
              <FileUploadField 
                id="workshop-upload"
                label="Foto Bengkel (Opsional)"
                preview={workshopPreview}
                onChange={(e) => handleFileChange(e, setWorkshopFile, setWorkshopPreview)}
              />
            </div>

            {/* Submit & Disclaimer */}
            <div className="pt-4 space-y-4">
              <div className="rounded-lg bg-warning/10 p-4 text-sm text-warning-dark dark:bg-warning/20 dark:text-warning">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Dengan mendaftar, Anda menyetujui bahwa data yang diberikan valid.</li>
                  <li>Proses verifikasi memakan waktu 1-3 hari kerja.</li>
                  <li>Deposit minimum Rp10.000 diperlukan untuk mulai menerima pesanan.</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                fullWidth 
                isLoading={isSubmitting}
              >
                {t('mitra.submit_registration', 'Kirim Pendaftaran')}
              </Button>
            </div>
            
          </form>
        </Card>

      </div>
    </PageTransition>
  );
}
