import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowUpRight, Building2, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatMoney, NGN_PER_USD } from '../../lib/format';
import { t } from '../../i18n/translations';
import { CountUpNumber } from '../../components/CountUpNumber';

export const LandlordPortfolioScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    apartments,
    monthlyPerformance,
    payouts,
    myInvestments,
    currency,
    language,
  } = useAppStore();

  const myUnits = apartments.filter((a) => a.landlordId === 'll-1');
  const latestMonth = monthlyPerformance[monthlyPerformance.length - 1];
  const investedExtra = Object.values(myInvestments).reduce((s, v) => s + v, 0);
  const portfolioValueNgn = myUnits.length * 295000000 + investedExtra;

  const avgOccupancy = Math.round(
    myUnits.reduce((s, u) => s + u.occupancyPercent, 0) / Math.max(1, myUnits.length)
  );
  const avgAdr = Math.round(
    myUnits.reduce((s, u) => s + u.nightlyRateNgn, 0) / Math.max(1, myUnits.length)
  );

  const chartData = monthlyPerformance.map((m) => ({
    month: m.month,
    revenue: currency === 'USD' ? Math.round(m.revenueNgn / NGN_PER_USD) : Math.round(m.revenueNgn / 1000000),
    occupancy: m.occupancyPercent,
  }));

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Portfolio Value Hero */}
      <section className="rounded-3xl bg-[#134E4A] text-[#FAF8F5] p-5 space-y-4 shadow-md">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs text-teal-200">{t(language, 'portfolioValue')}</div>
            <div className="font-mono-tabular text-3xl font-semibold mt-1">
              <CountUpNumber
                value={portfolioValueNgn}
                formatter={(v) => formatMoney(v, currency)}
              />
            </div>
            <div className="text-[11px] text-teal-100/80 mt-1">
              {myUnits.length} managed Lagos units · +18.4% annual net yield
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/landlord/contribute')}
            className="min-h-[40px] px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-semibold flex items-center gap-1 shrink-0 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Unit</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15">
          <div>
            <div className="text-[10px] text-teal-200">{t(language, 'monthlyPayout')}</div>
            <div className="font-mono-tabular text-sm font-semibold mt-0.5">
              <CountUpNumber
                value={latestMonth.payoutNgn}
                formatter={(v) => formatMoney(v, currency, true)}
              />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-teal-200">{t(language, 'occupancyRate')}</div>
            <div className="font-mono-tabular text-sm font-semibold mt-0.5">
              <CountUpNumber value={latestMonth.occupancyPercent} formatter={(v) => `${v}%`} />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-teal-200">{t(language, 'avgDailyRate')}</div>
            <div className="font-mono-tabular text-sm font-semibold mt-0.5">
              <CountUpNumber value={avgAdr} formatter={(v) => formatMoney(v, currency, true)} />
            </div>
          </div>
        </div>
      </section>

      {/* Revenue & Occupancy Chart */}
      <section className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-base font-semibold">
              {t(language, 'revenueHistory')}
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {currency === 'NGN' ? 'Gross revenue (₦ Millions)' : 'Gross revenue ($ USD)'} · Avg occupancy {avgOccupancy}%
            </p>
          </div>
          <span className="font-mono-tabular text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            +14.2% YoY
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B45309" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#B45309" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(0,0,0,0.08)',
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#B45309"
                strokeWidth={2.2}
                fill="url(#revFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate('/landlord/contribute')}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-left space-y-1 active:scale-[0.98]"
        >
          <Building2 className="w-4 h-4 text-[#B45309]" />
          <div className="font-display text-sm font-semibold">Contribute Property</div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            Valuation &amp; staging
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/landlord/invest')}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-left space-y-1 active:scale-[0.98]"
        >
          <ArrowUpRight className="w-4 h-4 text-[#134E4A] dark:text-teal-400" />
          <div className="font-display text-sm font-semibold">Co-Own Units</div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            From {formatMoney(500000, currency)}
          </div>
        </button>
      </div>

      {/* Recent Payouts */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold">
            {t(language, 'payoutHistory')}
          </h2>
          <button
            type="button"
            onClick={() => navigate('/landlord/statements')}
            className="text-xs font-semibold text-[#B45309]"
          >
            All Statements
          </button>
        </div>

        <div className="space-y-2">
          {payouts.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  {p.date} · {p.bankAccount}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">{p.propertyTitle}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono-tabular text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {formatMoney(p.netPayoutNgn, currency)}
                </div>
                <div className="text-[10px] text-stone-500">{p.status}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
