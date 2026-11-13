import { Currency } from '../types';

export const NGN_PER_USD = 1600;

export function formatMoney(amountNgn: number, currency: Currency, compact = false): string {
  const value = currency === 'USD' ? amountNgn / NGN_PER_USD : amountNgn;
  if (compact) {
    if (currency === 'NGN') {
      if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000) return `₦${Math.round(value / 1_000)}k`;
      return `₦${Math.round(value).toLocaleString('en-NG')}`;
    } else {
      if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
      return `$${Math.round(value).toLocaleString('en-US')}`;
    }
  }

  if (currency === 'USD') {
    return `$${Math.round(value).toLocaleString('en-US')}`;
  }
  return `₦${Math.round(value).toLocaleString('en-NG')}`;
}

export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
