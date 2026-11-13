import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Armchair,
  ArrowLeft,
  Battery,
  Bell,
  Building2,
  ClipboardList,
  Compass,
  Hammer,
  KeyRound,
  LayoutDashboard,
  MessageCircle,
  Package,
  PieChart,
  Plus,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  UserCircle2,
  Wifi,
  WifiOff,
  Wrench,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';
import { DemoControlPanel } from './DemoControlPanel';
import { BottomSheet } from './BottomSheet';
import { QrScannerModal } from './QrScannerModal';
import { AuthGate } from './AuthGate';

interface DeviceShellProps {
  children: React.ReactNode;
}

export const DeviceShell: React.FC<DeviceShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef(0);
  const longPressTimer = useRef<number | null>(null);

  const {
    role,
    theme,
    language,
    currency,
    textScale,
    isOffline,
    offlineQueue,
    syncOfflineQueue,
    notifications,
    activePushBanner,
    dismissPushBanner,
    markNotificationRead,
    cart,
    apartments,
    furniture,
  } = useAppStore();

  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [mobileDemoSheetOpen, setMobileDemoSheetOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [conflictSheetOpen, setConflictSheetOpen] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = theme === 'dark' || (theme === 'system' && prefersDark);
    root.classList.toggle('dark', shouldDark);
  }, [theme]);

  // Reset scroll when route changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setScrolled(false);
      setHeaderHidden(false);
    }
  }, [location.pathname]);

  // Auto-dismiss push notification banner after 5s
  useEffect(() => {
    if (!activePushBanner) return;
    const timer = setTimeout(() => {
      dismissPushBanner();
    }, 5200);
    return () => clearTimeout(timer);
  }, [activePushBanner, dismissPushBanner]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    setScrolled(top > 28);
    if (top > 90 && top - lastScrollTop.current > 18) {
      setHeaderHidden(true);
    } else if (lastScrollTop.current - top > 10 || top < 40) {
      setHeaderHidden(false);
    }
    lastScrollTop.current = top;
  };

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  // Determine 5 tabs based on active role
  const tabs =
    role === 'guest'
      ? [
          { path: '/', label: t(language, 'tabExplore'), icon: Compass },
          { path: '/showroom', label: t(language, 'tabShowroom'), icon: Armchair },
          { path: '/stay', label: t(language, 'tabMyStay'), icon: KeyRound, isCenter: true },
          { path: '/orders', label: t(language, 'tabOrders'), icon: Package },
          { path: '/messages', label: t(language, 'tabMessages'), icon: MessageCircle },
        ]
      : role === 'landlord'
        ? [
            { path: '/landlord', label: t(language, 'tabPortfolio'), icon: PieChart },
            { path: '/landlord/properties', label: t(language, 'tabProperties'), icon: Building2 },
            { path: '/landlord/contribute', label: t(language, 'tabContribute'), icon: Plus, isCenter: true },
            { path: '/landlord/invest', label: t(language, 'tabInvest'), icon: TrendingUp },
            { path: '/landlord/statements', label: t(language, 'tabStatements'), icon: ClipboardList },
          ]
        : [
            { path: '/admin', label: t(language, 'tabOverview'), icon: LayoutDashboard },
            { path: '/admin/listings', label: t(language, 'tabListings'), icon: Building2 },
            { path: '/admin/pipeline', label: t(language, 'tabPipeline'), icon: Hammer, isCenter: true },
            { path: '/admin/applications', label: t(language, 'tabApplications'), icon: ClipboardList },
            { path: '/admin/operations', label: t(language, 'tabOperations'), icon: Wrench },
          ];

  const isTopLevelTab = tabs.some((tab) => tab.path === location.pathname);

  const pageTitle = (() => {
    if (location.pathname === '/') return t(language, 'brandName');
    if (location.pathname.startsWith('/apartments/')) return 'Residence';
    if (location.pathname.startsWith('/showroom/')) return 'Showroom Piece';
    if (location.pathname === '/showroom') return t(language, 'tabShowroom');
    if (location.pathname === '/stay') return t(language, 'tabMyStay');
    if (location.pathname === '/orders') return t(language, 'tabOrders');
    if (location.pathname === '/messages') return t(language, 'tabMessages');
    if (location.pathname === '/cart') return 'Showroom Bag';
    if (location.pathname === '/profile') return t(language, 'profile');
    if (location.pathname === '/settings') return t(language, 'settings');
    if (location.pathname === '/notifications') return t(language, 'notifications');
    if (location.pathname === '/landlord') return t(language, 'tabPortfolio');
    if (location.pathname.startsWith('/landlord/properties/')) return 'Unit Performance';
    if (location.pathname === '/landlord/properties') return t(language, 'tabProperties');
    if (location.pathname === '/landlord/contribute') return t(language, 'contributeProperty');
    if (location.pathname === '/landlord/invest') return t(language, 'tabInvest');
    if (location.pathname === '/landlord/statements') return t(language, 'tabStatements');
    if (location.pathname === '/admin') return 'Operations KPI';
    if (location.pathname === '/admin/listings') return t(language, 'tabListings');
    if (location.pathname === '/admin/pipeline') return 'Furniture Pipeline';
    if (location.pathname === '/admin/applications') return 'Landlord Review';
    if (location.pathname === '/admin/operations') return 'Housekeeping';
    return t(language, 'brandName');
  })();

  const handleLongPressStart = () => {
    longPressTimer.current = window.setTimeout(() => {
      setMobileDemoSheetOpen(true);
    }, 550);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const hasOfflineConflicts = offlineQueue.some((item) => item.hasConflict);

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F2EFE9] via-[#EAE5DC] to-[#E3DDD2] dark:from-[#0C0A09] dark:via-[#14110F] dark:to-[#1C1815] md:px-6 overflow-hidden ${
        textScale === 'large' ? 'text-[17px]' : ''
      }`}
    >
      <div className="w-full max-w-[1180px] h-full flex items-center justify-center gap-12">
        {/* Desktop Editorial Brand & Demo Control Panel (>=1100px) */}
        <aside className="hidden min-[1100px]:flex flex-col justify-between w-[380px] max-h-[820px] py-4 shrink-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#134E4A] text-amber-200 flex items-center justify-center font-display font-semibold text-sm shadow-sm">
                  I&amp;F
                </div>
                <div>
                  <div className="font-display text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    {t(language, 'brandName')}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    Lagos · Ikoyi · Victoria Island · Lekki
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Best viewed on mobile
              </span>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {t(language, 'tagline')}
            </p>

            <div className="text-xs text-stone-500 dark:text-stone-400 font-mono-tabular">
              {apartments.length} residences · {furniture.length} showroom pieces · {currency} · {role.toUpperCase()}
            </div>
          </div>

          <div className="my-5 p-4 rounded-2xl bg-white/80 dark:bg-[#1B1815]/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-sm">
            <DemoControlPanel onTriggerQrScan={() => setQrOpen(true)} />
          </div>

          <div className="text-[11px] text-stone-500 dark:text-stone-500 leading-relaxed">
            Interactive client prototype · Tap room hotspots to buy furniture, switch roles to inspect Landlord equity &amp; Admin operations.
          </div>
        </aside>

        {/* Smartphone Device Canvas */}
        <div className="relative w-full h-[100dvh] md:w-[412px] md:h-[min(840px,calc(100vh-56px))] md:my-auto md:rounded-[48px] md:border-[8px] md:border-stone-900/90 dark:md:border-stone-800/90 md:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] bg-[#FAF8F5] dark:bg-[#12100E] text-stone-900 dark:text-stone-100 overflow-hidden flex flex-col shrink-0">
          {/* Desktop Hardware Speaker Notch & iOS Status Bar */}
          <div className="hidden md:flex flex-col shrink-0 bg-transparent z-40 select-none">
            <div className="pt-2 flex justify-center">
              <div className="w-24 h-4 bg-stone-900 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-7 pt-1 pb-1.5 text-[11px] font-semibold text-stone-900 dark:text-stone-100">
              <span className="font-mono-tabular">9:41</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[1.5px] h-2.5">
                  <span className="w-[2px] h-1 bg-current rounded-full" />
                  <span className="w-[2px] h-1.5 bg-current rounded-full" />
                  <span className="w-[2px] h-2 bg-current rounded-full" />
                  <span className="w-[2px] h-2.5 bg-current rounded-full" />
                </div>
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Push Notification Slide-Down Banner */}
          <AnimatePresence>
            {activePushBanner && (
              <motion.button
                type="button"
                initial={{ y: -90, opacity: 0 }}
                animate={{ y: 8, opacity: 1 }}
                exit={{ y: -90, opacity: 0 }}
                transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                onClick={() => {
                  markNotificationRead(activePushBanner.id);
                  navigate(activePushBanner.deepLink);
                  dismissPushBanner();
                }}
                className="absolute top-12 md:top-10 left-3 right-3 z-50 p-3 rounded-2xl bg-stone-900/95 dark:bg-stone-100/95 text-white dark:text-stone-900 shadow-2xl border border-white/10 flex items-start gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-[#B45309] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold truncate">{activePushBanner.title}</span>
                    <span className="text-[10px] opacity-70 shrink-0">now</span>
                  </div>
                  <p className="text-[11px] opacity-85 line-clamp-2 mt-0.5">
                    {activePushBanner.body}
                  </p>
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Slim Offline Banner */}
          {isOffline && (
            <div className="shrink-0 px-4 py-1.5 bg-amber-600 text-white text-[11px] font-medium flex items-center justify-between gap-2 z-30">
              <div className="flex items-center gap-1.5 truncate">
                <WifiOff className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t(language, 'offlineBanner')}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (hasOfflineConflicts) {
                    setConflictSheetOpen(true);
                  } else {
                    syncOfflineQueue();
                  }
                }}
                className="shrink-0 px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{offlineQueue.length > 0 ? `Sync (${offlineQueue.length})` : t(language, 'syncNow')}</span>
              </button>
            </div>
          )}

          {/* Scrollable Inner Content Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="phone-scroll relative flex-1 pb-24"
          >
            {/* Sticky Glass Top App Bar */}
            <header
              className={`sticky top-0 z-30 transition-all duration-200 pt-[max(0.25rem,env(safe-area-inset-top))] ${
                headerHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
              } ${
                scrolled
                  ? 'bg-[#FAF8F5]/85 dark:bg-[#12100E]/85 backdrop-blur-xl border-b border-stone-200/80 dark:border-stone-800/80'
                  : 'bg-transparent'
              }`}
            >
              <div className="h-[52px] px-4 flex items-center justify-between gap-2">
                {/* Start Zone: Back or Role Switcher Pill */}
                <div className="flex items-center min-w-0">
                  {!isTopLevelTab ? (
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      aria-label={t(language, 'back')}
                      className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-full text-stone-900 dark:text-stone-100 active:scale-95"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onTouchStart={handleLongPressStart}
                      onTouchEnd={handleLongPressEnd}
                      onMouseDown={handleLongPressStart}
                      onMouseUp={handleLongPressEnd}
                      onClick={() => setMobileDemoSheetOpen(true)}
                      className="min-h-[36px] px-2.5 py-1 rounded-full bg-stone-900/5 dark:bg-white/10 text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                    >
                      <span className="font-display text-sm">I&amp;F</span>
                      <span className="text-stone-400">·</span>
                      <span className="capitalize text-[11px] text-[#B45309] dark:text-amber-400">
                        {role}
                      </span>
                    </button>
                  )}
                </div>

                {/* Center Zone: Title */}
                <div className="text-center min-w-0 flex-1">
                  <span
                    className={`font-display font-semibold text-base tracking-tight truncate block transition-opacity ${
                      scrolled || !isTopLevelTab ? 'opacity-100' : 'opacity-90'
                    }`}
                  >
                    {pageTitle}
                  </span>
                </div>

                {/* End Zone: Cart (Guest) + Notifications + Profile */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {role === 'guest' && (
                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      aria-label="Showroom Bag"
                      className="relative min-h-[44px] min-w-[40px] flex items-center justify-center rounded-full text-stone-800 dark:text-stone-200 active:scale-95"
                    >
                      <ShoppingBag className="w-[19px] h-[19px]" />
                      {cartCount > 0 && (
                        <span className="absolute top-1.5 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#B45309] text-white font-mono-tabular text-[10px] font-semibold flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate('/notifications')}
                    aria-label="Notifications"
                    className="relative min-h-[44px] min-w-[40px] flex items-center justify-center rounded-full text-stone-800 dark:text-stone-200 active:scale-95"
                  >
                    <Bell className="w-[19px] h-[19px]" />
                    {unreadNotifs > 0 && (
                      <span className="absolute top-1.5 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#134E4A] text-white font-mono-tabular text-[10px] font-semibold flex items-center justify-center">
                        {unreadNotifs}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    aria-label="Profile"
                    className="min-h-[44px] min-w-[38px] flex items-center justify-center rounded-full text-stone-800 dark:text-stone-200 active:scale-95"
                  >
                    <UserCircle2 className="w-[20px] h-[20px]" />
                  </button>
                </div>
              </div>
            </header>

            {/* Route Screen Content */}
            <main className="px-4 pt-1">{children}</main>
          </div>

          {/* Floating Glass Bottom Tab Bar (5 Destinations) */}
          <nav
            aria-label="Primary mobile navigation"
            className="absolute bottom-0 left-0 right-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 pointer-events-none"
          >
            <div className="pointer-events-auto mx-auto rounded-3xl bg-white/92 dark:bg-[#1B1815]/92 backdrop-blur-2xl border border-stone-200/80 dark:border-stone-800/90 shadow-[0_8px_32px_rgba(0,0,0,0.12)] grid grid-cols-5 items-center h-[62px] px-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = location.pathname === tab.path;
                if (tab.isCenter) {
                  return (
                    <button
                      key={tab.path}
                      type="button"
                      onClick={() => navigate(tab.path)}
                      className="relative flex flex-col items-center justify-center -mt-5 active:scale-95 transition-transform"
                    >
                      <span
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${
                          active
                            ? 'bg-[#92400E] text-white ring-4 ring-[#FAF8F5] dark:ring-[#12100E]'
                            : 'bg-[#B45309] text-white ring-4 ring-[#FAF8F5] dark:ring-[#12100E]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <span
                        className={`text-[10px] font-semibold mt-1 whitespace-nowrap ${
                          active
                            ? 'text-[#B45309] dark:text-amber-400'
                            : 'text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    key={tab.path}
                    type="button"
                    onClick={() => navigate(tab.path)}
                    className="relative min-h-[48px] flex flex-col items-center justify-center rounded-2xl active:scale-95 transition-transform"
                  >
                    {active && (
                      <motion.span
                        layoutId="activeTabPill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-x-1.5 inset-y-1 rounded-2xl bg-stone-900/6 dark:bg-white/10"
                      />
                    )}
                    <Icon
                      className={`relative z-10 w-[20px] h-[20px] transition-colors ${
                        active
                          ? 'text-[#B45309] dark:text-amber-400'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    />
                    <span
                      className={`relative z-10 text-[10px] font-medium mt-1 whitespace-nowrap ${
                        active
                          ? 'text-stone-900 dark:text-stone-100 font-semibold'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Mobile Demo Control Panel Sheet */}
          <BottomSheet
            open={mobileDemoSheetOpen}
            onClose={() => setMobileDemoSheetOpen(false)}
            title="Demo Controls & Role Switch"
            subtitle="Switch user perspectives or trigger live platform events"
          >
            <DemoControlPanel
              compact
              onTriggerQrScan={() => setQrOpen(true)}
              onCloseSheet={() => setMobileDemoSheetOpen(false)}
            />
          </BottomSheet>

          {/* Offline Sync Conflict Resolver Sheet */}
          <BottomSheet
            open={conflictSheetOpen}
            onClose={() => setConflictSheetOpen(false)}
            title="Sync Conflict Detected"
            subtitle="Queued offline pricing edit conflicts with server update"
          >
            <div className="space-y-4">
              {offlineQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700"
                >
                  <div className="text-xs font-semibold">{item.action}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {item.detail} · Queued at {item.timestamp}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    syncOfflineQueue('mine');
                    setConflictSheetOpen(false);
                  }}
                  className="min-h-[44px] rounded-xl bg-[#B45309] text-white text-xs font-semibold"
                >
                  Keep Mine
                </button>
                <button
                  type="button"
                  onClick={() => {
                    syncOfflineQueue('server');
                    setConflictSheetOpen(false);
                  }}
                  className="min-h-[44px] rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold"
                >
                  Keep Server
                </button>
                <button
                  type="button"
                  onClick={() => {
                    syncOfflineQueue('merge');
                    setConflictSheetOpen(false);
                  }}
                  className="min-h-[44px] rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold"
                >
                  Merge
                </button>
              </div>
            </div>
          </BottomSheet>

          {/* QR Tag Camera Scanner */}
          <QrScannerModal
            open={qrOpen}
            onClose={() => setQrOpen(false)}
            onScanFurnitureId={(furnitureId) => navigate(`/showroom/${furnitureId}`)}
          />

          {/* Splash & Biometric/OTP Gate */}
          <AuthGate />
        </div>
      </div>
    </div>
  );
};
