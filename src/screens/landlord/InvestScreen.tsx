import React, { useState } from 'react';
import { Calculator, TrendingUp, Users } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatMoney } from '../../lib/format';
import { InvestmentOpportunity } from '../../types';
import { SafeImage } from '../../components/SafeImage';
import { BottomSheet } from '../../components/BottomSheet';
import { PaymentSheet } from '../../components/PaymentSheet';

export const InvestScreen: React.FC = () => {
  const { opportunities, myInvestments, investInOpportunity, currency, triggerPush } =
    useAppStore();

  const [selectedOpp, setSelectedOpp] = useState<InvestmentOpportunity | null>(null);
  const [investAmountNgn, setInvestAmountNgn] = useState(1000000);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const openOpp = (opp: InvestmentOpportunity) => {
    setSelectedOpp(opp);
    setInvestAmountNgn(Math.max(opp.minShareNgn, 1000000));
  };

  const annualReturnNgn = selectedOpp
    ? Math.round(investAmountNgn * (selectedOpp.projectedYieldPercent / 100))
    : 0;

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="font-display text-xl font-semibold">Co-Own Lagos Residences</h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Fractional shares from {formatMoney(500000, currency)} · Rental + furniture commission yields
        </p>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp) => {
          const myStake = myInvestments[opp.id] || 0;
          return (
            <article
              key={opp.id}
              onClick={() => openOpp(opp)}
              className="cursor-pointer rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 overflow-hidden active:scale-[0.99] transition-transform"
            >
              <div className="relative aspect-[16/9] bg-stone-200 dark:bg-stone-800">
                <SafeImage src={opp.image} alt={opp.title} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                  <div>
                    <div className="text-[11px] text-amber-300 font-medium">
                      {opp.area} · {opp.termMonths} months term
                    </div>
                    <h2 className="font-display text-base font-semibold">{opp.title}</h2>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-tabular text-base font-semibold text-amber-300">
                      {opp.projectedYieldPercent}%
                    </div>
                    <div className="text-[10px] opacity-85">projected p.a.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {opp.summary}
                </p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono-tabular">
                    <span>{opp.fundedPercent}% funded</span>
                    <span>Min {formatMoney(opp.minShareNgn, currency)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-[#134E4A] dark:bg-teal-500 rounded-full"
                      style={{ width: `${opp.fundedPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-1 text-stone-500">
                    <Users className="w-3.5 h-3.5" />
                    {opp.investorsCount} co-owners
                  </span>
                  {myStake > 0 ? (
                    <span className="font-mono-tabular font-semibold text-[#134E4A] dark:text-teal-400">
                      Your stake: {formatMoney(myStake, currency)}
                    </span>
                  ) : (
                    <span className="font-semibold text-[#B45309] flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Calculate Returns
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Opportunity Detail & Returns Calculator Sheet */}
      <BottomSheet
        open={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
        title={selectedOpp?.title}
        subtitle={
          selectedOpp
            ? `Total Valuation ${formatMoney(selectedOpp.totalValuationNgn, currency, true)} · ${selectedOpp.projectedYieldPercent}% Est. Yield`
            : ''
        }
      >
        {selectedOpp && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-[#B45309]" />
                  Returns Calculator
                </span>
                <span className="font-mono-tabular text-sm font-semibold text-[#B45309]">
                  {formatMoney(investAmountNgn, currency)}
                </span>
              </div>

              <input
                type="range"
                min={selectedOpp.minShareNgn}
                max={25000000}
                step={250000}
                value={investAmountNgn}
                onChange={(e) => setInvestAmountNgn(Number(e.target.value))}
                className="w-full accent-[#B45309]"
              />

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200 dark:border-stone-700">
                <div>
                  <div className="text-[11px] text-stone-500">Est. Annual Yield</div>
                  <div className="font-mono-tabular text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatMoney(annualReturnNgn, currency)}/yr
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-500">Est. Monthly Cashflow</div>
                  <div className="font-mono-tabular text-base font-semibold">
                    {formatMoney(Math.round(annualReturnNgn / 12), currency)}/mo
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPaymentOpen(true)}
              className="w-full min-h-[52px] rounded-2xl bg-[#B45309] text-white font-semibold text-sm shadow-md"
            >
              Purchase Fractional Share · {formatMoney(investAmountNgn, currency)}
            </button>
          </div>
        )}
      </BottomSheet>

      <PaymentSheet
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Co-Ownership Subscription"
        subtitle={selectedOpp?.title ?? ''}
        amountNgn={investAmountNgn}
        onSuccess={() => {
          if (!selectedOpp) return;
          investInOpportunity(selectedOpp.id, investAmountNgn);
          triggerPush(
            'Co-Ownership Certificate Issued',
            `Subscribed ${formatMoney(investAmountNgn, currency)} in ${selectedOpp.title}.`,
            '/landlord/invest',
            'payout'
          );
          setSelectedOpp(null);
        }}
      />
    </div>
  );
};
