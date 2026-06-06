import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useGeolocation } from '@/hooks/useGeolocation';
import { userMarkerIcon } from './MapView';
import { OSM_TILE_URL, OSM_ATTRIBUTION, DEFAULT_MAP_CENTER } from '@/lib/constants';
import { useTranslation } from 'react-i18next';

interface LocationPickerProps {
  /** Posisi yang sudah dipilih sebelumnya */
  value?: { lat: number; lng: number } | null;
  /** Callback saat lokasi berubah */
  onChange: (location: { lat: number; lng: number }) => void;
  /** Tinggi peta */
  height?: string;
  /** Error message */
  error?: string;
}

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({ value, onChange, height = '250px', error }: LocationPickerProps) {
  const { t } = useTranslation();
  const geo = useGeolocation();
  const [position, setPosition] = useState<[number, number] | null>(
    value ? [value.lat, value.lng] : null,
  );

  // Saat GPS berhasil mendeteksi lokasi
  useEffect(() => {
    if (geo.lat && geo.lng) {
      const newPos: [number, number] = [geo.lat, geo.lng];
      setPosition(newPos);
      onChange({ lat: geo.lat, lng: geo.lng });
    }
  }, [geo.lat, geo.lng, onChange]);

  const handleClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onChange({ lat, lng });
  };

  const center: [number, number] = position || DEFAULT_MAP_CENTER;

  return (
    <div className="space-y-2">
      {/* Tombol deteksi GPS */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={geo.getCurrentPosition}
        isLoading={geo.isLoading}
        leftIcon={<Crosshair className="h-4 w-4" />}
      >
        {geo.isLoading ? t('order.detecting', 'Mendeteksi lokasi...') : t('order.detect_location', 'Gunakan Lokasi Saat Ini')}
      </Button>

      {/* Peta */}
      <div className={cn('overflow-hidden rounded-xl border touch-none', error ? 'border-danger' : 'border-border-light dark:border-border-dark')}>
        <MapContainer
          center={center}
          zoom={15}
          style={{ height, width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
          <ClickHandler onClick={handleClick} />
          {position && <Marker position={position} icon={userMarkerIcon} />}
        </MapContainer>
      </div>

      {/* Koordinat terpilih */}
      {position && (
        <p className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark">
          <MapPin className="h-3 w-3" />
          {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      )}

      {/* Error GPS */}
      {geo.error && <p className="text-xs text-danger">{geo.error}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
