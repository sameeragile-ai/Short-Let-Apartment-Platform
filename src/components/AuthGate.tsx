import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Fingerprint, KeyRound, ScanFace, Smartphone } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const AuthGate: React.FC = () => {
  const { showSplash, dismissSplash, isAuthenticated, signIn } = useAppStore();
  const [phone, setPhone] = useState('+234 803 551 9042');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'method' | 'otp' | 'faceid'>('method');
  const [faceScanning, setFaceScanning] = useState(false);

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      dismissSplash();
    }, 1250);
    return () => clearTimeout(timer);
  }, [showSplash, dismissSplash]);

  const handleFaceId = () => {
    setStep('faceid');
    setFaceScanning(true);
    setTimeout(() => {
      setFaceScanning(false);
      signIn('Olumide Adeola', phone);
    }, 1100);
  };

  return (
    <>
      {/* Branded Splash Overlay (<1.3s) */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-[70] bg-[#134E4A] text-[#FAF8F5] flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl border border-amber-300/40 bg-white/10 flex items-center justify-center">
                <span className="font-display text-2xl font-semibold text-amber-200">I&amp;F</span>
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">Ilé &amp; Form</h1>
              <p className="text-xs text-teal-100/80 tracking-wide">
                Ikoyi · Victoria Island · Lekki
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign-In Screen (when signed out) */}
      <AnimatePresence>
        {!isAuthenticated && !showSplash && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-[#FAF8F5] dark:bg-[#12100E] text-stone-900 dark:text-stone-100 flex flex-col justify-between p-6 pt-14 pb-8"
          >
            <div className="space-y-3">
              <div className="text-xs font-medium text-[#B45309]">Lagos Hospitality &amp; Equity</div>
              <h2 className="font-display text-3xl font-semibold leading-tight">
                Welcome back to Ilé &amp; Form
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Sign in to access your smart door code, furniture orders, or landlord portfolio.
              </p>
            </div>

            {step === 'faceid' ? (
              <div className="my-auto flex flex-col items-center space-y-4 py-10">
                <div className="w-20 h-20 rounded-3xl bg-[#134E4A]/10 dark:bg-teal-900/30 flex items-center justify-center text-[#134E4A] dark:text-teal-400">
                  {faceScanning ? (
                    <ScanFace className="w-10 h-10 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  )}
                </div>
                <div className="text-sm font-semibold">
                  {faceScanning ? 'Verifying Face ID...' : 'Identity Verified'}
                </div>
              </div>
            ) : step === 'otp' ? (
              <div className="space-y-4 my-auto">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">
                    6-Digit OTP sent to {phone} (Demo: 123456)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full min-h-[50px] px-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-mono-tabular text-xl tracking-[0.35em] text-center focus:outline-none focus:border-[#B45309]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => signIn('Olumide Adeola', phone)}
                  className="w-full min-h-[52px] rounded-2xl bg-[#B45309] text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span>Verify &amp; Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="w-full py-2 text-xs font-medium text-stone-500"
                >
                  Use another sign-in option
                </button>
              </div>
            ) : (
              <div className="space-y-3 my-auto">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">
                    Nigerian Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full min-h-[48px] pl-10 pr-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-mono-tabular text-sm focus:outline-none focus:border-[#B45309]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="w-full min-h-[52px] rounded-2xl bg-[#B45309] text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Continue with Phone OTP</span>
                </button>
                <button
                  type="button"
                  onClick={handleFaceId}
                  className="w-full min-h-[52px] rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Sign in with Face ID</span>
                </button>
              </div>
            )}

            <div className="text-center text-[11px] text-stone-500">
              NDPR Compliant · Verified Lagos Hospitality Network
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
