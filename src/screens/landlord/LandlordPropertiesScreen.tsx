import React, { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Building2, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatMoney } from '../../lib/format';
import { Apartment } from '../../types';
import { SafeImage } from '../../components/SafeImage';
import { BottomSheet } from '../../components/BottomSheet';

export const LandlordPropertiesScreen: React.FC = () => {
  const { apartments, currency } = useAppStore();
  const [selectedUnit, setSelectedUnit] = useState<Apartment | null>(null);

  const units = apartments.slice(0, 8);

  const unitWeeklyData = selectedUnit
    ? [
        { wk: 'W1', rev: Math.round((selectedUnit.monthlyRevenueNgn * 0.22) / 1000) },
        { wk: 'W2', rev: Math.round((selectedUnit.monthlyRevenueNgn * 0.26) / 1000) },
        { wk: 'W3', rev: Math.round((selectedUnit.monthlyRevenueNgn * 0.24) / 1000) },
        { wk: 'W4', rev: Math.round((selectedUnit.monthlyRevenueNgn * 0.28) / 1000) },
      ]
    : [];

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h1 className="font-display text-xl font-semibold">Managed Portfolio Units</h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Live occupancy, nightly ADR, and showroom furniture commission per unit
        </p>
      </div>

      <div className="space-y-3">
        {units.map((unit) => (
          <button
            key={unit.id}
            type="button"
            onClick={() => setSelectedUnit(unit)}
            className="w-full p-3 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center gap-3 text-left active:scale-[0.99]"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <SafeImage src={unit.images[0]} alt={unit.name} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                {unit.area} · {unit.bedrooms} bed · {unit.occupancyPercent}% occupied
              </div>
              <div className="font-display text-sm font-semibold truncate">{unit.name}</div>
              <div className="flex items-center gap-2 mt-1 text-xs font-mono-tabular">
                <span className="font-semibold text-[#B45309]">
                  {formatMoney(unit.monthlyRevenueNgn, currency, true)}/mo
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-500">
                  ADR {formatMoney(unit.nightlyRateNgn, currency, true)}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
          </button>
        ))}
      </div>

      <BottomSheet
        open={Boolean(selectedUnit)}
        onClose={() => setSelectedUnit(null)}
        title={selectedUnit?.name}
        subtitle={selectedUnit ? `${selectedUnit.address} · ${selectedUnit.status}` : ''}
      >
        {selectedUnit && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60">
                <div className="text-[10px] text-stone-500">Occupancy</div>
                <div className="font-mono-tabular text-base font-semibold mt-0.5">
                  {selectedUnit.occupancyPercent}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60">
                <div className="text-[10px] text-stone-500">ADR</div>
                <div className="font-mono-tabular text-base font-semibold mt-0.5">
                  {formatMoney(selectedUnit.nightlyRateNgn, currency, true)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60">
                <div className="text-[10px] text-stone-500">Monthly Gross</div>
                <div className="font-mono-tabular text-base font-semibold mt-0.5 text-emerald-600">
                  {formatMoney(selectedUnit.monthlyRevenueNgn, currency, true)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Weekly Revenue Trend (₦k)</span>
              </div>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={unitWeeklyData}>
                    <XAxis dataKey="wk" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="rev" fill="#134E4A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
              <span className="font-semibold">Showroom Commission Bonus:</span> Guests purchased 3 furniture pieces staged in this unit this quarter (+{formatMoney(285000, currency)} bonus).
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
