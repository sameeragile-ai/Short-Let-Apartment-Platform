import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            className="relative z-10 max-h-[86%] flex flex-col rounded-t-[28px] bg-white dark:bg-[#1B1815] text-stone-900 dark:text-stone-100 border-t border-stone-200/80 dark:border-stone-800 shadow-2xl"
          >
            <div className="flex flex-col items-center pt-2.5 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
            </div>
            {(title || subtitle) && (
              <div className="flex items-start justify-between gap-3 px-5 pt-2 pb-3 border-b border-stone-200/70 dark:border-stone-800/80 shrink-0">
                <div className="min-w-0">
                  {title && (
                    <h3 className="font-display text-lg font-semibold leading-tight text-stone-900 dark:text-stone-100 truncate">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 active:scale-[0.95]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="phone-scroll px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
