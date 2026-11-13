import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Heart, Package, Trash2, Truck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../lib/format';
import { SafeImage } from '../components/SafeImage';

export const OrdersScreen: React.FC = () => {
  const navigate = useNavigate();
  const { orders, furniture, apartments, wishlistIds, toggleWishlist, currency } = useAppStore();
  const [tab, setTab] = useState<'orders' | 'wishlist'>('orders');

  const savedApartments = apartments.filter((a) => wishlistIds.includes(a.id));
  const savedFurniture = furniture.filter((f) => wishlistIds.includes(f.id));

  return (
    <div className="space-y-5 pb-8">
      <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-stone-200/70 dark:bg-stone-800/80">
        <button
          type="button"
          onClick={() => setTab('orders')}
          className={`min-h-[42px] rounded-xl text-xs font-semibold transition-colors ${
            tab === 'orders'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Furniture Orders ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('wishlist')}
          className={`min-h-[42px] rounded-xl text-xs font-semibold transition-colors ${
            tab === 'wishlist'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Wishlist ({savedApartments.length + savedFurniture.length})
        </button>
      </div>

      {tab === 'orders' ? (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] font-mono-tabular text-stone-500 dark:text-stone-400">
                    {ord.id} · {ord.isCustom ? 'Custom Atelier Order' : 'Showroom Stock'}
                  </div>
                  <h3 className="font-display text-base font-semibold truncate mt-0.5">
                    {ord.itemsSummary}
                  </h3>
                </div>
                <span className="font-mono-tabular text-xs font-semibold text-[#B45309] shrink-0">
                  {formatMoney(ord.totalNgn, currency)}
                </span>
              </div>

              <div className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#134E4A] dark:text-teal-400 shrink-0" />
                <span className="truncate">
                  {ord.stage} · ETA {ord.estimatedDelivery}
                </span>
              </div>

              {/* 5-Stage Fulfillment Timeline */}
              <div className="pt-2 border-t border-stone-200/70 dark:border-stone-800 space-y-2">
                {ord.timeline.map((step) => (
                  <div key={step.stage} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-[#134E4A] text-white'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                        }`}
                      >
                        {step.completed ? (
                          <Check className="w-2.5 h-2.5" />
                        ) : (
                          <Package className="w-2.5 h-2.5" />
                        )}
                      </span>
                      <span
                        className={
                          step.completed
                            ? 'font-medium text-stone-900 dark:text-stone-100'
                            : 'text-stone-400 dark:text-stone-500'
                        }
                      >
                        {step.stage}
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[11px] text-stone-500">
                      {step.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {savedApartments.length === 0 && savedFurniture.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1B1815]">
              <Heart className="w-7 h-7 mx-auto text-stone-400 mb-2" />
              <p className="font-display text-base font-semibold">Nothing saved yet</p>
              <p className="text-xs text-stone-500 mt-1">
                Tap the heart icon on any residence or furniture piece.
              </p>
            </div>
          ) : (
            <>
              {savedApartments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => navigate(`/apartments/${apt.id}`)}
                  className="cursor-pointer p-3 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <SafeImage src={apt.images[0]} alt={apt.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-stone-500">Residence · {apt.area}</div>
                    <div className="font-display text-sm font-semibold truncate">{apt.name}</div>
                    <div className="font-mono-tabular text-xs font-semibold text-[#B45309]">
                      {formatMoney(apt.nightlyRateNgn, currency)} / night
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove from wishlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(apt.id);
                    }}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {savedFurniture.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/showroom/${item.id}`)}
                  className="cursor-pointer p-3 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <SafeImage src={item.image} alt={item.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-stone-500">Showroom · {item.brand}</div>
                    <div className="font-display text-sm font-semibold truncate">{item.name}</div>
                    <div className="font-mono-tabular text-xs font-semibold text-[#B45309]">
                      {formatMoney(item.priceNgn, currency)}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove from wishlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
