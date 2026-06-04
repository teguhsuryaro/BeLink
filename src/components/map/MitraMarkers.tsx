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
