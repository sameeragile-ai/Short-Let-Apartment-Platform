import React from 'react';
import {
  AlertTriangle,
  Bell,
  Building2,
  Coins,
  Globe,
  Moon,
  PlusCircle,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Sun,
  User,
  WifiOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';

interface DemoControlPanelProps {
  onTriggerQrScan: () => void;
  compact?: boolean;
  onCloseSheet?: () => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  onTriggerQrScan,
  compact = false,
  onCloseSheet,
}) => {
  const navigate = useNavigate();
  const {
    role,
    setRole,
    language,
    setLanguage,
    currency,
    setCurrency,
    theme,
    setTheme,
    isOffline,
    toggleOffline,
    simulateError,
    setSimulateError,
    triggerPush,
    simulateNewLandlordBooking,
    resetDemoData,
  } = useAppStore();

  const handleRoleSwitch = (nextRole: UserRole) => {
    setRole(nextRole);
    if (nextRole === 'guest') navigate('/');
    if (nextRole === 'landlord') navigate('/landlord');
    if (nextRole === 'admin') navigate('/admin');
    onCloseSheet?.();
  };

  return (
    <div className="space-y-4">
      {/* Role Switcher */}
      <div>
        <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-2">
          Active Role
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/70">
          {(
            [
              { id: 'guest', label: 'Guest', icon: User },
              { id: 'landlord', label: 'Landlord', icon: Building2 },
              { id: 'admin', label: 'Admin', icon: ShieldCheck },
            ] as const
          ).map((r) => {
            const Icon = r.icon;
            const active = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleSwitch(r.id)}
                className={`min-h-[38px] px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  active
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Environment Toggles */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'yo' : 'en')}
          className="min-h-[40px] px-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-medium flex items-center justify-center gap-1.5 hover:border-stone-400 active:scale-95 transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-[#134E4A] dark:text-teal-400" />
          <span>{language === 'en' ? 'EN → YO' : 'YO → EN'}</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrency(currency === 'NGN' ? 'USD' : 'NGN')}
          className="min-h-[40px] px-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-medium flex items-center justify-center gap-1.5 hover:border-stone-400 active:scale-95 transition-all"
        >
          <Coins className="w-3.5 h-3.5 text-[#B45309]" />
          <span>{currency === 'NGN' ? '₦ NGN' : '$ USD'}</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="min-h-[40px] px-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-medium flex items-center justify-center gap-1.5 hover:border-stone-400 active:scale-95 transition-all"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-stone-700" />
              <span>Dark</span>
            </>
          )}
        </button>
      </div>

      {/* Live Demo Triggers */}
      <div>
        <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-2">
          Live Walkthrough Moments
        </div>
        <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          <button
            type="button"
            onClick={() => {
              triggerPush(
                'Payout Settled · GTBank',
                'Payout received ₦1,240,000 for Ikoyi Unit 14B.',
                '/landlord/statements',
                'payout'
              );
              onCloseSheet?.();
            }}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] font-medium text-left flex items-center gap-2 hover:border-[#134E4A] active:scale-[0.98] transition-all"
          >
            <Bell className="w-3.5 h-3.5 shrink-0 text-[#134E4A] dark:text-teal-400" />
            <span className="truncate">Push: Payout ₦1,240,000</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerPush(
                'White-Glove Dispatch',
                'Your sofa is out for delivery to Lekki Phase 1.',
                '/orders',
                'order'
              );
              onCloseSheet?.();
            }}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] font-medium text-left flex items-center gap-2 hover:border-[#B45309] active:scale-[0.98] transition-all"
          >
            <Bell className="w-3.5 h-3.5 shrink-0 text-[#B45309]" />
            <span className="truncate">Push: Sofa Out for Delivery</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('landlord');
              navigate('/landlord');
              setTimeout(() => simulateNewLandlordBooking(), 120);
              onCloseSheet?.();
            }}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] font-medium text-left flex items-center gap-2 hover:border-[#B45309] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span className="truncate">Simulate Landlord Booking</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onCloseSheet?.();
              onTriggerQrScan();
            }}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] font-medium text-left flex items-center gap-2 hover:border-[#B45309] active:scale-[0.98] transition-all"
          >
            <QrCode className="w-3.5 h-3.5 shrink-0 text-[#B45309]" />
            <span className="truncate">Simulate Room QR Scan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSimulateError(!simulateError);
              onCloseSheet?.();
            }}
            className={`min-h-[40px] px-3 py-2 rounded-xl border text-[11px] font-medium text-left flex items-center gap-2 active:scale-[0.98] transition-all ${
              simulateError
                ? 'bg-red-50 dark:bg-red-950/50 border-red-400 text-red-700 dark:text-red-300'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500" />
            <span className="truncate">
              {simulateError ? 'Payment Fault: ON' : 'Simulate Payment Failure'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleOffline();
              onCloseSheet?.();
            }}
            className={`min-h-[40px] px-3 py-2 rounded-xl border text-[11px] font-medium text-left flex items-center gap-2 active:scale-[0.98] transition-all ${
              isOffline
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-800 dark:text-amber-300'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span className="truncate">{isOffline ? 'Go Online (Sync)' : 'Go Offline'}</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          resetDemoData();
          navigate('/');
          onCloseSheet?.();
        }}
        className="w-full min-h-[38px] px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Demo Data</span>
      </button>
    </div>
  );
};
