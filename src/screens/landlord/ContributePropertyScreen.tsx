import React, { useMemo, useState } from 'react';
import { Camera, CheckCircle2, FileText, PenTool, Upload } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { estimatePropertyValuation, LAGOS_AREAS } from '../../lib/api';
import { formatMoney } from '../../lib/format';
import { LagosArea } from '../../types';

export const ContributePropertyScreen: React.FC = () => {
  const {
    currency,
    userName,
    userPhone,
    applications,
    submitLandlordApplication,
    triggerPush,
  } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [area, setArea] = useState<LagosArea>('Ikoyi');
  const [address, setAddress] = useState('18 Osborne Foreshore Estate, Ikoyi');
  const [bedrooms, setBedrooms] = useState(3);
  const [photosCount, setPhotosCount] = useState(4);
  const [docsUploaded, setDocsUploaded] = useState<string[]>([
    'Certificate_of_Occupancy.pdf',
  ]);
  const [plan, setPlan] = useState<'Revenue Share (80/20)' | 'Fixed Annual Lease'>(
    'Revenue Share (80/20)'
  );
  const [signature, setSignature] = useState(userName);

  const valuation = useMemo(
    () => estimatePropertyValuation(area, bedrooms),
    [area, bedrooms]
  );

  const handleSubmit = () => {
    const app = submitLandlordApplication({
      ownerName: userName,
      phone: userPhone,
      area,
      address,
      bedrooms,
      plan,
      estimatedMonthlyNgn: valuation.estimatedMonthlyGrossNgn,
      documentsUploaded: docsUploaded,
      kycVerified: true,
    });
    triggerPush(
      `Application ${app.id} Received`,
      `Inspection team scheduled for ${address}.`,
      '/landlord/contribute',
      'application'
    );
    setStep(4);
  };

  const areasOnly = LAGOS_AREAS.filter((a): a is LagosArea => a !== 'All');

  return (
    <div className="space-y-5 pb-8">
      <div>
        <div className="text-xs text-[#B45309] font-semibold">Step {Math.min(3, step)} of 3</div>
        <h1 className="font-display text-xl font-semibold mt-0.5">
          Contribute a Lagos Property
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          We stage your unit with Nigerian showroom furniture, manage guests &amp; pay monthly.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-colors ${
              step >= s ? 'bg-[#B45309]' : 'bg-stone-200 dark:bg-stone-800'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2">Lagos Neighborhood</label>
            <div className="grid grid-cols-2 gap-2">
              {areasOnly.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border text-left ${
                    area === a
                      ? 'bg-[#134E4A] text-white border-[#134E4A]'
                      : 'border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:border-[#B45309]"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Bedrooms</span>
            <div className="flex items-center gap-2.5">
              {[1, 2, 3, 4].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBedrooms(b)}
                  className={`w-10 h-10 rounded-xl font-mono-tabular text-xs font-semibold border ${
                    bedrooms === b
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                      : 'border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhotosCount((c) => c + 1)}
            className="w-full min-h-[46px] rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-xs font-medium flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4 text-[#B45309]" />
            <span>{photosCount} Property Photos Attached (Tap to Add)</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full min-h-[50px] rounded-2xl bg-[#B45309] text-white font-semibold text-sm"
          >
            Calculate Valuation &amp; Upload Docs
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="p-4 rounded-2xl bg-[#134E4A] text-[#FAF8F5] space-y-2">
            <div className="text-[11px] text-teal-200">Estimated Performance · {area}</div>
            <div className="font-mono-tabular text-2xl font-semibold">
              {formatMoney(valuation.estimatedMonthlyGrossNgn, currency)} / month
            </div>
            <div className="text-xs text-teal-100/80">
              Projected Nightly ADR: {formatMoney(valuation.nightlyRateNgn, currency)} · Asset Value:{' '}
              {formatMoney(valuation.propertyValueNgn, currency, true)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold">Title &amp; Ownership Documents</div>
            {docsUploaded.map((doc) => (
              <div
                key={doc}
                className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#134E4A] dark:text-teal-400 shrink-0" />
                  <span className="truncate">{doc}</span>
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setDocsUploaded((prev) =>
                  prev.includes('Survey_Plan_Lagos.pdf')
                    ? prev
                    : [...prev, 'Survey_Plan_Lagos.pdf']
                )
              }
              className="w-full min-h-[44px] rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-xs font-medium flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-[#B45309]" />
              <span>Attach Governor’s Consent / Survey Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-[48px] rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-semibold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="min-h-[48px] rounded-2xl bg-[#B45309] text-white text-xs font-semibold"
            >
              Choose Payout Plan
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="space-y-2.5">
            <div className="text-xs font-semibold">Select Management Plan</div>
            {(
              [
                {
                  id: 'Revenue Share (80/20)' as const,
                  desc: 'Keep 80% of net booking revenue + 5% furniture showroom sales inside your unit.',
                },
                {
                  id: 'Fixed Annual Lease' as const,
                  desc: 'Guaranteed fixed monthly payout regardless of seasonal Lagos occupancy.',
                },
              ]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPlan(opt.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-colors ${
                  plan === opt.id
                    ? 'border-[#B45309] bg-[#B45309]/8'
                    : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="text-xs font-semibold">{opt.id}</div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Digital Signature (Management Mandate)</span>
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 font-display italic text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="min-h-[48px] rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-semibold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="min-h-[48px] rounded-2xl bg-[#B45309] text-white text-xs font-semibold"
            >
              Sign &amp; Submit Unit
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="font-display text-lg font-semibold">Property Mandate Submitted</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Our Ikoyi staging architects will inspect {address} within 48 hours.
          </p>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="min-h-[44px] px-5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold"
          >
            Submit Another Property
          </button>
        </div>
      )}

      {/* Onboarding Tracker */}
      <section className="space-y-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800">
        <h2 className="font-display text-base font-semibold">Onboarding Status Tracker</h2>
        <div className="space-y-2">
          {applications.slice(0, 3).map((app) => (
            <div
              key={app.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#1B1815] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-[11px] font-mono-tabular text-stone-500">
                  {app.id} · {app.area} · {app.bedrooms} bed
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">{app.address}</div>
              </div>
              <span className="text-[11px] font-semibold text-[#134E4A] dark:text-teal-400 shrink-0">
                {app.stage}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
