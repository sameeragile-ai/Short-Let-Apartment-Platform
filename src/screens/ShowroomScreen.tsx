import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, ShoppingBag } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { FURNITURE_CATEGORIES } from '../lib/api';
import { formatMoney } from '../lib/format';
import { t } from '../i18n/translations';
import { FurnitureCategory } from '../types';
import { SafeImage } from '../components/SafeImage';
import { QrScannerModal } from '../components/QrScannerModal';

export const ShowroomScreen: React.FC = () => {
  const navigate = useNavigate();
  const { furniture, currency, language, addToCart, triggerPush } = useAppStore();

  const [category, setCategory] = useState<'All' | FurnitureCategory>('All');
  const [originFilter, setOriginFilter] = useState<'All' | 'Made in Nigeria' | 'Curated Import'>('All');
  const [search, setSearch] = useState('');
  const [qrOpen, setQrOpen] = useState(false);

  const filtered = useMemo(() => {
    return furniture.filter((item) => {
      const catOk = category === 'All' || item.category === category;
      const originOk = originFilter === 'All' || item.origin === originFilter;
      const q = search.trim().toLowerCase();
      const qOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q);
      return catOk && originOk && qOk;
    });
  }, [furniture, category, originFilter, search]);

  return (
    <div className="space-y-5 pb-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold">Live Furniture Showroom</h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            52 pieces staged across Lagos residences · Ready to order
          </p>
        </div>
        <button
          type="button"
          onClick={() => setQrOpen(true)}
          className="min-h-[44px] px-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold flex items-center gap-1.5 shrink-0 active:scale-95"
        >
          <QrCode className="w-4 h-4 text-amber-400 dark:text-[#B45309]" />
          <span>Scan QR</span>
        </button>
      </div>

      {/* Search & Origin Segmented Filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sofa, iroko bed, brass lamp, brand..."
            className="w-full min-h-[46px] pl-10 pr-3 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:border-[#B45309]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {FURNITURE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                category === cat
                  ? 'bg-[#B45309] text-white'
                  : 'bg-white dark:bg-[#1B1815] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {cat === 'All' ? t(language, 'allCategories') : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-stone-200/60 dark:bg-stone-800/70">
          {(['All', 'Made in Nigeria', 'Curated Import'] as const).map((orig) => (
            <button
              key={orig}
              type="button"
              onClick={() => setOriginFilter(orig)}
              className={`min-h-[34px] px-2 rounded-lg text-[11px] font-medium truncate transition-colors ${
                originFilter === orig
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {orig}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1B1815]">
          <p className="font-display text-base font-semibold">No pieces match this filter</p>
          <button
            type="button"
            onClick={() => {
              setCategory('All');
              setOriginFilter('All');
              setSearch('');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#B45309] text-white text-xs font-semibold"
          >
            Show All 52 Pieces
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {filtered.map((item) => (
            <article
              key={item.id}
              onClick={() => navigate(`/showroom/${item.id}`)}
              className="cursor-pointer rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200/80 dark:border-stone-800 overflow-hidden flex flex-col active:scale-[0.98] transition-transform"
            >
              <div className="aspect-[4/3] bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <SafeImage src={item.image} alt={item.name} />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                <div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                    {item.brand} · {item.availability}
                  </div>
                  <h3 className="font-display text-sm font-semibold leading-snug line-clamp-2 mt-0.5">
                    {item.name}
                  </h3>
                </div>
                <div className="flex items-center justify-between gap-1 pt-1">
                  <span className="font-mono-tabular text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {formatMoney(item.priceNgn, currency)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Quick add ${item.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        furnitureId: item.id,
                        quantity: 1,
                        finish: item.finishOptions[0],
                        isCustomOrder: false,
                      });
                      triggerPush('Added to Bag', `${item.name} added to your showroom bag.`, '/cart', 'order');
                    }}
                    className="min-h-[36px] min-w-[36px] rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#B45309] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <QrScannerModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        onScanFurnitureId={(fid) => navigate(`/showroom/${fid}`)}
      />
    </div>
  );
};
