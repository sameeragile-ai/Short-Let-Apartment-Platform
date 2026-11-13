import React from 'react';
import { Coins, Globe, Moon, Sun, Type, WifiOff } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const SettingsScreen: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    theme,
    setTheme,
    textScale,
    setTextScale,
    isOffline,
    toggleOffline,
  } = useAppStore();

  return (
    <div className="space-y-4 pb-8">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Globe className="w-4 h-4 text-[#134E4A] dark:text-teal-400" />
          <span>Language</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`min-h-[44px] rounded-xl text-xs font-semibold border ${
              language === 'en'
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                : 'border-stone-200 dark:border-stone-700'
            }`}
          >
            English (Nigeria)
          </button>
          <button
            type="button"
            onClick={() => setLanguage('yo')}
            className={`min-h-[44px] rounded-xl text-xs font-semibold border ${
              language === 'yo'
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                : 'border-stone-200 dark:border-stone-700'
            }`}
          >
            Yorùbá
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Coins className="w-4 h-4 text-[#B45309]" />
          <span>Display Currency</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setCurrency('NGN')}
            className={`min-h-[44px] rounded-xl text-xs font-semibold border ${
              currency === 'NGN'
                ? 'bg-[#B45309] text-white border-[#B45309]'
                : 'border-stone-200 dark:border-stone-700'
            }`}
          >
            ₦ Nigerian Naira (NGN)
          </button>
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`min-h-[44px] rounded-xl text-xs font-semibold border ${
              currency === 'USD'
                ? 'bg-[#B45309] text-white border-[#B45309]'
                : 'border-stone-200 dark:border-stone-700'
            }`}
          >
            $ US Dollar (USD)
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>Appearance</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['light', 'dark', 'system'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setTheme(m)}
              className={`min-h-[42px] rounded-xl text-xs font-semibold capitalize border ${
                theme === m
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                  : 'border-stone-200 dark:border-stone-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Type className="w-4 h-4" />
          <span>Text Size Scale</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['normal', 'large'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTextScale(s)}
              className={`min-h-[42px] rounded-xl text-xs font-semibold capitalize border ${
                textScale === s
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                  : 'border-stone-200 dark:border-stone-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={toggleOffline}
        className="w-full p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center justify-between"
      >
        <span className="flex items-center gap-2 text-xs font-semibold">
          <WifiOff className="w-4 h-4 text-amber-600" />
          <span>Offline-First Mode</span>
        </span>
        <span className="text-xs font-semibold text-[#B45309]">
          {isOffline ? 'Active' : 'Online'}
        </span>
      </button>
    </div>
  );
};
