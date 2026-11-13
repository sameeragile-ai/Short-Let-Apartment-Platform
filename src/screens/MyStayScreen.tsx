import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  Check,
  Clock,
  Copy,
  KeyRound,
  QrCode,
  ShoppingBag,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatMoney, formatShortDate } from '../lib/format';
import { t } from '../i18n/translations';
import { SafeImage } from '../components/SafeImage';
import { BottomSheet } from '../components/BottomSheet';
import { QrScannerModal } from '../components/QrScannerModal';

export const MyStayScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    bookings,
    apartments,
    furniture,
    currency,
    language,
    requestHousekeeping,
    extendActiveStay,
    triggerPush,
  } = useAppStore();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [cleaningRequested, setCleaningRequested] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [extraNights, setExtraNights] = useState(2);
  const [qrOpen, setQrOpen] = useState(false);

  const activeBooking = bookings.find((b) => b.status === 'Active') ?? bookings[0];
  const upcomingBookings = bookings.filter((b) => b.id !== activeBooking?.id).slice(0, 4);
  const activeApt = apartments.find((a) => a.id === activeBooking?.apartmentId) ?? apartments[0];

  const suiteFurniture = activeApt.hotspots
    .map((h) => furniture.find((f) => f.id === h.furnitureId))
    .filter(Boolean);

  const copyText = (key: string, val: string) => {
    navigator.clipboard?.writeText(val).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleRequestCleaning = () => {
    if (!activeBooking) return;
    requestHousekeeping(activeBooking.apartmentName, activeBooking.area, 'Turnover Clean');
    setCleaningRequested(true);
    triggerPush(
      'Housekeeping Scheduled',
      `Blessing Ojo will refresh ${activeBooking.apartmentName} in 45 mins.`,
      '/stay',
      'booking'
    );
    setTimeout(() => setCleaningRequested(false), 3000);
  };

  const handleConfirmExtend = () => {
    if (!activeBooking) return;
    extendActiveStay(activeBooking.id, extraNights);
    setExtendOpen(false);
    triggerPush(
      'Stay Extended',
      `Added ${extraNights} night(s) at ${activeBooking.apartmentName}.`,
      '/stay',
      'booking'
    );
  };

  if (!activeBooking) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="font-display text-xl font-semibold">No active stay right now</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-2xl bg-[#B45309] text-white text-xs font-semibold"
        >
          Browse Lagos Residences
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Digital Keycard & Residence Status */}
      <section className="rounded-3xl bg-[#134E4A] text-[#FAF8F5] p-5 space-y-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] text-teal-200 font-medium">
              Checked In · {activeBooking.id}
            </div>
            <h1 className="font-display text-xl font-semibold leading-tight mt-0.5">
              {activeBooking.apartmentName}
            </h1>
            <div className="text-xs text-teal-100/80 mt-0.5">
              {activeBooking.area} · {formatShortDate(activeBooking.checkIn)} –{' '}
              {formatShortDate(activeBooking.checkOut)} ({activeBooking.nights} nights)
            </div>
          </div>
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            aria-label="Scan suite furniture tag"
            className="min-h-[44px] min-w-[44px] rounded-2xl bg-white/15 flex items-center justify-center active:scale-95"
          >
            <QrCode className="w-5 h-5 text-amber-200" />
          </button>
        </div>

        {/* Smart-Lock Door Code & Wi-Fi */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => copyText('door', activeBooking.doorCode)}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-left transition-colors active:scale-[0.98]"
          >
            <div className="flex items-center justify-between text-[11px] text-teal-200">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                Door Code
              </span>
              {copiedKey === 'door' ? (
                <Check className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70" />
              )}
            </div>
            <div className="font-mono-tabular text-xl font-semibold tracking-wider mt-1.5 text-white">
              {activeBooking.doorCode}
            </div>
          </button>

          <button
            type="button"
            onClick={() => copyText('wifi', activeBooking.wifiPass)}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-left transition-colors active:scale-[0.98]"
          >
            <div className="flex items-center justify-between text-[11px] text-teal-200">
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" />
                {t(language, 'wifiAccess')}
              </span>
              {copiedKey === 'wifi' ? (
                <Check className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70" />
              )}
            </div>
            <div className="font-mono-tabular text-xs font-semibold mt-1.5 truncate text-white">
              {activeBooking.wifiSsid}
            </div>
            <div className="font-mono-tabular text-[11px] text-teal-100/80 truncate">
              {activeBooking.wifiPass}
            </div>
          </button>
        </div>

        {/* Check-Out & Quick Concierge Actions */}
        <div className="flex items-center justify-between text-xs text-teal-100/90 pt-1 border-t border-white/15">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            Check-out at 12:00 PM
          </span>
          <span className="font-mono-tabular font-semibold">
            {formatMoney(activeBooking.totalNgn, currency)}
          </span>
        </div>
      </section>

      {/* Stay Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleRequestCleaning}
          className="min-h-[52px] px-3 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-[#B45309]" />
          <span>{cleaningRequested ? 'Cleaner Dispatched' : t(language, 'requestCleaning')}</span>
        </button>

        <button
          type="button"
          onClick={() => setExtendOpen(true)}
          className="min-h-[52px] px-3 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <CalendarPlus className="w-4 h-4 text-[#134E4A] dark:text-teal-400" />
          <span>{t(language, 'extendStay')}</span>
        </button>
      </div>

      {/* Buy the Bed & Sofa You Slept On */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">
              {t(language, 'buyWhatYouSleptOn')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Pieces currently inside {activeBooking.apartmentName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/apartments/${activeApt.id}`)}
            className="text-xs font-semibold text-[#B45309]"
          >
            Room Photo
          </button>
        </div>

        <div className="space-y-2.5">
          {suiteFurniture.map((item) =>
            item ? (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/showroom/${item.id}`)}
                className="w-full p-2.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
                  <SafeImage src={item.image} alt={item.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {item.brand} · {item.availability}
                  </div>
                  <div className="font-display text-sm font-semibold truncate">{item.name}</div>
                  <div className="font-mono-tabular text-xs font-semibold text-[#B45309] mt-0.5">
                    {formatMoney(item.priceNgn, currency)}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </button>
            ) : null
          )}
        </div>
      </section>

      {/* Upcoming & Recent Stays */}
      <section className="space-y-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800">
        <h2 className="font-display text-base font-semibold">Upcoming &amp; Past Stays</h2>
        <div className="space-y-2">
          {upcomingBookings.map((bk) => (
            <button
              key={bk.id}
              type="button"
              onClick={() => navigate(`/apartments/${bk.apartmentId}`)}
              className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-left"
            >
              <div className="min-w-0">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  {bk.status} · {bk.area} · {bk.nights} nights
                </div>
                <div className="font-display text-sm font-semibold truncate mt-0.5">
                  {bk.apartmentName}
                </div>
              </div>
              <div className="font-mono-tabular text-xs font-semibold shrink-0 ml-2">
                {formatMoney(bk.totalNgn, currency)}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Extend Stay Bottom Sheet */}
      <BottomSheet
        open={extendOpen}
        onClose={() => setExtendOpen(false)}
        title="Extend Your Stay"
        subtitle={activeBooking.apartmentName}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60">
            <span className="text-sm font-medium">Additional Nights</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setExtraNights(Math.max(1, extraNights - 1))}
                className="w-9 h-9 rounded-xl border border-stone-300 dark:border-stone-700 font-semibold"
              >
                -
              </button>
              <span className="font-mono-tabular text-base font-semibold w-5 text-center">
                {extraNights}
              </span>
              <button
                type="button"
                onClick={() => setExtraNights(Math.min(7, extraNights + 1))}
                className="w-9 h-9 rounded-xl border border-stone-300 dark:border-stone-700 font-semibold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm font-semibold px-1">
            <span>Extension Total (incl. VAT)</span>
            <span className="font-mono-tabular text-[#B45309]">
              {formatMoney(Math.round(activeBooking.nightlyRateNgn * extraNights * 1.075), currency)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirmExtend}
            className="w-full min-h-[50px] rounded-2xl bg-[#B45309] text-white font-semibold text-sm"
          >
            Confirm Extension
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
