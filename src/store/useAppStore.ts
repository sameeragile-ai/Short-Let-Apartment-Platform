import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  APARTMENTS,
  FURNITURE_ITEMS,
  INITIAL_APPLICATIONS,
  INITIAL_BOOKINGS,
  INITIAL_CHAT_THREADS,
  INITIAL_FURNITURE_ORDERS,
  INITIAL_HOUSEKEEPING,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYOUTS,
  INVESTMENT_OPPORTUNITIES,
  MONTHLY_PERFORMANCE,
} from '../data/seed';
import {
  Apartment,
  Booking,
  CartItem,
  ChatThread,
  Currency,
  FurnitureItem,
  FurnitureOrder,
  HousekeepingTask,
  InvestmentOpportunity,
  LagosArea,
  LandlordApplication,
  Language,
  MonthlyPerformance,
  OfflineAction,
  OrderStage,
  PayoutRecord,
  PushNotification,
  ThemeMode,
  UserRole,
} from '../types';

interface AppState {
  // Environment & Preferences
  role: UserRole;
  theme: ThemeMode;
  language: Language;
  currency: Currency;
  textScale: 'normal' | 'large';
  isOffline: boolean;
  simulateError: boolean;
  showSplash: boolean;
  showOnboarding: boolean;
  isAuthenticated: boolean;
  kycVerified: boolean;
  userName: string;
  userPhone: string;

  // Core Data
  apartments: Apartment[];
  furniture: FurnitureItem[];
  bookings: Booking[];
  orders: FurnitureOrder[];
  monthlyPerformance: MonthlyPerformance[];
  payouts: PayoutRecord[];
  opportunities: InvestmentOpportunity[];
  applications: LandlordApplication[];
  housekeeping: HousekeepingTask[];
  chatThreads: ChatThread[];
  notifications: PushNotification[];
  activePushBanner: PushNotification | null;
  offlineQueue: OfflineAction[];

  // Guest Shopping & Saved
  cart: CartItem[];
  wishlistIds: string[];
  myInvestments: Record<string, number>;

  // Actions
  setRole: (role: UserRole) => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
  setTextScale: (scale: 'normal' | 'large') => void;
  toggleOffline: () => void;
  setSimulateError: (val: boolean) => void;
  dismissSplash: () => void;
  completeOnboarding: () => void;
  signIn: (name?: string, phone?: string) => void;
  signOut: () => void;
  verifyKyc: () => void;

