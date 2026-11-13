import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../lib/format';
import { SafeImage } from '../components/SafeImage';
import { PaymentSheet } from '../components/PaymentSheet';

export const CartScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    furniture,
    currency,
    updateCartQty,
    removeFromCart,
    placeFurnitureOrder,
    triggerPush,
    userName,
  } = useAppStore();

  const [address, setAddress] = useState('14 Bourdillon Road, Old Ikoyi, Lagos');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const enriched = cart
    .map((c) => ({
      cart: c,
      product: furniture.find((f) => f.id === c.furnitureId),
    }))
    .filter((x) => Boolean(x.product));

  const subtotal = enriched.reduce(
    (sum, x) => sum + (x.product?.priceNgn ?? 0) * x.cart.quantity,
    0
  );
  const deliveryFee = enriched.length > 0 ? 45000 : 0;
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + deliveryFee + vat;

  const handleOrderPaid = () => {
    const order = placeFurnitureOrder(address, userName);
    triggerPush(
      `Order ${order.id} Confirmed`,
      `Workshop production & white-glove delivery scheduled.`,
      '/orders',
      'order'
    );
    navigate('/orders');
  };

  if (enriched.length === 0) {
    return (
      <div className="py-16 px-4 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-500">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="font-display text-xl font-semibold">Your Showroom Bag is Empty</h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[240px] mx-auto">
          Tap any hotspot inside an apartment photo or browse our 52 curated Lagos showroom pieces.
        </p>
        <button
          type="button"
          onClick={() => navigate('/showroom')}
          className="min-h-[48px] px-6 rounded-2xl bg-[#B45309] text-white text-xs font-semibold"
        >
          Explore Showroom
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <div className="space-y-3">
        {enriched.map(({ cart: c, product }) =>
          product ? (
            <div
              key={c.id}
              className="p-3 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex gap-3"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
                <SafeImage src={product.image} alt={product.name} />
              </div>
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-sm font-semibold truncate">{product.name}</h3>
                    <button
                      type="button"
                      onClick={() => removeFromCart(c.id)}
                      aria-label="Remove item"
                      className="text-stone-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {c.finish} {c.isCustomOrder ? '· Custom Made-to-Order' : '· In Stock'}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-mono-tabular text-xs font-semibold">
                    {formatMoney(product.priceNgn * c.quantity, currency)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateCartQty(c.id, -1)}
                      className="w-7 h-7 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono-tabular text-xs font-semibold w-4 text-center">
                      {c.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(c.id, 1)}
                      className="w-7 h-7 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Lagos Delivery Address */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-2">
        <label className="text-xs font-semibold flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
          <span>Lagos Delivery &amp; Installation Address</span>
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:border-[#B45309]"
        />
      </div>

      {/* Totals */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
        <div className="flex justify-between text-stone-600 dark:text-stone-400">
          <span>Furniture Subtotal</span>
          <span className="font-mono-tabular">{formatMoney(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between text-stone-600 dark:text-stone-400">
          <span>White-Glove Lagos Delivery</span>
          <span className="font-mono-tabular">{formatMoney(deliveryFee, currency)}</span>
        </div>
        <div className="flex justify-between text-stone-600 dark:text-stone-400">
          <span>VAT (7.5%)</span>
          <span className="font-mono-tabular">{formatMoney(vat, currency)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-stone-800 text-sm font-semibold">
          <span>Total Due</span>
          <span className="font-mono-tabular">{formatMoney(total, currency)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCheckoutOpen(true)}
        className="w-full min-h-[52px] rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white font-semibold text-sm shadow-md active:scale-[0.98]"
      >
        Proceed to Checkout · {formatMoney(total, currency)}
      </button>

      <PaymentSheet
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title="Showroom Checkout"
        subtitle={`${enriched.length} item(s) · White-glove Lagos delivery`}
        amountNgn={total}
        onSuccess={handleOrderPaid}
      />
    </div>
  );
};
