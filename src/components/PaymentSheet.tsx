import React, { useState } from 'react';
import { AlertCircle, Building2, CheckCircle2, Copy, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../lib/format';
import { simulatedRequest } from '../lib/api';
import { BottomSheet } from './BottomSheet';

interface PaymentSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  amountNgn: number;
  onSuccess: (method: 'Card' | 'Bank Transfer' | 'Paystack') => void;
}

export const PaymentSheet: React.FC<PaymentSheetProps> = ({
  open,
  onClose,
  title,
  subtitle,
  amountNgn,
  onSuccess,
}) => {
  const { currency, simulateError, setSimulateError } = useAppStore();
  const [method, setMethod] = useState<'Paystack' | 'Card' | 'Bank Transfer'>('Paystack');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    setErrorMsg(null);
    try {
      await simulatedRequest({ ok: true }, simulateError, 600);
      setPaid(true);
      setTimeout(() => {
        onSuccess(method);
        setPaid(false);
        onClose();
      }, 950);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Payment declined. Please retry.');
    } finally {
      setProcessing(false);
    }
  };

  const copyAccount = () => {
    navigator.clipboard?.writeText('9920481124').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={title} subtitle={subtitle}>
      {paid ? (
        <div className="py-8 flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-display text-xl font-semibold">Payment Confirmed</h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[240px]">
            Receipt & smart credentials issued for {formatMoney(amountNgn, currency)}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <div className="text-xs text-stone-500 dark:text-stone-400">Amount Due</div>
              <div className="font-mono-tabular text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                {formatMoney(amountNgn, currency)}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-[#134E4A] dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Escrow Protected</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['Paystack', 'Card', 'Bank Transfer'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  method === m
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {method === 'Bank Transfer' ? (
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-200">
                <Building2 className="w-4 h-4 text-[#B45309]" />
                <span>Providus Bank · Ilé & Form Escrow</span>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-stone-900 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="font-mono-tabular text-base font-semibold tracking-wider">
                  9920481124
                </span>
                <button
                  type="button"
                  onClick={copyAccount}
                  className="flex items-center gap-1 text-xs font-semibold text-[#B45309]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Transfers clear automatically within 15 seconds via NIP.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-md bg-stone-900 text-white flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">GTBank Mastercard •••• 4821</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    Expires 09/28 · {method}
                  </div>
                </div>
              </div>
              <Lock className="w-4 h-4 text-stone-400" />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{errorMsg}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSimulateError(false);
                    setErrorMsg(null);
                  }}
                  className="mt-1 underline font-semibold"
                >
                  Clear network fault & retry
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={processing}
            onClick={handlePay}
            className="w-full min-h-[52px] rounded-2xl bg-[#B45309] hover:bg-[#92400E] disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
          >
            {processing ? (
              <span>Authorizing {method}...</span>
            ) : (
              <span>
                {method === 'Bank Transfer' ? 'I Have Sent Transfer' : `Pay ${formatMoney(amountNgn, currency)}`}
              </span>
            )}
          </button>
        </div>
      )}
    </BottomSheet>
  );
};
