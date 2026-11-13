export type UserRole = 'guest' | 'landlord' | 'admin';
export type Currency = 'NGN' | 'USD';
export type Language = 'en' | 'yo';
export type ThemeMode = 'light' | 'dark' | 'system';

export type LagosArea =
  | 'Ikoyi'
  | 'Victoria Island'
  | 'Lekki Phase 1'
  | 'Banana Island'
  | 'Yaba'
  | 'Ikeja GRA';

export interface RoomHotspot {
  id: string;
  furnitureId: string;
  xPercent: number;
  yPercent: number;
  label: string;
}

export interface ApartmentReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  purchasedFurniture?: string;
}

export interface Apartment {
  id: string;
  name: string;
  area: LagosArea;
  address: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  nightlyRateNgn: number;
  cleaningFeeNgn: number;
  cautionDepositNgn: number;
  rating: number;
  reviewCount: number;
  images: string[];
  hotspots: RoomHotspot[];
  amenities: string[];
  houseRules: string[];
  description: string;
  lat: number;
  lng: number;
  hostName: string;
  landlordId: string;
  status: 'Active' | 'Pending Approval' | 'Maintenance';
  occupancyPercent: number;
  monthlyRevenueNgn: number;
  blockedDates: string[];
  reviews: ApartmentReview[];
}

export type FurnitureCategory =
  | 'Living'
  | 'Bedroom'
  | 'Dining'
  | 'Lighting'
  | 'Décor'
  | 'Outdoor';

export interface FurnitureItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  origin: 'Made in Nigeria' | 'Curated Import';
  category: FurnitureCategory;
  priceNgn: number;
  materials: string[];
  dimensions: string;
  availability: 'In Stock' | 'Made to Order';
  leadTimeDays: number;
  image: string;
  description: string;
  featuredInApartmentId?: string;
  finishOptions: string[];
}

export interface CartItem {
  id: string;
  furnitureId: string;
  quantity: number;
  finish: string;
  isCustomOrder: boolean;
  customDimensions?: string;
  customNotes?: string;
}

export type OrderStage =
  | 'Order placed'
  | 'In workshop'
  | 'Quality check'
  | 'Out for delivery'
  | 'Installed';

export interface FurnitureOrder {
  id: string;
  customerName: string;
  itemsSummary: string;
  totalNgn: number;
  stage: OrderStage;
  createdAt: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  isCustom: boolean;
  timeline: { stage: OrderStage; timestamp: string; completed: boolean }[];
}

export type BookingStatus = 'Active' | 'Upcoming' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  apartmentId: string;
  apartmentName: string;
  area: LagosArea;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  nightlyRateNgn: number;
  cleaningFeeNgn: number;
  cautionDepositNgn: number;
  vatNgn: number;
  totalNgn: number;
  status: BookingStatus;
  doorCode: string;
  wifiSsid: string;
  wifiPass: string;
  paymentMethod: 'Card' | 'Bank Transfer' | 'Paystack';
  createdAt: string;
}

export interface MonthlyPerformance {
  month: string;
  revenueNgn: number;
  occupancyPercent: number;
  adrNgn: number;
  payoutNgn: number;
}

export interface PayoutRecord {
  id: string;
  date: string;
  propertyTitle: string;
  grossNgn: number;
  managementFeeNgn: number;
  netPayoutNgn: number;
  status: 'Paid' | 'Processing';
  bankAccount: string;
}

export interface InvestmentOpportunity {
  id: string;
  title: string;
  area: LagosArea;
  image: string;
  totalValuationNgn: number;
  minShareNgn: number;
  projectedYieldPercent: number;
  fundedPercent: number;
  investorsCount: number;
  termMonths: number;
  summary: string;
}

export type OnboardingStage =
  | 'Submitted'
  | 'Inspection Scheduled'
  | 'Staging & Furniture'
  | 'Live on Platform';

export interface LandlordApplication {
  id: string;
  ownerName: string;
  phone: string;
  area: LagosArea;
  address: string;
  bedrooms: number;
  plan: 'Revenue Share (80/20)' | 'Fixed Annual Lease';
  estimatedMonthlyNgn: number;
  stage: OnboardingStage;
  submittedAt: string;
  documentsUploaded: string[];
  kycVerified: boolean;
}

export interface HousekeepingTask {
  id: string;
  apartmentName: string;
  area: LagosArea;
  type: 'Turnover Clean' | 'Deep Linen Refresh' | 'Showroom Staging' | 'Inspection';
  assignee: string;
  scheduledTime: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
  attachmentLabel?: string;
}

export interface ChatThread {
  id: string;
  name: string;
  roleLabel: string;
  context: string;
  unread: number;
  messages: ChatMessage[];
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  deepLink: string;
  category: 'booking' | 'payout' | 'order' | 'application';
}

export interface OfflineAction {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  hasConflict?: boolean;
}
