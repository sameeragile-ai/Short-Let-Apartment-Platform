import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Building2, ClipboardList, Hammer, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatMoney } from '../../lib/format';
import { CountUpNumber } from '../../components/CountUpNumber';

export const AdminOverviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { apartments, bookings, orders, applications, housekeeping, currency } =
    useAppStore();

  const totalBookingGmv = bookings.reduce((s, b) => s + b.totalNgn, 0);
  const totalFurnitureGmv = orders.reduce((s, o) => s + o.totalNgn, 0);
  const activeStays = bookings.filter((b) => b.status === 'Active').length;
  const pendingApps = applications.filter((a) => a.stage !== 'Live on Platform').length;

  const areaStats = ['Ikoyi', 'VI', 'Lekki', 'Banana', 'Ikeja', 'Yaba'].map((short, idx) => {
    const fullNames = [
      'Ikoyi',
      'Victoria Island',
      'Lekki Phase 1',
      'Banana Island',
      'Ikeja GRA',
      'Yaba',
    ];
    const count = apartments.filter((a) => a.area === fullNames[idx]).length;
    return { area: short, units: count };
  });

  return (
    <div className="space-y-5 pb-8">
      {/* Platform KPI Strip */}
      <section className="rounded-3xl bg-stone-900 dark:bg-[#1B1815] text-white p-5 space-y-4 border border-stone-800">
        <div>
          <div className="text-xs text-stone-400">Combined Platform GMV (Nov)</div>
          <div className="font-mono-tabular text-3xl font-semibold mt-1">
            <CountUpNumber
              value={totalBookingGmv + totalFurnitureGmv}
              formatter={(v) => formatMoney(v, currency, true)}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-xs">
          <div>
            <div className="text-[10px] text-stone-400">Active Stays</div>
            <div className="font-mono-tabular text-base font-semibold mt-0.5">
              {activeStays}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-400">Showroom Orders</div>
            <div className="font-mono-tabular text-base font-semibold mt-0.5 text-amber-400">
              {orders.length}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-400">Pending Units</div>
            <div className="font-mono-tabular text-base font-semibold mt-0.5">
              {pendingApps}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Ops Navigation */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/pipeline')}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-left space-y-1 active:scale-[0.98]"
        >
          <Hammer className="w-4 h-4 text-[#B45309]" />
          <div className="font-display text-sm font-semibold">Furniture Pipeline</div>
          <div className="text-[11px] text-stone-500">{orders.length} active orders</div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/admin/applications')}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-left space-y-1 active:scale-[0.98]"
        >
          <ClipboardList className="w-4 h-4 text-[#134E4A] dark:text-teal-400" />
          <div className="font-display text-sm font-semibold">Landlord Intake</div>
          <div className="text-[11px] text-stone-500">{pendingApps} to review</div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/admin/listings')}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-left space-y-1 active:scale-[0.98]"
        >
          <Building2 className="w-4 h-4 text-[#134E4A] dark:text-teal-400" />
          <div className="font-display text-sm font-semibold">Listings &amp; Pricing</div>
          <div className="text-[11px] text-stone-500">{apartments.length} units</div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/admin/operations')}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-left space-y-1 active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-[#B45309]" />
          <div className="font-display text-sm font-semibold">Housekeeping</div>
          <div className="text-[11px] text-stone-500">{housekeeping.length} tasks today</div>
        </button>
      </div>

      {/* Units by Lagos Zone Chart */}
      <section className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold">Inventory by Lagos Zone</h2>
          <span className="text-xs text-stone-500 font-mono-tabular">
            {apartments.length} residences
          </span>
        </div>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={areaStats}>
              <XAxis dataKey="area" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="units" fill="#B45309" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Bookings Overview */}
      <section className="space-y-2.5">
        <h2 className="font-display text-base font-semibold">Recent Guest Bookings</h2>
        <div className="space-y-2">
          {bookings.slice(0, 6).map((bk) => (
            <div
              key={bk.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-[11px] text-stone-500">
                  {bk.id} · {bk.status} · {bk.guestName}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">{bk.apartmentName}</div>
              </div>
              <span className="font-mono-tabular text-xs font-semibold shrink-0">
                {formatMoney(bk.totalNgn, currency, true)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
