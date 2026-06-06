import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Wrench, Save, Star, Package, Shield, Bike, Car } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { LocationPicker } from '@/components/map/LocationPicker';
import { toast } from '@/components/ui/Toast';

export default function MitraProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(-6.2);
  const [lng, setLng] = useState(106.8);
  const [specializations, setSpecializations] = useState<string[]>([]);

  const { data: mitraData, isLoading } = useQuery({
    queryKey: ['mitra-profile-full', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mitra_profiles')
        .select(`
          *,
          profiles (
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('id', profile!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!profile,
  });

  useEffect(() => {
    if (mitraData) {
      setBusinessName(mitraData.business_name || '');
      setBio(mitraData.bio || '');
      setAddress(mitraData.address || '');
      setLat(mitraData.lat || -6.2);
      setLng(mitraData.lng || 106.8);
      // Fallback if specializations is null
      setSpecializations(mitraData.specializations || []);
    }
  }, [mitraData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('mitra_profiles')
        .update({
          business_name: businessName,
          bio: bio || null,
          address: address,
          lat: lat,
          lng: lng,
          specializations: specializations,
        })
        .eq('id', profile!.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitra-profile-full'] });
      toast.success('Profil berhasil diperbarui!');
    },
    onError: () => {
      toast.error('Gagal menyimpan perubahan');
    },
  });

  const toggleSpecialization = (spec: string) => {
    setSpecializations((prev) => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const VEHICLE_SPECS = [
    { id: 'motor', label: 'Motor', icon: Bike },
    { id: 'mobil', label: 'Mobil', icon: Car },
  ];

  if (isLoading) {
    return (
      <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </PageTransition>
    );
  }

  const userProfile = mitraData?.profiles;

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)} className="h-10 w-10 rounded-full p-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Profil Mitra
          </h1>
        </div>

        {/* Info Card (Non-editable) */}
        <Card className="p-5 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          <div className="relative shrink-0">
            <img 
              src={userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || 'User')}&background=random`} 
              alt={userProfile?.full_name}
              className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
            />
            {mitraData?.verification_status === 'verified' && (
              <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-success text-white flex items-center justify-center border-2 border-white dark:border-gray-800">
                <Shield className="h-3 w-3" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {userProfile?.full_name}
              </h2>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {userProfile?.email}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant={
                mitraData?.verification_status === 'verified' ? 'success' : 
                mitraData?.verification_status === 'rejected' ? 'danger' : 'warning'
              }>
                {mitraData?.verification_status === 'verified' ? 'Terverifikasi' : 
                 mitraData?.verification_status === 'rejected' ? 'Ditolak' : 'Menunggu Verifikasi'}
              </Badge>
              <div className="flex items-center gap-1 text-sm font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                <Star className="h-3.5 w-3.5 fill-current" />
                {mitraData?.average_rating ? Number(mitraData.average_rating).toFixed(1) : 'Baru'}
              </div>
              <div className="flex items-center gap-1 text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2.5 py-0.5 rounded-full">
                <Package className="h-3.5 w-3.5" />
                {mitraData?.total_orders_completed || 0} Order
              </div>
            </div>
          </div>
        </Card>

        {/* Informasi Usaha */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light pb-2 dark:border-border-dark mb-4">
            <Wrench className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Informasi Usaha
            </h3>
          </div>
          
          <Input
            label="Nama Bengkel / Usaha"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          
          <Textarea
            label="Bio Singkat"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />

          <Input
            label="Alamat Lengkap"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Card>

        {/* Lokasi Lapak */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light pb-2 dark:border-border-dark mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Lokasi Lapak / Bengkel
            </h3>
          </div>
          
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Geser pin di peta untuk memperbarui lokasi lapak/bengkel Anda. Mitra keliling bisa memperbarui lokasi ini kapan saja agar sesuai dengan posisi saat ini.
          </p>

          <LocationPicker 
            value={{ lat, lng }}
            onChange={(loc) => {
              setLat(loc.lat);
              setLng(loc.lng);
            }}
          />
        </Card>

        {/* Spesialisasi */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light pb-2 dark:border-border-dark mb-4">
            <Wrench className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Spesialisasi Kendaraan
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {VEHICLE_SPECS.map((spec) => {
              const Icon = spec.icon;
              const isSelected = specializations.includes(spec.id);
              
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => toggleSpecialization(spec.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-200",
                    isSelected 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-border-light bg-card-light text-text-muted-light hover:border-primary/50 dark:border-border-dark dark:bg-card-dark dark:text-text-muted-dark"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{spec.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Simpan Perubahan */}
        <Button
          size="lg"
          fullWidth
          isLoading={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
          leftIcon={<Save className="h-5 w-5" />}
          className="shadow-lg"
        >
          Simpan Perubahan
        </Button>

      </div>
    </PageTransition>
  );
}
