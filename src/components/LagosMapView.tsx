import React, { useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Star } from 'lucide-react';
import { Apartment } from '../types';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../lib/format';
import { SafeImage } from './SafeImage';

interface LagosMapViewProps {
  apartments: Apartment[];
  onSelectApartment: (aptId: string) => void;
  heightClass?: string;
}

export const LagosMapView: React.FC<LagosMapViewProps> = ({
  apartments,
  onSelectApartment,
  heightClass = 'h-[430px]',
}) => {
  const { currency, theme } = useAppStore();
  const [focusedApt, setFocusedApt] = useState<Apartment | null>(apartments[0] ?? null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const center: [number, number] = useMemo(() => {
    if (userCoords) return userCoords;
    if (apartments.length > 0) {
      return [apartments[0].lat, apartments[0].lng];
    }
    return [6.4474, 3.4432];
  }, [apartments, userCoords]);

  const handleLocate = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords([pos.coords.latitude, pos.coords.longitude]);
          setLocating(false);
        },
        () => {
          // Graceful fallback to Ikoyi Lagos center
          setUserCoords([6.4535, 3.4378]);
          setLocating(false);
        },
        { timeout: 3000 }
      );
    } else {
      setUserCoords([6.4535, 3.4378]);
      setLocating(false);
    }
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800`}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; CARTO"
          url={tileUrl}
        />
        {apartments.slice(0, 18).map((apt) => {
          const isSelected = focusedApt?.id === apt.id;
          const label = formatMoney(apt.nightlyRateNgn, currency, true);
          const icon = L.divIcon({
            className: 'custom-price-pin',
            html: `<div style="padding:4px 8px;border-radius:999px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.22);border:1px solid rgba(255,255,255,0.2);background:${
              isSelected ? '#B45309' : '#1C1917'
            };color:#FFFFFF;">${label}</div>`,
            iconSize: [68, 26],
            iconAnchor: [34, 13],
          });

          return (
            <Marker
              key={apt.id}
              position={[apt.lat, apt.lng]}
              icon={icon}
              eventHandlers={{
                click: () => setFocusedApt(apt),
              }}
            />
          );
        })}
      </MapContainer>

      {/* Locate Me Button */}
      <button
        type="button"
        onClick={handleLocate}
        aria-label="Center near my Lagos location"
        className="absolute top-3 right-3 z-[400] min-h-[44px] px-3 rounded-full bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 text-xs font-semibold shadow-md flex items-center gap-1.5 border border-stone-200 dark:border-stone-700 active:scale-95"
      >
        <Navigation className="w-3.5 h-3.5 text-[#B45309]" />
        <span>{locating ? 'Locating...' : 'Near Me'}</span>
      </button>

      {/* Selected Residence Card Overlay */}
      {focusedApt && (
        <button
          type="button"
          onClick={() => onSelectApartment(focusedApt.id)}
          className="absolute bottom-3 left-3 right-3 z-[400] p-2.5 rounded-2xl bg-white/95 dark:bg-[#1B1815]/95 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-xl flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0">
            <SafeImage src={focusedApt.images[0]} alt={focusedApt.name} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              {focusedApt.area} · {focusedApt.bedrooms} bed
            </div>
            <div className="font-display font-semibold text-sm text-stone-900 dark:text-stone-100 truncate">
              {focusedApt.name}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono-tabular text-xs font-semibold text-[#B45309] dark:text-amber-500">
                {formatMoney(focusedApt.nightlyRateNgn, currency)} / night
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-stone-700 dark:text-stone-300">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {focusedApt.rating}
              </span>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
