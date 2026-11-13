import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Settings,
  ShieldCheck,
  Upload,
  UserCheck,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getInitials } from '../lib/format';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    userName,
    userPhone,
    role,
    setRole,
    kycVerified,
    verifyKyc,
    signOut,
  } = useAppStore();

  const [bvn, setBvn] = useState('22190483712');
  const [ninUploaded, setNinUploaded] = useState(kycVerified);

  return (
    <div className="space-y-5 pb-8">
      {/* Identity Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-[#134E4A] text-amber-200 font-display text-xl font-semibold flex items-center justify-center shrink-0">
          {getInitials(userName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg font-semibold truncate">{userName}</div>
          <div className="font-mono-tabular text-xs text-stone-500 dark:text-stone-400">
            {userPhone}
          </div>
          <div className="text-xs font-medium text-[#134E4A] dark:text-teal-400 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{kycVerified ? 'KYC & BVN Verified' : 'Verification Pending'}</span>
          </div>
        </div>
      </div>

      {/* Quick Role Switch */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-2.5">
        <div className="text-xs font-semibold">Switch Workspace Role</div>
        <div className="grid grid-cols-3 gap-2">
          {(['guest', 'landlord', 'admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                navigate(r === 'guest' ? '/' : r === 'landlord' ? '/landlord' : '/admin');
              }}
              className={`min-h-[42px] rounded-xl text-xs font-semibold capitalize border ${
                role === r
                  ? 'bg-[#B45309] text-white border-[#B45309]'
                  : 'border-stone-200 dark:border-stone-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KYC / BVN Verification Flow */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#B45309]" />
            <span>Nigerian KYC &amp; Landlord Verification</span>
          </div>
          {kycVerified && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] text-stone-500">BVN (Bank Verification Number)</label>
          <input
            type="text"
            value={bvn}
            onChange={(e) => setBvn(e.target.value)}
            maxLength={11}
            className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-mono-tabular text-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setNinUploaded(true)}
          className="w-full min-h-[44px] px-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-xs font-medium flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4 text-[#B45309]" />
          <span>{ninUploaded ? 'NIN / Passport Uploaded (Verified)' : 'Upload NIN Slip or Int’l Passport'}</span>
        </button>

        {!kycVerified && (
          <button
            type="button"
            onClick={verifyKyc}
            className="w-full min-h-[46px] rounded-xl bg-[#134E4A] text-white text-xs font-semibold"
          >
            Complete KYC Verification
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 divide-y divide-stone-200/70 dark:divide-stone-800">
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="w-full min-h-[52px] px-4 flex items-center justify-between text-sm font-medium"
        >
          <span className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-stone-500" />
            App Settings (Language, Currency, Theme)
          </span>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
        <button
          type="button"
          onClick={() => {
            setRole('landlord');
            navigate('/landlord/contribute');
          }}
          className="w-full min-h-[52px] px-4 flex items-center justify-between text-sm font-medium"
        >
          <span className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-stone-500" />
            Contribute a Lagos Property
          </span>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
        <button
          type="button"
          onClick={signOut}
          className="w-full min-h-[52px] px-4 flex items-center justify-between text-sm font-medium text-red-600 dark:text-red-400"
        >
          <span className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4" />
            Sign Out (Test OTP / Face ID Gate)
          </span>
        </button>
      </div>
    </div>
  );
};
