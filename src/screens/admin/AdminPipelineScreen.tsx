import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatMoney } from '../../lib/format';
import { OrderStage } from '../../types';

const STAGES: OrderStage[] = [
  'Order placed',
  'In workshop',
  'Quality check',
  'Out for delivery',
  'Installed',
];

export const AdminPipelineScreen: React.FC = () => {
  const { orders, currency, advanceOrderStage, triggerPush } = useAppStore();
  const [stageFilter, setStageFilter] = useState<'All' | OrderStage>('All');

  const filtered = orders.filter((o) => stageFilter === 'All' || o.stage === stageFilter);

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h1 className="font-display text-xl font-semibold">Furniture Orders Pipeline</h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Workshop production, quality assurance, and white-glove Lagos installation
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(['All', ...STAGES] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStageFilter(st)}
            className={`min-h-[38px] px-3 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 ${
              stageFilter === st
                ? 'bg-[#B45309] text-white'
                : 'bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((ord) => {
          const isFinal = ord.stage === 'Installed';
          const stageIdx = STAGES.indexOf(ord.stage);
          return (
            <div
              key={ord.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] font-mono-tabular text-stone-500">
                    {ord.id} · {ord.customerName}
                  </div>
                  <div className="font-display text-sm font-semibold truncate mt-0.5">
                    {ord.itemsSummary}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate mt-0.5">
                    {ord.deliveryAddress}
                  </div>
                </div>
                <span className="font-mono-tabular text-xs font-semibold text-[#B45309] shrink-0">
                  {formatMoney(ord.totalNgn, currency)}
                </span>
              </div>

              {/* 5-segment progress */}
              <div className="grid grid-cols-5 gap-1">
                {STAGES.map((st, idx) => (
                  <div
                    key={st}
                    className={`h-1.5 rounded-full ${
                      idx <= stageIdx ? 'bg-[#134E4A] dark:bg-teal-500' : 'bg-stone-200 dark:bg-stone-800'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-[#134E4A] dark:text-teal-400">
                  {ord.stage}
                </span>
                {isFinal ? (
                  <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      advanceOrderStage(ord.id);
                      triggerPush(
                        `Order ${ord.id} Updated`,
                        `Moved to ${STAGES[Math.min(4, stageIdx + 1)]}.`,
                        '/orders',
                        'order'
                      );
                    }}
                    className="min-h-[36px] px-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold flex items-center gap-1 active:scale-95"
                  >
                    <span>Advance Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
