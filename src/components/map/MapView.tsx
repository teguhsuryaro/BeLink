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
