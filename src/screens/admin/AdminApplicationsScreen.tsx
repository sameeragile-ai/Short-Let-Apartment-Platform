import React from 'react';
import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatMoney } from '../../lib/format';

export const AdminApplicationsScreen: React.FC = () => {
  const { applications, currency, advanceApplicationStage, triggerPush } = useAppStore();

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h1 className="font-display text-xl font-semibold">Landlord Property Applications</h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Title verification, inspection dispatch, and showroom staging queue
        </p>
      </div>

      <div className="space-y-3">
        {applications.map((app) => {
          const isLive = app.stage === 'Live on Platform';
          return (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] font-mono-tabular text-stone-500">
                    {app.id} · {app.area} · {app.bedrooms} bed
                  </div>
                  <div className="font-display text-base font-semibold truncate mt-0.5">
                    {app.address}
                  </div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {app.ownerName} · {app.phone}
                  </div>
                </div>
                <span className="font-mono-tabular text-xs font-semibold text-[#B45309] shrink-0">
                  {formatMoney(app.estimatedMonthlyNgn, currency, true)}/mo
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-600 dark:text-stone-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck
                    className={`w-3.5 h-3.5 ${
                      app.kycVerified ? 'text-emerald-600' : 'text-amber-500'
                    }`}
                  />
                  {app.kycVerified ? 'KYC Verified' : 'KYC Pending'}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {app.documentsUploaded.length} doc(s)
                </span>
                <span>·</span>
                <span>{app.plan}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/70 dark:border-stone-800">
                <span className="text-xs font-semibold text-[#134E4A] dark:text-teal-400">
                  {app.stage}
                </span>
                {isLive ? (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Live
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      advanceApplicationStage(app.id);
                      triggerPush(
                        `Application ${app.id} Advanced`,
                        `${app.address} moved to next onboarding stage.`,
                        '/landlord/contribute',
                        'application'
                      );
                    }}
                    className="min-h-[36px] px-3 rounded-xl bg-[#B45309] text-white text-xs font-semibold flex items-center gap-1 active:scale-95"
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
