import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, Car, CircleDot, Power, Battery, Link as LinkIcon, 
  Disc, Zap, HelpCircle, Check, ArrowRight, ArrowLeft, Upload
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { orderFormSchema, type OrderFormData } from '@/lib/validators';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageTransition } from '@/components/layout/PageTransition';
import { LocationPicker } from '@/components/map/LocationPicker';
import { MIN_PRICE_PER_KM, DAMAGE_TYPES } from '@/lib/constants';
import { cn, formatIDR } from '@/lib/utils';

const DAMAGE_ICONS: Record<string, any> = {
  ban: CircleDot,
  mesin: Power,
  aki: Battery,
  rantai: LinkIcon,
  rem: Disc,
  kelistrikan: Zap,
  lainnya: HelpCircle,
};

export default function OrderPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState<string | null>(null);
  const [damagePhotoUrl, setDamagePhotoUrl] = useState<string | null>(null);
  const [vehiclePhotoFile, setVehiclePhotoFile] = useState<File | null>(null);
  const [damagePhotoFile, setDamagePhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      vehicle_type: 'motor',
      price_per_km: MIN_PRICE_PER_KM,
    },
  });

  const selectedVehicleType = watch('vehicle_type');
  const selectedDamageType = watch('damage_type');
  const pricePerKm = watch('price_per_km');

  // File Upload Handlers
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'vehicle' | 'damage') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      if (type === 'vehicle') {
        setVehiclePhotoFile(file);
        setVehiclePhotoUrl(previewUrl);
      } else {
        setDamagePhotoFile(file);
        setDamagePhotoUrl(previewUrl);
      }
    }
  };

  async function uploadFile(bucket: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile!.id}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['vehicle_type', 'vehicle_brand']);
    } else if (currentStep === 2) {
      isValid = await trigger(['damage_type', 'damage_description']);
      if (!damagePhotoFile) {
        toast.error('Silakan unggah foto kerusakan terlebih dahulu');
        isValid = false;
      }
    }
    
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: OrderFormData) => {
    if (!profile) return;
    
    if (!damagePhotoFile) {
      toast.error('Foto kerusakan wajib diunggah');
      return;
    }

    if (!data.user_lat || !data.user_lng) {
      toast.error('Lokasi belum ditentukan');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalVehicleUrl = null;
      let finalDamageUrl = null;

      if (vehiclePhotoFile) {
        finalVehicleUrl = await uploadFile('vehicles', vehiclePhotoFile);
      }
      
      if (damagePhotoFile) {
        finalDamageUrl = await uploadFile('damages', damagePhotoFile);
      }

      const totalFee = data.price_per_km * 1; // placeholder jarak
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: profile.id,
          vehicle_type: data.vehicle_type,
          vehicle_brand: data.vehicle_brand || null,
          vehicle_photo_url: finalVehicleUrl,
          damage_type: data.damage_type || null,
          damage_description: data.damage_description || null,
          damage_photo_url: finalDamageUrl,
          user_lat: data.user_lat,
          user_lng: data.user_lng,
          user_address: data.user_address || null,
          price_per_km: data.price_per_km,
          travel_fee: totalFee,
          status: 'searching',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Permintaan terkirim!', 'Mencari mekanik terdekat...');
      navigate(`/order/${order.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirim permintaan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step variants for Framer Motion
  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <PageTransition className="mx-auto max-w-2xl px-4 py-8 pb-24">
      {/* Step Indicator */}
      <div className="sticky top-16 z-20 -mx-4 mb-8 bg-surface-light/80 px-4 py-4 backdrop-blur-md dark:bg-surface-dark/80 md:top-20 md:mx-0 md:px-0">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 bg-border-light dark:bg-border-dark"></div>
          <div 
            className="absolute left-0 top-1/2 -z-10 h-1 -translate-y-1/2 bg-primary transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
          
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  currentStep > step ? "border-primary bg-primary text-white" :
                  currentStep === step ? "border-primary bg-surface-light text-primary dark:bg-surface-dark" :
                  "border-border-light bg-surface-light text-text-muted-light dark:border-border-dark dark:bg-surface-dark dark:text-text-muted-dark"
                )}
              >
                {currentStep > step ? <Check className="h-4 w-4" /> : <span className="text-sm font-semibold">{step}</span>}
              </div>
              <span className={cn(
                "mt-2 text-xs font-medium",
                currentStep >= step ? "text-primary" : "text-text-muted-light dark:text-text-muted-dark"
              )}>
                {step === 1 ? t('order.step_vehicle', 'Kendaraan') : step === 2 ? t('order.step_damage', 'Kerusakan') : t('order.step_location', 'Lokasi')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Detail Kendaraan</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-6 transition-all",
                    selectedVehicleType === 'motor' ? "border-primary bg-primary/5 text-primary" : "border-border-light hover:border-primary/50 dark:border-border-dark"
                  )}
                  onClick={() => setValue('vehicle_type', 'motor')}
                >
                  <Bike className="mb-2 h-10 w-10" />
                  <span className="font-medium">{t('order.motor', 'Motor')}</span>
                </div>
                <div 
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-6 transition-all",
                    selectedVehicleType === 'mobil' ? "border-primary bg-primary/5 text-primary" : "border-border-light hover:border-primary/50 dark:border-border-dark"
                  )}
                  onClick={() => setValue('vehicle_type', 'mobil')}
                >
                  <Car className="mb-2 h-10 w-10" />
                  <span className="font-medium">{t('order.mobil', 'Mobil')}</span>
                </div>
              </div>

              <Input 
                label="Merek / Model Kendaraan (Opsional)" 
                placeholder="Contoh: Honda Vario 150" 
                {...register('vehicle_brand')}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  Foto Kendaraan (Opsional)
                </label>
                {vehiclePhotoUrl ? (
                  <div className="relative overflow-hidden rounded-xl border border-border-light dark:border-border-dark">
                    <img src={vehiclePhotoUrl} alt="Kendaraan" className="h-48 w-full object-cover" />
                    <Button 
                      type="button" 
                      variant="danger" 
                      size="sm" 
                      className="absolute right-2 top-2"
                      onClick={() => { setVehiclePhotoUrl(null); setVehiclePhotoFile(null); }}
                    >
                      Hapus
                    </Button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-light bg-card-light py-8 hover:bg-gray-50 dark:border-border-dark dark:bg-card-dark dark:hover:bg-gray-800/50">
                    <Upload className="mb-2 h-8 w-8 text-text-muted-light dark:text-text-muted-dark" />
                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Upload foto kendaraan</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoSelect(e, 'vehicle')} />
                  </label>
                )}
              </div>

              <Button type="button" size="lg" className="w-full" onClick={handleNextStep} rightIcon={<ArrowRight className="h-5 w-5" />}>
                {t('order.next', 'Lanjut')}
              </Button>
            </motion.div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Detail Kerusakan</h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  Jenis Kerusakan
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {DAMAGE_TYPES.map((type) => {
                    const Icon = DAMAGE_ICONS[type] || HelpCircle;
                    return (
                      <div
                        key={type}
                        className={cn(
                          "flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
                          selectedDamageType === type 
                            ? "border-primary bg-primary/10 text-primary" 
                            : "border-border-light hover:border-primary/50 dark:border-border-dark text-text-muted-light dark:text-text-muted-dark"
                        )}
                        onClick={() => setValue('damage_type', type as any)}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-xs font-medium capitalize">{type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  Deskripsi Kerusakan
                </label>
                <textarea
                  className="w-full rounded-xl border border-border-light bg-card-light p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark"
                  rows={3}
                  placeholder="Jelaskan kondisi kendaraan saat ini..."
                  {...register('damage_description')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  Foto Kerusakan <span className="text-danger">*</span>
                </label>
                {damagePhotoUrl ? (
                  <div className="relative overflow-hidden rounded-xl border border-border-light dark:border-border-dark">
                    <img src={damagePhotoUrl} alt="Kerusakan" className="h-48 w-full object-cover" />
                    <Button 
                      type="button" 
                      variant="danger" 
                      size="sm" 
                      className="absolute right-2 top-2"
                      onClick={() => { setDamagePhotoUrl(null); setDamagePhotoFile(null); }}
                    >
                      Hapus
                    </Button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-danger/50 bg-danger/5 py-8 hover:bg-danger/10">
                    <Upload className="mb-2 h-8 w-8 text-danger" />
                    <span className="text-sm font-medium text-danger">Upload foto kerusakan (Wajib)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoSelect(e, 'damage')} />
                  </label>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" className="w-1/3" onClick={handlePrevStep} leftIcon={<ArrowLeft className="h-5 w-5" />}>
                  {t('order.prev', 'Kembali')}
                </Button>
                <Button type="button" size="lg" className="w-2/3" onClick={handleNextStep} rightIcon={<ArrowRight className="h-5 w-5" />}>
                  {t('order.next', 'Lanjut')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Lokasi & Penawaran</h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  Lokasi Anda <span className="text-danger">*</span>
                </label>
                <Controller
                  control={control}
                  name="user_lat"
                  render={({ field }) => (
                    <LocationPicker 
                      value={field.value && watch('user_lng') ? { lat: field.value, lng: watch('user_lng') } : null}
                      onChange={(loc) => {
                        setValue('user_lat', loc.lat);
                        setValue('user_lng', loc.lng);
                      }}
                      error={errors.user_lat?.message}
                    />
                  )}
                />
              </div>

              <Input 
                label="Detail Patokan Alamat (Opsional)" 
                placeholder="Contoh: Depan minimarket Alfamart" 
                {...register('user_address')}
              />

              <div className="space-y-2 rounded-xl border border-warning/30 bg-warning/10 p-4">
                <label className="block text-sm font-semibold text-warning-dark dark:text-warning">
                  Tawaran Ongkos Jalan per Kilometer
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-text-muted-light dark:text-text-muted-dark">Rp</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border-light bg-card-light py-3 pl-10 pr-12 font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark"
                    {...register('price_per_km', { valueAsNumber: true })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-medium text-text-muted-light dark:text-text-muted-dark">/km</span>
                </div>
                {errors.price_per_km && <p className="text-xs text-danger">{errors.price_per_km.message}</p>}
                
                <p className="mt-2 text-xs text-warning-dark dark:text-warning">
                  {t('order.min_fee_alert', 'Minimum tawaran adalah Rp5.000/km.')}
                  <br />
                  {t('order.higher_fee_alert', 'Tawaran yang lebih tinggi akan lebih cepat mendapatkan mekanik.')}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-warning/20 pt-4">
                  <span className="text-sm font-medium">Estimasi Ongkos:</span>
                  <div className="text-right">
                    <span className="font-bold">{formatIDR(pricePerKm || MIN_PRICE_PER_KM)} / km</span>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      Akan dihitung totalnya saat mekanik merespon
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" className="w-1/3" onClick={handlePrevStep} leftIcon={<ArrowLeft className="h-5 w-5" />}>
                  {t('order.prev', 'Kembali')}
                </Button>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-2/3" 
                  isLoading={isSubmitting} 
                  rightIcon={<Check className="h-5 w-5" />}
                >
                  {t('order.submit_order', 'Kirim Permintaan')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </PageTransition>
  );
}
