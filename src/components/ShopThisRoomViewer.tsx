import React, { useState } from 'react';
import { Check, QrCode, Ruler, ShoppingBag, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../lib/format';
import { t } from '../i18n/translations';
import { FurnitureItem, RoomHotspot } from '../types';
import { SafeImage } from './SafeImage';
import { BottomSheet } from './BottomSheet';

interface ShopThisRoomViewerProps {
  image: string;
  apartmentName: string;
  hotspots: RoomHotspot[];
  aspectClass?: string;
  onScanQrClick?: () => void;
}

export const ShopThisRoomViewer: React.FC<ShopThisRoomViewerProps> = ({
  image,
  apartmentName,
  hotspots,
  aspectClass = 'aspect-[16/10]',
  onScanQrClick,
}) => {
  const { furniture, currency, language, addToCart, triggerPush } = useAppStore();
  const [selectedHotspot, setSelectedHotspot] = useState<RoomHotspot | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [customMode, setCustomMode] = useState(false);
  const [customDimensions, setCustomDimensions] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const selectedProduct: FurnitureItem | undefined = selectedHotspot
    ? furniture.find((f) => f.id === selectedHotspot.furnitureId)
    : undefined;

  const openHotspot = (spot: RoomHotspot) => {
    const item = furniture.find((f) => f.id === spot.furnitureId);
    setSelectedHotspot(spot);
    setSelectedFinish(item?.finishOptions[0] ?? 'Signature Natural');
    setCustomMode(false);
    setCustomDimensions('');
    setCustomNotes('');
    setAddedFeedback(false);
  };

  const handleAdd = () => {
    if (!selectedProduct) return;
    addToCart({
      furnitureId: selectedProduct.id,
      quantity: 1,
      finish: selectedFinish || selectedProduct.finishOptions[0],
      isCustomOrder: customMode,
      customDimensions: customMode ? customDimensions || selectedProduct.dimensions : undefined,
      customNotes: customMode ? customNotes : undefined,
    });
    setAddedFeedback(true);
    triggerPush(
      customMode ? 'Custom Order Added' : 'Added to Showroom Bag',
      `${selectedProduct.name} (${selectedFinish}) is in your bag.`,
      '/showroom',
      'order'
    );
    setTimeout(() => {
      setSelectedHotspot(null);
      setAddedFeedback(false);
    }, 650);
  };

  return (
    <>
      <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800`}>
        <SafeImage src={image} alt={apartmentName} className="w-full h-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />

        {/* Interactive Hotspot Pins */}
        {hotspots.map((spot) => {
          const item = furniture.find((f) => f.id === spot.furnitureId);
          return (
            <button
              key={spot.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openHotspot(spot);
              }}
              style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
              aria-label={`Inspect ${spot.label}`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
            >
              <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 shadow-lg ring-2 ring-[#B45309]/70 transition-transform group-hover:scale-110 active:scale-95">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B45309] dark:bg-amber-500" />
              </span>
              <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap px-2 py-0.5 rounded-md bg-stone-900/90 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow">
                {spot.label} · {item ? formatMoney(item.priceNgn, currency, true) : ''}
              </span>
            </button>
          );
        })}

        {/* Bottom Caption Bar */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
          <div className="text-white/95 text-xs font-medium drop-shadow-sm truncate">
            {t(language, 'shopThisRoom')} · {hotspots.length} {language === 'yo' ? 'ohun-ọ̀ṣọ́' : 'tagged pieces'}
          </div>
          {onScanQrClick && (
            <button
              type="button"
              onClick={onScanQrClick}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 text-[11px] font-semibold shadow-sm active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-[#B45309]" />
              <span>QR Tag</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Detail Bottom Sheet */}
      <BottomSheet
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedHotspot(null)}
        title={selectedProduct?.name}
        subtitle={
          selectedProduct
            ? `${selectedProduct.brand} · ${selectedProduct.origin} · SKU ${selectedProduct.sku}`
            : ''
        }
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
              <SafeImage src={selectedProduct.image} alt={selectedProduct.name} />
            </div>

            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="font-mono-tabular text-2xl font-semibold text-stone-900 dark:text-stone-100">
                  {formatMoney(selectedProduct.priceNgn, currency)}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {selectedProduct.availability === 'In Stock'
                    ? `${t(language, 'inStock')} · Delivery in ${selectedProduct.leadTimeDays} days`
                    : `${t(language, 'madeToOrder')} · ${selectedProduct.leadTimeDays} days lead time`}
                </div>
              </div>
              <span className="text-xs font-medium text-[#134E4A] dark:text-teal-400">
                {selectedProduct.category}
              </span>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-stone-200/70 dark:border-stone-800">
              <div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Dimensions</span>
                </div>
                <div className="text-xs font-medium font-mono-tabular mt-0.5">
                  {selectedProduct.dimensions}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Materials</div>
                <div className="text-xs font-medium mt-0.5 truncate">
                  {selectedProduct.materials.join(' · ')}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
                Select Finish
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.finishOptions.map((fin) => (
                  <button
                    key={fin}
                    type="button"
                    onClick={() => setSelectedFinish(fin)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                      selectedFinish === fin
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100'
                        : 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {fin}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCustomMode(!customMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  customMode
                    ? 'border-[#B45309] text-[#B45309] bg-[#B45309]/10'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t(language, 'customOrder')}</span>
              </button>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Custom dimensions or fabric?
              </span>
            </div>

            {customMode && (
              <div className="space-y-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                <input
                  type="text"
                  value={customDimensions}
                  onChange={(e) => setCustomDimensions(e.target.value)}
                  placeholder={`Custom size (default ${selectedProduct.dimensions})`}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 focus:outline-none focus:border-[#B45309]"
                />
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Room placement or fabric request (e.g. Lekki delivery)"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 focus:outline-none focus:border-[#B45309]"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleAdd}
              className="w-full min-h-[52px] rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
            >
              {addedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {customMode ? t(language, 'customOrder') : t(language, 'addToCart')} ·{' '}
                    {formatMoney(selectedProduct.priceNgn, currency)}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </BottomSheet>
    </>
  );
};
