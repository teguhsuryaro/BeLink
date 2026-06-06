# 02 - Integrasi Peta Leaflet

## Tujuan
Membuat komponen peta interaktif reusable menggunakan React Leaflet + OpenStreetMap.

---

## Langkah-Langkah

### 1. Buat Komponen MapView

**BUAT FILE**: `src/components/map/MapView.tsx`

```typescript
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import { cn } from '@/lib/utils';
import { OSM_TILE_URL, OSM_ATTRIBUTION, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants';

// Fix Leaflet default marker icon (broken in bundlers)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icons
export const userMarkerIcon = new L.DivIcon({
  html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary border-2 border-white shadow-lg">
    <div class="w-3 h-3 rounded-full bg-white"></div>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export const mitraMarkerIcon = new L.DivIcon({
  html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-success border-2 border-white shadow-lg">
    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22 17h-4v-2h1a1 1 0 001-1V4a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h1v2H2v2h20v-2zM7 5h10v9H7V5z"/></svg>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Sub-component untuk re-center peta saat posisi berubah
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

// ============================================
// KOMPONEN UTAMA
// ============================================
interface MapViewProps {
  /** Posisi center peta */
  center?: [number, number];
  /** Level zoom */
  zoom?: number;
  /** Tinggi peta */
  height?: string;
  /** Class CSS tambahan */
  className?: string;
  /** Marker-marker yang ditampilkan */
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    icon?: L.DivIcon;
    popup?: string;
  }>;
  /** Lingkaran radius pencarian */
  searchRadius?: {
    center: [number, number];
    radiusMeters: number;
  };
  /** Callback saat peta diklik */
  onClick?: (lat: number, lng: number) => void;
  /** Apakah peta bisa di-interaksi */
  interactive?: boolean;
  children?: React.ReactNode;
}

export function MapView({
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  height = '300px',
  className,
  markers = [],
  searchRadius,
  onClick,
  interactive = true,
  children,
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={cn('rounded-xl z-0', className)}
      style={{ height, width: '100%' }}
      scrollWheelZoom={interactive}
      dragging={interactive}
      zoomControl={interactive}
      attributionControl={true}
    >
      <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />

      {/* Re-center saat center prop berubah */}
      <RecenterMap lat={center[0]} lng={center[1]} />

      {/* Markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={marker.icon || new L.Icon.Default()}
        >
          {marker.popup && <Popup>{marker.popup}</Popup>}
        </Marker>
      ))}

      {/* Search Radius Circle */}
      {searchRadius && (
        <Circle
          center={searchRadius.center}
          radius={searchRadius.radiusMeters}
          pathOptions={{
            color: '#3661E2',
            fillColor: '#3661E2',
            fillOpacity: 0.08,
            weight: 1,
            dashArray: '4 4',
          }}
        />
      )}

      {children}
    </MapContainer>
  );
}
```

### 2. Buat Komponen LocationPicker

**BUAT FILE**: `src/components/map/LocationPicker.tsx`

```typescript
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
        {geo.isLoading ? t('order.detecting') : t('order.detect_location')}
      </Button>

      {/* Peta */}
      <div className={cn('overflow-hidden rounded-xl border', error ? 'border-danger' : 'border-border-light dark:border-border-dark')}>
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
```

### 3. Buat Komponen MitraMarkers (placeholder)

**BUAT FILE**: `src/components/map/MitraMarkers.tsx`

```typescript
import { Marker, Popup } from 'react-leaflet';
import { mitraMarkerIcon } from './MapView';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { SearchableMitra } from '@/types/mitra.types';
import { formatDistance } from '@/lib/utils';

interface MitraMarkersProps {
  mitras: SearchableMitra[];
}

export function MitraMarkers({ mitras }: MitraMarkersProps) {
  return (
    <>
      {mitras.map((mitra) => (
        <Marker
          key={mitra.id}
          position={[mitra.lat, mitra.lng]}
          icon={mitraMarkerIcon}
        >
          <Popup>
            <div className="flex items-center gap-2 min-w-[160px]">
              <Avatar src={mitra.avatar_url} name={mitra.full_name} size="sm" />
              <div>
                <p className="font-semibold text-sm">{mitra.full_name}</p>
                {mitra.business_name && (
                  <p className="text-xs text-gray-500">{mitra.business_name}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="success" dot>
                    {mitra.average_rating.toFixed(1)}
                  </Badge>
                  {mitra.distance_km !== undefined && (
                    <span className="text-xs text-gray-500">
                      {formatDistance(mitra.distance_km)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
```

---

## Validasi

- [ ] File `src/components/map/MapView.tsx` sudah ada
- [ ] File `src/components/map/LocationPicker.tsx` sudah ada
- [ ] File `src/components/map/MitraMarkers.tsx` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error
- [ ] Peta OpenStreetMap bisa dirender tanpa error (test di halaman kosong jika perlu)

---

**Selesai? Lanjut ke `03-form-darurat-step-wizard.md`**
