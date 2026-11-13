import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Heart,
  List,
  Map as MapIcon,
  QrCode,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Star,
  Users,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../lib/format';
import { t } from '../i18n/translations';
import { LAGOS_AREAS } from '../lib/api';
import { LagosArea } from '../types';
import { ShopThisRoomViewer } from '../components/ShopThisRoomViewer';
import { LagosMapView } from '../components/LagosMapView';
import { SafeImage } from '../components/SafeImage';
import { BottomSheet } from '../components/BottomSheet';
import { QrScannerModal } from '../components/QrScannerModal';

export const ExploreScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    apartments,
    currency,
    language,
    wishlistIds,
    toggleWishlist,
    setRole,
  } = useAppStore();

  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<'All' | LagosArea>('All');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [minBeds, setMinBeds] = useState<number>(0);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [dateRange, setDateRange] = useState('Nov 18 – Nov 22');
  const [filterOpen, setFilterOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const activeApartments = useMemo(
    () => apartments.filter((a) => a.status === 'Active'),
    [apartments]
  );

  const filtered = useMemo(() => {
    return activeApartments.filter((apt) => {
      const matchesArea = selectedArea === 'All' || apt.area === selectedArea;
      const matchesBeds = minBeds === 0 || apt.bedrooms >= minBeds;
      const matchesGuests = apt.maxGuests >= guestCount;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        apt.name.toLowerCase().includes(q) ||
        apt.area.toLowerCase().includes(q) ||
        apt.address.toLowerCase().includes(q);
      return matchesArea && matchesBeds && matchesGuests && matchesQuery;
    });
  }, [activeApartments, selectedArea, minBeds, guestCount, query]);

  const featuredRoom = activeApartments[0];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 550);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Search & Date / Guests Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(language, 'searchPlaceholder')}
              className="w-full min-h-[46px] pl-10 pr-3 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-[#B45309]"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            aria-label="Filter stays"
            className="min-h-[46px] min-w-[46px] rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-200 active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            aria-label="Toggle map or list"
            className="min-h-[46px] px-3 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold flex items-center gap-1.5 active:scale-95"
          >
            {viewMode === 'list' ? (
              <>
                <MapIcon className="w-3.5 h-3.5" />
                <span>{t(language, 'mapView')}</span>
              </>
            ) : (
              <>
                <List className="w-3.5 h-3.5" />
                <span>{t(language, 'listView')}</span>
              </>
            )}
          </button>
        </div>

        {/* Compact Stay Strip */}
        <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 px-1">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
            <span>{dateRange}</span>
            <span>·</span>
            <Users className="w-3.5 h-3.5 text-[#B45309]" />
            <span>
              {guestCount} {t(language, 'guestsLabel')}
            </span>
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Updating' : `${filtered.length} suites`}</span>
          </button>
        </div>

        {/* Area Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {LAGOS_AREAS.map((area) => {
            const active = selectedArea === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`min-h-[38px] px-3.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#134E4A] text-white'
                    : 'bg-white dark:bg-[#1B1815] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
                }`}
              >
                {area === 'All' ? t(language, 'allAreas') : area}
              </button>
            );
          })}
        </div>
      </div>

      {/* WOW #1: Interactive "Shop This Room" Hero */}
      {featuredRoom && viewMode === 'list' && (
        <section className="space-y-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                {t(language, 'shopThisRoom')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t(language, 'tapHotspots')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="shrink-0 text-xs font-semibold text-[#B45309] flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Tag</span>
            </button>
          </div>
          <ShopThisRoomViewer
            image={featuredRoom.images[0]}
            apartmentName={featuredRoom.name}
            hotspots={featuredRoom.hotspots}
            onScanQrClick={() => setQrOpen(true)}
          />
        </section>
      )}

      {/* WOW #2: Landlord Portfolio Shortcut (1-Tap Reachable from Home) */}
      {viewMode === 'list' && (
        <button
          type="button"
          onClick={() => {
            setRole('landlord');
            navigate('/landlord');
          }}
          className="w-full p-3.5 rounded-2xl bg-[#134E4A] text-[#FAF8F5] flex items-center justify-between gap-3 text-left shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="min-w-0">
            <div className="text-[11px] text-teal-200 font-medium">
              Landlord &amp; Co-Ownership Desk
            </div>
            <div className="font-display text-base font-semibold truncate">
              Contribute a Lagos Property · Earn 18.4% Yield
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-amber-300" />
          </div>
        </button>
      )}

      {/* Map View or Curated Apartment List */}
      {viewMode === 'map' ? (
        <LagosMapView
          apartments={filtered}
          onSelectApartment={(id) => navigate(`/apartments/${id}`)}
        />
      ) : refreshing ? (
        <div className="space-y-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#1B1815] border border-stone-200/70 dark:border-stone-800 animate-pulse"
            >
              <div className="aspect-[16/10] bg-stone-200 dark:bg-stone-800" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-2/3 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="h-3 w-1/2 bg-stone-200 dark:bg-stone-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1B1815]">
          <p className="font-display text-lg font-semibold">No residences match your filter</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Try expanding your Lagos neighborhood or lowering bedroom count.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedArea('All');
              setMinBeds(0);
              setGuestCount(1);
            }}
            className="mt-4 min-h-[44px] px-5 rounded-xl bg-[#B45309] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">
              {selectedArea === 'All' ? 'Curated Lagos Residences' : `${selectedArea} Residences`}
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono-tabular">
              {filtered.length} available
            </span>
          </div>

          <div className="space-y-5">
            {filtered.map((apt) => {
              const saved = wishlistIds.includes(apt.id);
              return (
                <article
                  key={apt.id}
                  onClick={() => navigate(`/apartments/${apt.id}`)}
                  className="cursor-pointer group rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200/80 dark:border-stone-800 overflow-hidden active:scale-[0.99] transition-transform"
                >
                  <div className="relative aspect-[16/10] bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <SafeImage
                      src={apt.images[0]}
                      alt={apt.name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(apt.id);
                      }}
                      aria-label={saved ? 'Remove from saved' : 'Save residence'}
                      className="absolute top-2.5 right-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white"
                    >
                      <Heart
                        className={`w-4 h-4 ${saved ? 'fill-amber-400 text-amber-400' : 'text-white'}`}
                      />
                    </button>
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-medium drop-shadow-sm">
                        {apt.hotspots.length} shoppable room pieces
                      </span>
                      <span className="flex items-center gap-1 font-semibold drop-shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {apt.rating}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      {apt.area} · {apt.bedrooms} {t(language, 'bedroomsLabel')} · Up to {apt.maxGuests} {t(language, 'guestsLabel')}
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {apt.name}
                      </h3>
                      <div className="shrink-0 text-right">
                        <span className="font-mono-tabular text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {formatMoney(apt.nightlyRateNgn, currency)}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400">
                          /{t(language, 'perNight')}
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {apt.address}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Search Filters Bottom Sheet */}
      <BottomSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Refine Lagos Stay"
        subtitle="Dates, guests, and minimum bedrooms"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Stay Dates</label>
            <div className="grid grid-cols-2 gap-2">
              {['Nov 18 – Nov 22', 'Nov 25 – Nov 29', 'Dec 04 – Dec 09', 'Dec 20 – Dec 27'].map(
                (dr) => (
                  <button
                    key={dr}
                    type="button"
                    onClick={() => setDateRange(dr)}
                    className={`min-h-[42px] px-3 rounded-xl text-xs font-medium border ${
                      dateRange === dr
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                        : 'border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {dr}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-y border-stone-200 dark:border-stone-800">
            <span className="text-sm font-medium">Guests</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-700 font-semibold"
              >
                -
              </button>
              <span className="font-mono-tabular text-sm font-semibold w-5 text-center">
                {guestCount}
              </span>
              <button
                type="button"
                onClick={() => setGuestCount(Math.min(8, guestCount + 1))}
                className="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-700 font-semibold"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-stone-500 mb-2">Bedrooms</div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setMinBeds(b)}
                  className={`min-h-[40px] rounded-xl text-xs font-medium border ${
                    minBeds === b
                      ? 'bg-[#B45309] text-white border-[#B45309]'
                      : 'border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {b === 0 ? 'Any' : `${b}+ Bed`}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFilterOpen(false)}
            className="w-full min-h-[50px] rounded-2xl bg-[#B45309] text-white font-semibold text-sm"
          >
            Show {filtered.length} Residences
          </button>
        </div>
      </BottomSheet>

      <QrScannerModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        onScanFurnitureId={(fid) => navigate(`/showroom/${fid}`)}
      />
    </div>
  );
};
