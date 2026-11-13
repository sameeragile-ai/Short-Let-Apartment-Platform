import React, { useEffect, useRef, useState } from 'react';
import { Camera, Flashlight, QrCode, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { formatMoney } from '../lib/format';

interface QrScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScanFurnitureId: (furnitureId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  open,
  onClose,
  onScanFurnitureId,
}) => {
  const { furniture, currency } = useAppStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraState, setCameraState] = useState<'requesting' | 'active' | 'fallback'>('requesting');
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    if (!open) return;
    let stream: MediaStream | null = null;
    let cancelled = false;

    const startCamera = async () => {
      setCameraState('requesting');
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraState('fallback');
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraState('active');
      } catch {
        if (!cancelled) setCameraState('fallback');
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((tr) => tr.stop());
      }
    };
  }, [open]);

  if (!open) return null;

  const sampleTaggedItems = furniture.slice(0, 3);

  return (
    <div className="absolute inset-0 z-50 bg-stone-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          aria-label="Close scanner"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="text-sm font-semibold">Scan Room Furniture Tag</div>
          <div className="text-[11px] text-stone-400">Point at any brass QR tag inside your suite</div>
        </div>
        <button
          type="button"
          onClick={() => setTorchOn(!torchOn)}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
            torchOn ? 'bg-amber-500 text-stone-950' : 'bg-white/10 text-white'
          }`}
          aria-label="Toggle torch"
        >
          <Flashlight className="w-5 h-5" />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="relative flex-1 mx-5 my-3 rounded-3xl overflow-hidden bg-stone-900 border border-white/15 flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${
            cameraState === 'active' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {cameraState !== 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900">
            <Camera className="w-10 h-10 text-amber-500/80 mb-3" />
            <p className="text-sm font-medium text-stone-200">
              {cameraState === 'requesting'
                ? 'Initializing suite camera...'
                : 'Camera preview unavailable in this browser'}
            </p>
            <p className="text-xs text-stone-400 mt-1 max-w-[240px]">
              Use an instant simulated room tag below to inspect the live furniture product page.
            </p>
          </div>
        )}

        {/* Framing Corners + Animated Scan Line */}
        <div className="relative z-10 w-56 h-56 pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 rounded-br-xl" />
          <motion.div
            animate={{ y: [10, 200, 10] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_rgba(245,158,11,0.9)]"
          />
        </div>
      </div>

      {/* Instant Simulate Scan Fallback */}
      <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 space-y-2.5">
        <div className="text-[11px] font-medium text-stone-400 flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulate Tag Scan (In This Suite)</span>
        </div>
        <div className="space-y-2">
          {sampleTaggedItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onScanFurnitureId(item.id);
                onClose();
              }}
              className="w-full min-h-[48px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-between text-left active:scale-[0.98] transition-all"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                <div className="text-[11px] text-stone-400 font-mono-tabular">
                  {item.sku} · {item.brand}
                </div>
              </div>
              <span className="shrink-0 text-xs font-mono-tabular font-semibold text-amber-400 ml-2">
                {formatMoney(item.priceNgn, currency)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
