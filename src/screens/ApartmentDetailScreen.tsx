import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  Check,
  CheckCircle2,
  Heart,
  MapPin,
  Shield,
  Star,
  Wifi,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../lib/format';
import { t } from '../i18n/translations';
import { ShopThisRoomViewer } from '../components/ShopThisRoomViewer';
import { PaymentSheet } from '../components/PaymentSheet';
import { QrScannerModal } from '../components/QrScannerModal';
import { SafeImage } from '../components/SafeImage';

const AVAILABLE_DATES = [
  { date: '2026-11-18', label: '18', day: 'Wed' },
  { date: '2026-11-19', label: '19', day: 'Thu' },
  { date: '2026-11-20', label: '20', day: 'Fri' },
  { date: '2026-11-21', label: '21', day: 'Sat' },
  { date: '2026-11-22', label: '22', day: 'Sun' },
  { date: '2026-11-23', label: '23', day: 'Mon' },
  { date: '2026-11-24', label: '24', day: 'Tue' },
  { date: '2026-11-25', label: '25', day: 'Wed' },
  { date: '2026-11-26', label: '26', day: 'Thu' },
];

export const ApartmentDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    apartments,
    furniture,
    currency,
    language,
    wishlistIds,
    toggleWishlist,
    createBooking,
    triggerPush,
    userName,
  } = useAppStore();

  const apartment = apartments.find((a) => a.id === id) ?? apartments[0];
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedStartIdx, setSelectedStartIdx] = useState(0);
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const saved = wishlistIds.includes(apartment.id);

  const pricing = useMemo(() => {
    const staySubtotal = apartment.nightlyRateNgn * nights;
    const taxable = staySubtotal + apartment.cleaningFeeNgn;
    const vat = Math.round(taxable * 0.075);
    const total = taxable + vat + apartment.cautionDepositNgn;
    return { staySubtotal, vat, total };
  }, [apartment, nights]);

  const checkInDate = AVAILABLE_DATES[selectedStartIdx]?.date ?? '2026-11-18';
  const checkOutDate =
    AVAILABLE_DATES[Math.min(AVAILABLE_DATES.length - 1, selectedStartIdx + nights)]?.date ??
    '2026-11-21';

  const handleBookingSuccess = (method: 'Card' | 'Bank Transfer' | 'Paystack') => {
    const doorCode = `${Math.floor(100000 + Math.random() * 899999)}#`;
    createBooking({
      id: `BK-${Math.floor(9200 + Math.random() * 700)}`,
      apartmentId: apartment.id,
      apartmentName: apartment.name,
      area: apartment.area,
      guestName: userName,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests,
      nightlyRateNgn: apartment.nightlyRateNgn,
      cleaningFeeNgn: apartment.cleaningFeeNgn,
      cautionDepositNgn: apartment.cautionDepositNgn,
      vatNgn: pricing.vat,
      totalNgn: pricing.total,
      status: 'Active',
      doorCode,
      wifiSsid: `IleForm_${apartment.area.replace(/\s+/g, '')}`,
      wifiPass: 'ikoyiAtelier26',
      paymentMethod: method,
      createdAt: 'Just now',
    });
    triggerPush(
      `Booking Confirmed · ${apartment.name}`,
      `Smart door code ${doorCode} is ready in My Stay.`,
      '/stay',
      'booking'
    );
    navigate('/stay');
  };

  const roomPieces = apartment.hotspots
    .map((h) => furniture.find((f) => f.id === h.furnitureId))
    .filter(Boolean);

  return (
    <div className="space-y-6 pb-8">
      {/* Interactive Showroom Gallery */}
      <div className="space-y-2.5">
        <ShopThisRoomViewer
          image={apartment.images[activePhotoIdx]}
          apartmentName={apartment.name}
          hotspots={activePhotoIdx === 0 ? apartment.hotspots : apartment.hotspots.slice(0, 2)}
          onScanQrClick={() => setQrOpen(true)}
        />
        <div className="flex items-center gap-2">
          {apartment.images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePhotoIdx(idx)}
              className={`h-14 w-20 rounded-xl overflow-hidden border-2 transition-all ${
                activePhotoIdx === idx
                  ? 'border-[#B45309]'
                  : 'border-transparent opacity-65 hover:opacity-100'
              }`}
            >
              <SafeImage src={img} alt={`${apartment.name} view ${idx + 1}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Title & Key Specs */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              {apartment.area} · {apartment.bedrooms} bed · {apartment.bathrooms} bath · Host{' '}
              {apartment.hostName}
            </div>
            <h1 className="font-display text-2xl font-semibold leading-tight mt-0.5">
              {apartment.name}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(apartment.id)}
            aria-label="Save residence"
            className="min-h-[44px] min-w-[44px] rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center"
          >
            <Heart className={`w-5 h-5 ${saved ? 'fill-[#B45309] text-[#B45309]' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-300">
          <span className="flex items-center gap-1 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            {apartment.rating} ({apartment.reviewCount} reviews)
          </span>
          <span>·</span>
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#134E4A] dark:text-teal-400 shrink-0" />
            {apartment.address}
          </span>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
          {apartment.description}
        </p>
      </div>

      {/* Pieces Featured in This Apartment */}
      <section className="space-y-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold">
            {t(language, 'shopThisRoom')}
          </h2>
          <span className="text-xs text-[#B45309] font-medium">Tap to order</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {roomPieces.map((piece) =>
            piece ? (
              <button
                key={piece.id}
                type="button"
                onClick={() => navigate(`/showroom/${piece.id}`)}
                className="w-40 shrink-0 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 overflow-hidden text-left active:scale-[0.98] transition-transform"
              >
                <div className="aspect-[4/3] bg-stone-100 dark:bg-stone-800">
                  <SafeImage src={piece.image} alt={piece.name} />
                </div>
                <div className="p-2.5 space-y-0.5">
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                    {piece.brand}
                  </div>
                  <div className="text-xs font-semibold truncate">{piece.name}</div>
                  <div className="font-mono-tabular text-xs font-semibold text-[#B45309]">
                    {formatMoney(piece.priceNgn, currency)}
                  </div>
                </div>
              </button>
            ) : null
          )}
        </div>
      </section>

      {/* Availability Calendar & Price Breakdown (5-Star Hotel Booking Flow) */}
      <section className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#B45309]" />
            <h2 className="font-display text-base font-semibold">Select Check-In &amp; Nights</h2>
          </div>
          <span className="font-mono-tabular text-sm font-semibold">
            {formatMoney(apartment.nightlyRateNgn, currency)}/night
          </span>
        </div>

        {/* Horizontal Date Selector */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {AVAILABLE_DATES.slice(0, 6).map((d, idx) => {
            const blocked = apartment.blockedDates.includes(d.date);
            const selected = selectedStartIdx === idx;
            return (
              <button
                key={d.date}
                type="button"
                disabled={blocked}
                onClick={() => setSelectedStartIdx(idx)}
                className={`min-w-[48px] py-2 px-2 rounded-xl flex flex-col items-center text-xs transition-colors border ${
                  blocked
                    ? 'opacity-35 line-through border-stone-200 dark:border-stone-800'
                    : selected
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                      : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className="text-[10px] opacity-75">{d.day}</span>
                <span className="font-mono-tabular font-semibold mt-0.5">{d.label}</span>
              </button>
            );
          })}
        </div>

        {/* Nights & Guests Steppers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between">
            <span className="text-xs font-medium">Nights</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNights(Math.max(1, nights - 1))}
                className="w-7 h-7 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-semibold"
              >
                -
              </button>
              <span className="font-mono-tabular text-xs font-semibold w-4 text-center">
                {nights}
              </span>
              <button
                type="button"
                onClick={() => setNights(Math.min(14, nights + 1))}
                className="w-7 h-7 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-semibold"
              >
                +
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between">
            <span className="text-xs font-medium">Guests</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-7 h-7 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-semibold"
              >
                -
              </button>
              <span className="font-mono-tabular text-xs font-semibold w-4 text-center">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(apartment.maxGuests, guests + 1))}
                className="w-7 h-7 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-semibold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Itemized Price Breakdown */}
        <div className="space-y-2 pt-2 border-t border-stone-200/80 dark:border-stone-800 text-xs">
          <div className="font-semibold text-stone-900 dark:text-stone-100">
            {t(language, 'priceBreakdown')}
          </div>
          <div className="flex justify-between text-stone-600 dark:text-stone-400">
            <span>
              {formatMoney(apartment.nightlyRateNgn, currency)} × {nights} nights
            </span>
            <span className="font-mono-tabular">{formatMoney(pricing.staySubtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-stone-400">
            <span>{t(language, 'cleaningFee')}</span>
            <span className="font-mono-tabular">
              {formatMoney(apartment.cleaningFeeNgn, currency)}
            </span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-stone-400">
            <span>{t(language, 'cautionDeposit')}</span>
            <span className="font-mono-tabular">
              {formatMoney(apartment.cautionDepositNgn, currency)}
            </span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-stone-400">
            <span>{t(language, 'vatLabel')}</span>
            <span className="font-mono-tabular">{formatMoney(pricing.vat, currency)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-stone-800 text-sm font-semibold text-stone-900 dark:text-stone-100">
            <span>{t(language, 'totalDue')}</span>
            <span className="font-mono-tabular">{formatMoney(pricing.total, currency)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCheckoutOpen(true)}
          className="w-full min-h-[52px] rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t(language, 'reserveNow')}</span>
        </button>
      </section>

      {/* Amenities & House Rules */}
      <section className="space-y-3 pt-2 border-t border-stone-200/80 dark:border-stone-800">
        <h2 className="font-display text-base font-semibold">Residence Amenities</h2>
        <div className="grid grid-cols-2 gap-2.5 text-xs text-stone-700 dark:text-stone-300">
          {apartment.amenities.map((am) => (
            <div key={am} className="flex items-center gap-2">
              {am.includes('Wi-Fi') ? (
                <Wifi className="w-3.5 h-3.5 text-[#134E4A] dark:text-teal-400 shrink-0" />
              ) : (
                <Check className="w-3.5 h-3.5 text-[#134E4A] dark:text-teal-400 shrink-0" />
              )}
              <span className="truncate">{am}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 space-y-1.5">
          <div className="text-xs font-semibold flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
            <Shield className="w-3.5 h-3.5 text-[#B45309]" />
            <span>House Rules</span>
          </div>
          {apartment.houseRules.map((rule) => (
            <p key={rule} className="text-xs text-stone-500 dark:text-stone-400">
              · {rule}
            </p>
          ))}
        </div>
      </section>

      {/* Guest Reviews */}
      <section className="space-y-3 pt-2 border-t border-stone-200/80 dark:border-stone-800">
        <h2 className="font-display text-base font-semibold">Verified Guest Notes</h2>
        <div className="space-y-3">
          {apartment.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200/80 dark:border-stone-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">{rev.author}</span>
                <span className="text-stone-500">{rev.date} · {rev.rating} ★</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {rev.comment}
              </p>
              {rev.purchasedFurniture && (
                <div className="text-[11px] text-[#B45309] font-medium">
                  Purchased from this suite: {rev.purchasedFurniture}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <PaymentSheet
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title={`Reserve ${apartment.name}`}
        subtitle={`${checkInDate} → ${checkOutDate} · ${nights} nights · ${guests} guests`}
        amountNgn={pricing.total}
        onSuccess={handleBookingSuccess}
      />

      <QrScannerModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        onScanFurnitureId={(fid) => navigate(`/showroom/${fid}`)}
      />
    </div>
  );
};
