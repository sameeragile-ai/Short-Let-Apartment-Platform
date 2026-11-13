import React, { useState } from 'react';
import { CalendarOff, CheckCircle2, Edit3 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatMoney } from '../../lib/format';
import { Apartment } from '../../types';
import { BottomSheet } from '../../components/BottomSheet';

export const AdminListingsScreen: React.FC = () => {
  const {
    apartments,
    currency,
    approveApartment,
    updateApartmentPrice,
    toggleBlockDate,
    triggerPush,
  } = useAppStore();

  const [filter, setFilter] = useState<'All' | 'Pending Approval' | 'Active'>('All');
  const [editingApt, setEditingApt] = useState<Apartment | null>(null);
  const [draftRate, setDraftRate] = useState('');

  const filtered = apartments.filter((a) => filter === 'All' || a.status === filter);

  const openEditor = (apt: Apartment) => {
    setEditingApt(apt);
    setDraftRate(String(apt.nightlyRateNgn));
  };

  const handleSaveRate = () => {
    if (!editingApt) return;
    const numeric = Number(draftRate);
    if (!Number.isNaN(numeric) && numeric >= 25000) {
      updateApartmentPrice(editingApt.id, numeric);
      triggerPush(
        'Nightly Rate Updated',
        `${editingApt.name} set to ${formatMoney(numeric, currency)}/night.`,
        '/admin/listings',
        'booking'
      );
    }
    setEditingApt(null);
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-stone-200/70 dark:bg-stone-800/80">
        {(['All', 'Pending Approval', 'Active'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`min-h-[38px] px-2 rounded-lg text-[11px] font-semibold truncate ${
              filter === f
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[11px] text-stone-500">
                  {apt.area} · {apt.bedrooms} bed · {apt.status}
                </div>
                <div className="font-display text-sm font-semibold truncate mt-0.5">
                  {apt.name}
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-[#B45309] shrink-0">
                {formatMoney(apt.nightlyRateNgn, currency)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {apt.status === 'Pending Approval' && (
                <button
                  type="button"
                  onClick={() => approveApartment(apt.id)}
                  className="min-h-[36px] px-3 rounded-xl bg-[#134E4A] text-white text-xs font-semibold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => openEditor(apt)}
                className="min-h-[36px] px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Price &amp; Dates</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomSheet
        open={Boolean(editingApt)}
        onClose={() => setEditingApt(null)}
        title={editingApt?.name}
        subtitle="Update nightly rate (NGN) or block maintenance dates"
      >
        {editingApt && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Nightly Rate (₦ NGN)</label>
              <input
                type="number"
                value={draftRate}
                onChange={(e) => setDraftRate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-mono-tabular text-sm"
              />
            </div>

            <div>
              <div className="text-xs font-semibold flex items-center gap-1.5 mb-2">
                <CalendarOff className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Block / Unblock Dates</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['2026-11-23', '2026-11-24', '2026-11-25'].map((d) => {
                  const currentApt = apartments.find((a) => a.id === editingApt.id) ?? editingApt;
                  const blocked = currentApt.blockedDates.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleBlockDate(editingApt.id, d)}
                      className={`min-h-[38px] rounded-xl font-mono-tabular text-[11px] font-medium border ${
                        blocked
                          ? 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-700 dark:text-red-300'
                          : 'border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {d.slice(5)} {blocked ? '(Blocked)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveRate}
              className="w-full min-h-[48px] rounded-2xl bg-[#B45309] text-white font-semibold text-sm"
            >
              Save Changes
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