  // Shopping & Furniture
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartQty: (cartId: string, delta: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  placeFurnitureOrder: (deliveryAddress: string, customerName: string) => FurnitureOrder;
  toggleWishlist: (id: string) => void;
  advanceOrderStage: (orderId: string) => void;

  // Bookings & Stay
  createBooking: (booking: Booking) => void;
  extendActiveStay: (bookingId: string, extraNights: number) => void;
  requestHousekeeping: (apartmentName: string, area: LagosArea, type: HousekeepingTask['type']) => void;

  // Landlord & Admin
  submitLandlordApplication: (app: Omit<LandlordApplication, 'id' | 'submittedAt' | 'stage'>) => LandlordApplication;
  investInOpportunity: (oppId: string, amountNgn: number) => void;
  approveApartment: (aptId: string) => void;
  updateApartmentPrice: (aptId: string, newRateNgn: number) => void;
  toggleBlockDate: (aptId: string, date: string) => void;
  advanceApplicationStage: (appId: string) => void;
  toggleHousekeepingStatus: (taskId: string) => void;
  simulateNewLandlordBooking: () => void;

  // Chat & Notifications & Offline Sync
  sendChatMessage: (threadId: string, text: string) => void;
  triggerPush: (title: string, body: string, deepLink: string, category: PushNotification['category']) => void;
  dismissPushBanner: () => void;
  markNotificationRead: (id: string) => void;
  queueOfflineAction: (action: string, detail: string, hasConflict?: boolean) => void;
  syncOfflineQueue: (resolution?: 'mine' | 'server' | 'merge') => void;
  resetDemoData: () => void;
}

const ORDER_STAGES: OrderStage[] = [
  'Order placed',
  'In workshop',
  'Quality check',
  'Out for delivery',
  'Installed',
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: 'guest',
      theme: 'light',
      language: 'en',
      currency: 'NGN',
      textScale: 'normal',
      isOffline: false,
      simulateError: false,
      showSplash: true,
      showOnboarding: false,
      isAuthenticated: true,
      kycVerified: true,
      userName: 'Olumide Adeola',
      userPhone: '+234 803 551 9042',

      apartments: APARTMENTS,
      furniture: FURNITURE_ITEMS,
      bookings: INITIAL_BOOKINGS,
      orders: INITIAL_FURNITURE_ORDERS,
      monthlyPerformance: MONTHLY_PERFORMANCE,
      payouts: INITIAL_PAYOUTS,
      opportunities: INVESTMENT_OPPORTUNITIES,
      applications: INITIAL_APPLICATIONS,
      housekeeping: INITIAL_HOUSEKEEPING,
      chatThreads: INITIAL_CHAT_THREADS,
      notifications: INITIAL_NOTIFICATIONS,
      activePushBanner: null,
      offlineQueue: [],

      cart: [
        {
          id: 'c-init-1',
          furnitureId: 'f-5',
          quantity: 1,
          finish: 'Raw Sand',
          isCustomOrder: false,
        },
      ],
      wishlistIds: ['apt-1', 'apt-4', 'f-1', 'f-4'],
      myInvestments: { 'inv-1': 2500000 },

      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setTextScale: (textScale) => set({ textScale }),
      toggleOffline: () =>
        set((state) => {
          const nextOffline = !state.isOffline;
          return { isOffline: nextOffline };
        }),
      setSimulateError: (simulateError) => set({ simulateError }),
      dismissSplash: () => set({ showSplash: false }),
      completeOnboarding: () => set({ showOnboarding: false }),
      signIn: (name, phone) =>
        set((state) => ({
          isAuthenticated: true,
          showOnboarding: false,
          userName: name || state.userName,
          userPhone: phone || state.userPhone,
        })),
      signOut: () => set({ isAuthenticated: false }),
      verifyKyc: () => set({ kycVerified: true }),

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find(
            (c) =>
              c.furnitureId === item.furnitureId &&
              c.finish === item.finish &&
              c.isCustomOrder === item.isCustomOrder
          );
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.id === existing.id ? { ...c, quantity: c.quantity + item.quantity } : c
              ),
            };
          }
          return {
            cart: [...state.cart, { ...item, id: `c-${Date.now()}` }],
          };
        }),

      updateCartQty: (cartId, delta) =>
        set((state) => ({
          cart: state.cart
            .map((c) => (c.id === cartId ? { ...c, quantity: c.quantity + delta } : c))
            .filter((c) => c.quantity > 0),
        })),

      removeFromCart: (cartId) =>
        set((state) => ({
          cart: state.cart.filter((c) => c.id !== cartId),
        })),

      clearCart: () => set({ cart: [] }),

      placeFurnitureOrder: (deliveryAddress, customerName) => {
        const state = get();
        const items = state.cart.map((c) => {
          const f = state.furniture.find((x) => x.id === c.furnitureId);
          return { cart: c, item: f };
        });
        const totalNgn = items.reduce(
          (sum, x) => sum + (x.item?.priceNgn ?? 0) * x.cart.quantity,
          0
        );
        const firstItem = items[0]?.item?.name ?? 'Showroom Piece';
        const hasCustom = items.some((x) => x.cart.isCustomOrder);
        const newOrder: FurnitureOrder = {
          id: `ORD-${Math.floor(4500 + Math.random() * 499)}`,
          customerName,
          itemsSummary:
            items.length > 1 ? `${firstItem} + ${items.length - 1} more` : firstItem,
          totalNgn,
          stage: 'Order placed',
          createdAt: '2026-11-13',
          estimatedDelivery: hasCustom ? '14 days (Made to order)' : '3 days (Ikoyi Dispatch)',
          deliveryAddress,
          isCustom: hasCustom,
          timeline: ORDER_STAGES.map((st, idx) => ({
            stage: st,
            timestamp: idx === 0 ? 'Just now' : 'Pending',
            completed: idx === 0,
          })),
        };
        set((s) => ({
          orders: [newOrder, ...s.orders],
          cart: [],
        }));
        return newOrder;
      },

      toggleWishlist: (id) =>
        set((state) => ({
          wishlistIds: state.wishlistIds.includes(id)
            ? state.wishlistIds.filter((x) => x !== id)
            : [...state.wishlistIds, id],
        })),

      advanceOrderStage: (orderId) =>
        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;
            const currentIdx = ORDER_STAGES.indexOf(ord.stage);
            const nextIdx = Math.min(ORDER_STAGES.length - 1, currentIdx + 1);
            const nextStage = ORDER_STAGES[nextIdx];
            return {
              ...ord,
              stage: nextStage,
              timeline: ORDER_STAGES.map((st, idx) => ({
                stage: st,
                timestamp: idx <= nextIdx ? (idx === nextIdx ? 'Just now' : ord.timeline[idx]?.timestamp || 'Completed') : 'Pending',
                completed: idx <= nextIdx,
              })),
            };
          }),
        })),

      createBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
        })),

      extendActiveStay: (bookingId, extraNights) =>
        set((state) => ({
          bookings: state.bookings.map((bk) => {
            if (bk.id !== bookingId) return bk;
            const addedBase = bk.nightlyRateNgn * extraNights;
            const addedVat = Math.round(addedBase * 0.075);
            return {
              ...bk,
              nights: bk.nights + extraNights,
              vatNgn: bk.vatNgn + addedVat,
              totalNgn: bk.totalNgn + addedBase + addedVat,
            };
          }),
        })),

      requestHousekeeping: (apartmentName, area, type) =>
        set((state) => {
          const newTask: HousekeepingTask = {
            id: `HK-${Math.floor(10 + Math.random() * 90)}`,
            apartmentName,
            area,
            type,
            assignee: 'Blessing Ojo',
            scheduledTime: 'Today · In 45 mins',
            status: 'Scheduled',
          };
          if (state.isOffline) {
            return {
              housekeeping: [newTask, ...state.housekeeping],
              offlineQueue: [
                ...state.offlineQueue,
                {
                  id: `oq-${Date.now()}`,
                  action: 'Housekeeping Request',
                  detail: `${apartmentName} · ${type}`,
                  timestamp: 'Just now',
                },
              ],
            };
          }
          return { housekeeping: [newTask, ...state.housekeeping] };
        }),

      submitLandlordApplication: (app) => {
        const created: LandlordApplication = {
          ...app,
          id: `APP-${Math.floor(310 + Math.random() * 89)}`,
          stage: 'Submitted',
          submittedAt: '2026-11-13',
        };
        set((state) => ({
          applications: [created, ...state.applications],
          offlineQueue: state.isOffline
            ? [
                ...state.offlineQueue,
                {
                  id: `oq-${Date.now()}`,
                  action: 'Property Contribution',
                  detail: `${app.address} (${app.area})`,
                  timestamp: 'Just now',
                },
              ]
            : state.offlineQueue,
        }));
        return created;
      },

      investInOpportunity: (oppId, amountNgn) =>
        set((state) => ({
          myInvestments: {
            ...state.myInvestments,
            [oppId]: (state.myInvestments[oppId] || 0) + amountNgn,
          },
          opportunities: state.opportunities.map((o) =>
            o.id === oppId
              ? {
                  ...o,
                  fundedPercent: Math.min(100, o.fundedPercent + Math.max(1, Math.round((amountNgn / o.totalValuationNgn) * 100))),
                  investorsCount: o.investorsCount + 1,
                }
              : o
          ),
        })),

      approveApartment: (aptId) =>
        set((state) => ({
          apartments: state.apartments.map((a) =>
            a.id === aptId ? { ...a, status: 'Active' } : a
          ),
        })),

      updateApartmentPrice: (aptId, newRateNgn) =>
        set((state) => {
          const updated = state.apartments.map((a) =>
            a.id === aptId ? { ...a, nightlyRateNgn: newRateNgn } : a
          );
          if (state.isOffline) {
            return {
              apartments: updated,
              offlineQueue: [
                ...state.offlineQueue,
                {
                  id: `oq-${Date.now()}`,
                  action: 'Update Nightly Rate',
                  detail: `Unit ${aptId} → ₦${newRateNgn.toLocaleString()}`,
                  timestamp: 'Just now',
                  hasConflict: true,
                },
              ],
            };
          }
          return { apartments: updated };
        }),

      toggleBlockDate: (aptId, date) =>
        set((state) => ({
          apartments: state.apartments.map((a) => {
            if (a.id !== aptId) return a;
            const exists = a.blockedDates.includes(date);
            return {
              ...a,
              blockedDates: exists
                ? a.blockedDates.filter((d) => d !== date)
                : [...a.blockedDates, date],
            };
          }),
        })),

      advanceApplicationStage: (appId) =>
        set((state) => {
          const stages: LandlordApplication['stage'][] = [
            'Submitted',
            'Inspection Scheduled',
            'Staging & Furniture',
            'Live on Platform',
          ];
          return {
            applications: state.applications.map((app) => {
              if (app.id !== appId) return app;
              const nextIdx = Math.min(stages.length - 1, stages.indexOf(app.stage) + 1);
              return { ...app, stage: stages[nextIdx] };
            }),
          };
        }),

      toggleHousekeepingStatus: (taskId) =>
        set((state) => ({
          housekeeping: state.housekeeping.map((t) => {
            if (t.id !== taskId) return t;
            const next =
              t.status === 'Scheduled'
                ? 'In Progress'
                : t.status === 'In Progress'
                  ? 'Completed'
                  : 'Scheduled';
            return { ...t, status: next };
          }),
        })),

      simulateNewLandlordBooking: () =>
        set((state) => {
          const addedRev = 1940000;
          const updatedPerf = state.monthlyPerformance.map((m, idx) =>
            idx === state.monthlyPerformance.length - 1
              ? {
                  ...m,
                  revenueNgn: m.revenueNgn + addedRev,
                  payoutNgn: m.payoutNgn + Math.round(addedRev * 0.8),
                  occupancyPercent: Math.min(98, m.occupancyPercent + 2),
                }
              : m
          );
          const newBooking: Booking = {
            id: `BK-${Math.floor(9100 + Math.random() * 800)}`,
            apartmentId: 'apt-1',
            apartmentName: 'The Bourdillon Penthouse',
            area: 'Ikoyi',
            guestName: 'Temitope Alakija',
            checkIn: '2026-11-18',
            checkOut: '2026-11-22',
            nights: 4,
            guests: 3,
            nightlyRateNgn: 485000,
            cleaningFeeNgn: 35000,
            cautionDepositNgn: 150000,
            vatNgn: 148125,
            totalNgn: 2273125,
            status: 'Upcoming',
            doorCode: '672910#',
            wifiSsid: 'IleForm_Bourdillon_5G',
            wifiPass: 'ikoyiAtelier26',
            paymentMethod: 'Paystack',
            createdAt: 'Just now',
          };
          const notif: PushNotification = {
            id: `n-${Date.now()}`,
            title: 'New 4-Night Booking · Ikoyi',
            body: 'Temitope Alakija booked The Bourdillon Penthouse (₦1,940,000).',
            timestamp: 'Just now',
            read: false,
            deepLink: '/landlord',
            category: 'booking',
          };
          return {
            monthlyPerformance: updatedPerf,
            bookings: [newBooking, ...state.bookings],
            notifications: [notif, ...state.notifications],
            activePushBanner: notif,
          };
        }),

      sendChatMessage: (threadId, text) =>
        set((state) => ({
          chatThreads: state.chatThreads.map((th) =>
            th.id === threadId
              ? {
                  ...th,
                  messages: [
                    ...th.messages,
                    {
                      id: `m-${Date.now()}`,
                      sender: 'me',
                      text,
                      timestamp: 'Just now',
                    },
                  ],
                }
              : th
          ),
        })),

      triggerPush: (title, body, deepLink, category) =>
        set((state) => {
          const notif: PushNotification = {
            id: `n-${Date.now()}`,
            title,
            body,
            timestamp: 'Just now',
            read: false,
            deepLink,
            category,
          };
          return {
            notifications: [notif, ...state.notifications],
            activePushBanner: notif,
          };
        }),

      dismissPushBanner: () => set({ activePushBanner: null }),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      queueOfflineAction: (action, detail, hasConflict = false) =>
        set((state) => ({
          offlineQueue: [
            ...state.offlineQueue,
            {
              id: `oq-${Date.now()}`,
              action,
              detail,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              hasConflict,
            },
          ],
        })),

      syncOfflineQueue: () => set({ offlineQueue: [], isOffline: false }),

      resetDemoData: () =>
        set({
          role: 'guest',
          language: 'en',
          currency: 'NGN',
          theme: 'light',
          isOffline: false,
          simulateError: false,
          apartments: APARTMENTS,
          furniture: FURNITURE_ITEMS,
          bookings: INITIAL_BOOKINGS,
          orders: INITIAL_FURNITURE_ORDERS,
          monthlyPerformance: MONTHLY_PERFORMANCE,
          payouts: INITIAL_PAYOUTS,
          opportunities: INVESTMENT_OPPORTUNITIES,
          applications: INITIAL_APPLICATIONS,
          housekeeping: INITIAL_HOUSEKEEPING,
          chatThreads: INITIAL_CHAT_THREADS,
          notifications: INITIAL_NOTIFICATIONS,
          activePushBanner: null,
          offlineQueue: [],
          cart: [
            {
              id: 'c-init-1',
              furnitureId: 'f-5',
              quantity: 1,
              finish: 'Raw Sand',
              isCustomOrder: false,
            },
          ],
          wishlistIds: ['apt-1', 'apt-4', 'f-1', 'f-4'],
          myInvestments: { 'inv-1': 2500000 },
        }),
    }),
    {
      name: 'ile-and-form-demo-v1',
      partialize: (state) => ({
        role: state.role,
        theme: state.theme,
        language: state.language,
        currency: state.currency,
        textScale: state.textScale,
        isOffline: state.isOffline,
        isAuthenticated: state.isAuthenticated,
        kycVerified: state.kycVerified,
        apartments: state.apartments,
        bookings: state.bookings,
        orders: state.orders,
        monthlyPerformance: state.monthlyPerformance,
        opportunities: state.opportunities,
        applications: state.applications,
        housekeeping: state.housekeeping,
        chatThreads: state.chatThreads,
        notifications: state.notifications,
        offlineQueue: state.offlineQueue,
        cart: state.cart,
        wishlistIds: state.wishlistIds,
        myInvestments: state.myInvestments,
      }),
    }
  )
);
