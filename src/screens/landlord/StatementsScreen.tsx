import React, { useState } from 'react';
import { Check, Download, FileSpreadsheet } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatMoney } from '../../lib/format';

export const StatementsScreen: React.FC = () => {
  const { payouts, currency, offlineQueue, syncOfflineQueue } = useAppStore();
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 1600);
  };

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="font-display text-xl font-semibold">Payouts &amp; Tax Statements</h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Settled automatically on the 5th of every month to your nominated Nigerian bank
        </p>
      </div>

      {offlineQueue.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between gap-2 text-xs">
          <span>{offlineQueue.length} offline change(s) pending sync</span>
          <button
            type="button"
            onClick={() => syncOfflineQueue()}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold"
          >
            Sync Now
          </button>
        </div>
      )}

      <div className="space-y-3">
        {payouts.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] font-mono-tabular text-stone-500">
                  {p.id} · {p.date}
                </div>
                <div className="font-display text-sm font-semibold mt-0.5">{p.propertyTitle}</div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {p.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/70 dark:border-stone-800 text-xs">
              <div>
                <div className="text-[10px] text-stone-500">Gross</div>
                <div className="font-mono-tabular font-medium">
                  {formatMoney(p.grossNgn, currency, true)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-stone-500">Mgmt (20%)</div>
                <div className="font-mono-tabular font-medium">
                  {formatMoney(p.managementFeeNgn, currency, true)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-stone-500">Net Paid</div>
                <div className="font-mono-tabular font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatMoney(p.netPayoutNgn, currency, true)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDownload(p.id)}
              className="w-full min-h-[40px] rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {downloadedId === p.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Statement PDF Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Statement ({p.bankAccount})</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/60 flex items-center gap-3 text-xs">
        <FileSpreadsheet className="w-5 h-5 text-[#134E4A] dark:text-teal-400 shrink-0" />
        <span className="text-stone-600 dark:text-stone-300">
          Annual WHT &amp; Lagos Land Use Charge summary ready for FY 2026 filing.
        </span>
      </div>
    </div>
  );
};
