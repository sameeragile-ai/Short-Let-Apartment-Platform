import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, Check, Heart, Ruler, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../lib/format';
import { t } from '../i18n/translations';
import { SafeImage } from '../components/SafeImage';

export const FurnitureDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    furniture,
    apartments,
    currency,
    language,
    addToCart,
    wishlistIds,
    toggleWishlist,
    triggerPush,
  } = useAppStore();

  const item = furniture.find((f) => f.id === id) ?? furniture[0];
  const [finish, setFinish] = useState(item.finishOptions[0]);
  const [customOrder, setCustomOrder] = useState(item.availability === 'Made to Order');
  const [customDimensions, setCustomDimensions] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [added, setAdded] = useState(false);

  const saved = wishlistIds.includes(item.id);
  const stagedApartment = item.featuredInApartmentId
    ? apartments.find((a) => a.id === item.featuredInApartmentId)
    : apartments[0];

  const handleAdd = () => {
    addToCart({
      furnitureId: item.id,
      quantity: 1,
      finish,
      isCustomOrder: customOrder,
      customDimensions: customOrder ? customDimensions || item.dimensions : undefined,
      customNotes: customOrder ? customNotes : undefined,
    });
    setAdded(true);
    triggerPush(
      customOrder ? 'Custom Order Queued' : 'Added to Showroom Bag',
      `${item.name} (${finish})`,
      '/cart',
      'order'
    );
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
        <SafeImage src={item.image} alt={item.name} />
        <button
          type="button"
          onClick={() => toggleWishlist(item.id)}
          aria-label="Save piece"
          className="absolute top-3 right-3 min-h-[44px] min-w-[44px] rounded-full bg-white/90 dark:bg-stone-900/90 flex items-center justify-center shadow"
        >
          <Heart className={`w-5 h-5 ${saved ? 'fill-[#B45309] text-[#B45309]' : ''}`} />
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="text-xs text-stone-500 dark:text-stone-400">
          {item.brand} · {item.origin} · SKU {item.sku}
        </div>
        <h1 className="font-display text-2xl font-semibold leading-tight">{item.name}</h1>
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-mono-tabular text-2xl font-semibold text-stone-900 dark:text-stone-100">
            {formatMoney(item.priceNgn, currency)}
          </span>
          <span className="text-xs font-medium text-[#134E4A] dark:text-teal-400">
            {item.availability} · {item.leadTimeDays} days
          </span>
        </div>
      </div>

      <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
        {item.description}
      </p>

      {/* Specs */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-start justify-between gap-2 text-xs">
          <span className="text-stone-500 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5" />
            Dimensions
          </span>
          <span className="font-mono-tabular font-medium">{item.dimensions}</span>
        </div>
        <div className="flex items-start justify-between gap-2 text-xs">
          <span className="text-stone-500">Materials</span>
          <span className="font-medium text-right">{item.materials.join(', ')}</span>
        </div>
        <div className="flex items-start justify-between gap-2 text-xs">
          <span className="text-stone-500 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Lagos Delivery
          </span>
          <span className="font-medium">White-glove assembly included</span>
        </div>
      </div>

      {/* Finish Selector */}
      <div className="space-y-2">
        <div className="text-xs font-semibold">Finish &amp; Upholstery</div>
        <div className="flex flex-wrap gap-2">
          {item.finishOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFinish(opt)}
              className={`min-h-[40px] px-3.5 rounded-xl text-xs font-medium border transition-colors ${
                finish === opt
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                  : 'bg-white dark:bg-[#1B1815] border-stone-200 dark:border-stone-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Order Option */}
      <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-3">
        <button
          type="button"
          onClick={() => setCustomOrder(!customOrder)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B45309]" />
            <div>
              <div className="text-xs font-semibold">Custom Dimensions or Fabric</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                Built to order in our Ogun / Lagos atelier
              </div>
            </div>
          </div>
          <span
            className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
              customOrder ? 'bg-[#B45309]' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                customOrder ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </span>
        </button>

        {customOrder && (
          <div className="space-y-2 pt-1">
            <input
              type="text"
              value={customDimensions}
              onChange={(e) => setCustomDimensions(e.target.value)}
              placeholder={`Custom width/depth (default ${item.dimensions})`}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:border-[#B45309]"
            />
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Wood stain, fabric swatch, or staircase notes"
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:border-[#B45309]"
            />
          </div>
        )}
      </div>

      {/* Primary Action */}
      <div className="grid grid-cols-1 gap-2.5">
        <button
          type="button"
          onClick={handleAdd}
          className="w-full min-h-[52px] rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Showroom Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>
                {customOrder ? t(language, 'customOrder') : t(language, 'addToCart')} ·{' '}
                {formatMoney(item.priceNgn, currency)}
              </span>
            </>
          )}
        </button>

        {stagedApartment && (
          <button
            type="button"
            onClick={() => navigate(`/apartments/${stagedApartment.id}`)}
            className="w-full min-h-[46px] rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <span>Experience this piece in {stagedApartment.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
