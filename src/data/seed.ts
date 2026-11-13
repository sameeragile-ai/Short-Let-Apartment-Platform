import {
  Apartment,
  Booking,
  ChatThread,
  FurnitureCategory,
  FurnitureItem,
  FurnitureOrder,
  HousekeepingTask,
  InvestmentOpportunity,
  LagosArea,
  LandlordApplication,
  MonthlyPerformance,
  OrderStage,
  PayoutRecord,
  PushNotification,
} from '../types';

export const IMAGES = {
  ikoyiPenthouse: '/src/assets/images/apt_ikoyi_penthouse_1794585279059.jpg',
  lekkiBedroom: '/src/assets/images/apt_lekki_bedroom_1794585279132.jpg',
  viLoft: '/src/assets/images/apt_vi_loft_1794585279773.jpg',
  bananaTerrace: '/src/assets/images/apt_banana_terrace_1794585280070.jpg',
  sofa: '/src/assets/images/furn_boucle_sofa_1794585280611.jpg',
  bed: '/src/assets/images/furn_iroko_bed_1794585280587.jpg',
  lamp: '/src/assets/images/furn_brass_lamp_1794585280535.jpg',
  dining: '/src/assets/images/furn_teak_dining_1794585281936.jpg',
};

export const FURNITURE_ITEMS: FurnitureItem[] = [
  // Featured room hotspot items (IDs f-1 to f-10)
  {
    id: 'f-1',
    sku: 'IF-LIV-001',
    name: 'Bourdillon Curved Bouclé Sofa',
    brand: 'Eko Atelier',
    origin: 'Made in Nigeria',
    category: 'Living',
    priceNgn: 1850000,
    materials: ['Belgian Ivory Bouclé', 'Kiln-Dried Ogun Walnut', 'High-Resilience Foam'],
    dimensions: '265 × 104 × 76 cm',
    availability: 'In Stock',
    leadTimeDays: 3,
    image: IMAGES.sofa,
    description: 'Hand-upholstered curved three-seater sculpted for conversation-led Ikoyi living rooms.',
    featuredInApartmentId: 'apt-1',
    finishOptions: ['Warm Ivory', 'Limestone Oat', 'Espresso Velvet'],
  },
  {
    id: 'f-2',
    sku: 'IF-LGT-002',
    name: 'Osborne Brushed Brass Arc Lamp',
    brand: 'Lagos Brass & Stone',
    origin: 'Made in Nigeria',
    category: 'Lighting',
    priceNgn: 420000,
    materials: ['Solid Brushed Brass', 'Honed Alabaster Shade', 'Weighted Travertine Base'],
    dimensions: '198 × 42 × 115 cm',
    availability: 'In Stock',
    leadTimeDays: 2,
    image: IMAGES.lamp,
    description: 'Graceful sweeping brass arc casting warm ambient glow over lounge seating.',
    featuredInApartmentId: 'apt-1',
    finishOptions: ['Brushed Brass', 'Aged Bronze'],
  },
  {
    id: 'f-3',
    sku: 'IF-DEC-003',
    name: 'Ikot Ekpene Raffia Sunburst Tapestry',
    brand: 'Abeokuta Loom',
    origin: 'Made in Nigeria',
    category: 'Décor',
    priceNgn: 295000,
    materials: ['Hand-Dyed Natural Raffia', 'Teak Dowel Rod'],
    dimensions: '160 × 110 × 6 cm',
    availability: 'Made to Order',
    leadTimeDays: 10,
    image: IMAGES.ikoyiPenthouse,
    description: 'Commissioned from master weavers in Akwa Ibom with unbleached sun-dried palm raffia.',
    featuredInApartmentId: 'apt-1',
    finishOptions: ['Natural Raw', 'Smoked Terracotta'],
  },
  {
    id: 'f-4',
    sku: 'IF-BED-004',
    name: 'Iroko Heritage King Platform Bed',
    brand: 'Ogun Woodworks',
    origin: 'Made in Nigeria',
    category: 'Bedroom',
    priceNgn: 1480000,
    materials: ['Solid Nigerian Iroko Hardwood', 'Woven Cane Inset', 'Oatmeal Belgian Linen'],
    dimensions: '215 × 195 × 112 cm',
    availability: 'In Stock',
    leadTimeDays: 4,
    image: IMAGES.bed,
    description: 'Our most-requested piece from returning Lekki guests — joinery built for decades.',
    featuredInApartmentId: 'apt-2',
    finishOptions: ['Smoked Iroko', 'Honey Teak', 'Charcoal Ash'],
  },
  {
    id: 'f-5',
    sku: 'IF-LGT-005',
    name: 'Nok Amphora Ceramic Table Lamp',
    brand: 'Nok Clay Studio',
    origin: 'Made in Nigeria',
    category: 'Lighting',
    priceNgn: 185000,
    materials: ['Hand-Thrown Stoneware Clay', 'Raw Linen Drum Shade'],
    dimensions: '54 × 32 × 32 cm',
    availability: 'In Stock',
    leadTimeDays: 2,
    image: IMAGES.lekkiBedroom,
    description: 'Textured stoneware vessel inspired by northern Nigerian terracotta forms.',
    featuredInApartmentId: 'apt-2',
    finishOptions: ['Raw Sand', 'Burnt Ochre'],
  },
  {
    id: 'f-6',
    sku: 'IF-DIN-006',
    name: 'Akin Adesola Sculpted Teak Dining Table',
    brand: 'Ogun Woodworks',
    origin: 'Made in Nigeria',
    category: 'Dining',
    priceNgn: 1620000,
    materials: ['Sustainably Harvested West African Teak', 'Matte Beeswax Seal'],
    dimensions: '240 × 105 × 76 cm',
    availability: 'Made to Order',
    leadTimeDays: 14,
    image: IMAGES.dining,
    description: 'Eight-seater architectural dining table with curved pedestal legs.',
    featuredInApartmentId: 'apt-3',
    finishOptions: ['Natural Oiled Teak', 'Deep Walnut'],
  },
  {
    id: 'f-7',
    sku: 'IF-DIN-007',
    name: 'Cane & Cognac Leather Dining Chair (Pair)',
    brand: 'Eko Atelier',
    origin: 'Made in Nigeria',
    category: 'Dining',
    priceNgn: 540000,
    materials: ['Kano Vegetable-Tanned Leather', 'Hand-Woven Rattan Cane', 'Solid Teak'],
    dimensions: '54 × 56 × 82 cm',
    availability: 'In Stock',
    leadTimeDays: 3,
    image: IMAGES.dining,
    description: 'Breathable woven cane backrest paired with supple Kano leather seat pads.',
    featuredInApartmentId: 'apt-3',
    finishOptions: ['Cognac Leather', 'Espresso Leather'],
  },
  {
    id: 'f-8',
    sku: 'IF-OUT-008',
    name: 'Banana Lagoon Teak Terrace Sectional',
    brand: 'Lekki Living',
    origin: 'Made in Nigeria',
    category: 'Outdoor',
    priceNgn: 2250000,
    materials: ['Marine-Grade Teak', 'Sunbrella Weather-Proof Linen', 'Quick-Dry Core'],
    dimensions: '290 × 175 × 74 cm',
    availability: 'Made to Order',
    leadTimeDays: 18,
    image: IMAGES.bananaTerrace,
    description: 'Engineered for Atlantic coastal humidity and waterfront terraces.',
    featuredInApartmentId: 'apt-4',
    finishOptions: ['Oat Linen', 'Stone Grey'],
  },
  {
    id: 'f-9',
    sku: 'IF-LGT-009',
    name: 'Epe Woven Rattan Pendant Lantern',
    brand: 'Abeokuta Loom',
    origin: 'Made in Nigeria',
    category: 'Lighting',
    priceNgn: 145000,
    materials: ['Natural Forest Rattan', 'Matte Black Canopy'],
    dimensions: '48 × 48 × 68 cm',
    availability: 'In Stock',
    leadTimeDays: 2,
    image: IMAGES.bananaTerrace,
    description: 'Open-weave pendant casting patterned evening light across covered terraces.',
    featuredInApartmentId: 'apt-4',
    finishOptions: ['Honey Rattan', 'Charred Black'],
  },
  {
    id: 'f-10',
    sku: 'IF-LIV-010',
    name: 'Honed Travertine Plinth Coffee Table',
    brand: 'Lagos Brass & Stone',
    origin: 'Curated Import',
    category: 'Living',
    priceNgn: 960000,
    materials: ['Roman Travertine Slab', 'Concealed Steel Cleat'],
    dimensions: '130 × 85 × 34 cm',
    availability: 'In Stock',
    leadTimeDays: 3,
    image: IMAGES.ikoyiPenthouse,
    description: 'Architectural cantilevered coffee table cut from unpolished travertine.',
    featuredInApartmentId: 'apt-1',
    finishOptions: ['Warm Cream Travertine', 'Silver Travertine'],
  },
];

// Generate 42 additional realistic furniture items so catalog has 52 total items
const EXTRA_FURNITURE_TEMPLATES: Array<{
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
}> = [
  { name: 'Adire Indigo Accent Cushion Set', brand: 'Abeokuta Loom', origin: 'Made in Nigeria', category: 'Décor', priceNgn: 95000, materials: ['Hand-Dyed Cotton', 'Duck Feather Insert'], dimensions: '55 × 55 cm', availability: 'In Stock', leadTimeDays: 2, image: IMAGES.ikoyiPenthouse },
  { name: 'Victoria Island Fluted Sideboard', brand: 'Ogun Woodworks', origin: 'Made in Nigeria', category: 'Living', priceNgn: 1180000, materials: ['Fluted White Oak', 'Brushed Brass Pulls'], dimensions: '185 × 46 × 78 cm', availability: 'Made to Order', leadTimeDays: 14, image: IMAGES.viLoft },
  { name: 'Chevron Mudcloth Bed Throw', brand: 'Abeokuta Loom', origin: 'Made in Nigeria', category: 'Bedroom', priceNgn: 120000, materials: ['100% Handspun Cotton', 'Plant-Based Terracotta Dye'], dimensions: '220 × 150 cm', availability: 'In Stock', leadTimeDays: 2, image: IMAGES.lekkiBedroom },
  { name: 'Lekki Travertine Drum Bedside Table', brand: 'Lagos Brass & Stone', origin: 'Curated Import', category: 'Bedroom', priceNgn: 380000, materials: ['Honed Travertine', 'Felt Base'], dimensions: '45 × 45 × 52 cm', availability: 'In Stock', leadTimeDays: 3, image: IMAGES.lamp },
  { name: 'Eko Linen Lounge Armchair', brand: 'Eko Atelier', origin: 'Made in Nigeria', category: 'Living', priceNgn: 790000, materials: ['Solid Walnut Frame', 'Belgian Oatmeal Linen'], dimensions: '78 × 84 × 76 cm', availability: 'In Stock', leadTimeDays: 4, image: IMAGES.sofa },
  { name: 'Ikoyi Linear Architectural Chandelier', brand: 'Lagos Brass & Stone', origin: 'Curated Import', category: 'Lighting', priceNgn: 640000, materials: ['Anodized Matte Aluminium', 'Warm 2700K LED'], dimensions: '140 × 28 × 45 cm', availability: 'In Stock', leadTimeDays: 3, image: IMAGES.viLoft },
  { name: 'Badagry Coastal Teak Lounge Chair', brand: 'Lekki Living', origin: 'Made in Nigeria', category: 'Outdoor', priceNgn: 620000, materials: ['Teak Timber', 'Woven Rope Cord'], dimensions: '74 × 80 × 72 cm', availability: 'In Stock', leadTimeDays: 4, image: IMAGES.bananaTerrace },
  { name: 'Yaba Minimalist Writing Desk', brand: 'Ogun Woodworks', origin: 'Made in Nigeria', category: 'Living', priceNgn: 680000, materials: ['American Ash', 'Saddle Leather Blotter'], dimensions: '150 × 70 × 75 cm', availability: 'Made to Order', leadTimeDays: 12, image: IMAGES.viLoft },
  { name: 'Kano Clay Tall Floor Vessel', brand: 'Nok Clay Studio', origin: 'Made in Nigeria', category: 'Décor', priceNgn: 165000, materials: ['Kiln-Fired Terracotta', 'Lime Wash'], dimensions: '36 × 36 × 64 cm', availability: 'In Stock', leadTimeDays: 2, image: IMAGES.bananaTerrace },
  { name: 'Ikoyi Hand-Knotted Jute Area Rug', brand: 'Abeokuta Loom', origin: 'Made in Nigeria', category: 'Décor', priceNgn: 410000, materials: ['Braided Natural Jute', 'Cotton Backing'], dimensions: '300 × 240 cm', availability: 'In Stock', leadTimeDays: 3, image: IMAGES.ikoyiPenthouse },
  { name: 'Osapa Upholstered Storage Bench', brand: 'Eko Atelier', origin: 'Made in Nigeria', category: 'Bedroom', priceNgn: 460000, materials: ['Bouclé Wool Blend', 'Iroko Legs'], dimensions: '145 × 45 × 46 cm', availability: 'Made to Order', leadTimeDays: 9, image: IMAGES.bed },
  { name: 'Gerrard Road Bar Stools (Pair)', brand: 'Ogun Woodworks', origin: 'Made in Nigeria', category: 'Dining', priceNgn: 495000, materials: ['Stained Oak', 'Blackened Steel Footrest'], dimensions: '44 × 46 × 96 cm', availability: 'In Stock', leadTimeDays: 3, image: IMAGES.dining },
  { name: 'Tarkwa Teak Outdoor Dining Set', brand: 'Lekki Living', origin: 'Made in Nigeria', category: 'Outdoor', priceNgn: 1890000, materials: ['Grade-A Plantation Teak', 'Stainless Hardware'], dimensions: '210 × 100 × 75 cm', availability: 'Made to Order', leadTimeDays: 16, image: IMAGES.bananaTerrace },
  { name: 'Alabaster Dome Wall Sconce', brand: 'Lagos Brass & Stone', origin: 'Curated Import', category: 'Lighting', priceNgn: 235000, materials: ['Spanish Alabaster', 'Unlacquered Brass'], dimensions: '26 × 14 × 26 cm', availability: 'In Stock', leadTimeDays: 2, image: IMAGES.lamp },
];

for (let i = 0; i < 42; i++) {
  const tpl = EXTRA_FURNITURE_TEMPLATES[i % EXTRA_FURNITURE_TEMPLATES.length];
  const variantNum = Math.floor(i / EXTRA_FURNITURE_TEMPLATES.length) + 2;
  const idNum = 11 + i;
  FURNITURE_ITEMS.push({
    id: `f-${idNum}`,
    sku: `IF-${tpl.category.slice(0, 3).toUpperCase()}-${String(idNum).padStart(3, '0')}`,
    name: variantNum > 2 ? `${tpl.name} · Edition ${variantNum}` : `${tpl.name} II`,
    brand: tpl.brand,
    origin: tpl.origin,
    category: tpl.category,
    priceNgn: tpl.priceNgn + (i % 4) * 35000,
    materials: tpl.materials,
    dimensions: tpl.dimensions,
    availability: tpl.availability,
    leadTimeDays: tpl.leadTimeDays,
    image: tpl.image,
    description: `Curated for Ilé & Form serviced residences across Lagos. Craftsmanship warranty included with white-glove installation.`,
    finishOptions: ['Signature Natural', 'Warm Espresso', 'Sandstone'],
  });
}

const LAGOS_APARTMENT_SEEDS: Array<{
  name: string;
  area: LagosArea;
  address: string;
  bedrooms: number;
  nightlyRateNgn: number;
  lat: number;
  lng: number;
  image: string;
  hostName: string;
}> = [
  { name: 'The Bourdillon Penthouse', area: 'Ikoyi', address: '14 Bourdillon Road, Old Ikoyi', bedrooms: 3, nightlyRateNgn: 485000, lat: 6.4535, lng: 3.4378, image: IMAGES.ikoyiPenthouse, hostName: 'Adaeze Okafor' },
  { name: 'Admiralty Clay Residence', area: 'Lekki Phase 1', address: '22 Admiralty Way, Lekki Phase 1', bedrooms: 2, nightlyRateNgn: 195000, lat: 6.4438, lng: 3.4742, image: IMAGES.lekkiBedroom, hostName: 'Tunde Bakare' },
  { name: 'Akin Adesola Glass Loft', area: 'Victoria Island', address: '8B Akin Adesola Street, VI', bedrooms: 2, nightlyRateNgn: 265000, lat: 6.4281, lng: 3.4219, image: IMAGES.viLoft, hostName: 'Chiamaka Eze' },
  { name: 'Lagoon Terrace Waterfront', area: 'Banana Island', address: '304 Close, Banana Island', bedrooms: 4, nightlyRateNgn: 650000, lat: 6.4648, lng: 3.4552, image: IMAGES.bananaTerrace, hostName: 'Ibrahim Musa' },
  { name: 'Glover Road Courtyard Suite', area: 'Ikoyi', address: '9 Glover Road, Ikoyi', bedrooms: 2, nightlyRateNgn: 310000, lat: 6.4502, lng: 3.4312, image: IMAGES.ikoyiPenthouse, hostName: 'Funmilayo Adeyemi' },
  { name: 'Fola Osibo Linen Studio', area: 'Lekki Phase 1', address: '41 Fola Osibo Street, Lekki Phase 1', bedrooms: 1, nightlyRateNgn: 115000, lat: 6.4412, lng: 3.4691, image: IMAGES.lekkiBedroom, hostName: 'Babajide Coker' },
  { name: 'Adeola Odeku Executive Residence', area: 'Victoria Island', address: '18 Adeola Odeku Street, VI', bedrooms: 3, nightlyRateNgn: 360000, lat: 6.4301, lng: 3.4165, image: IMAGES.viLoft, hostName: 'Folake Williams' },
  { name: 'Sabo Herbert Macaulay Atelier', area: 'Yaba', address: '112 Herbert Macaulay Way, Yaba', bedrooms: 1, nightlyRateNgn: 72000, lat: 6.5095, lng: 3.3792, image: IMAGES.lekkiBedroom, hostName: 'Emeka Nwosu' },
  { name: 'Joel Ogunnaike Garden Villa', area: 'Ikeja GRA', address: '17 Joel Ogunnaike Street, Ikeja GRA', bedrooms: 3, nightlyRateNgn: 210000, lat: 6.5782, lng: 3.3568, image: IMAGES.viLoft, hostName: 'Tunde Bakare' },
  { name: 'Banana Island Horizon Duplex', area: 'Banana Island', address: '108 First Avenue, Banana Island', bedrooms: 4, nightlyRateNgn: 590000, lat: 6.4671, lng: 3.4589, image: IMAGES.bananaTerrace, hostName: 'Ibrahim Musa' },
  { name: 'Gerrard Road Sanctuary', area: 'Ikoyi', address: '26 Gerrard Road, Ikoyi', bedrooms: 3, nightlyRateNgn: 410000, lat: 6.4461, lng: 3.4438, image: IMAGES.ikoyiPenthouse, hostName: 'Adaeze Okafor' },
  { name: 'Bisola Durosinmi Terrace', area: 'Lekki Phase 1', address: '5 Bisola Durosinmi Etti, Lekki', bedrooms: 2, nightlyRateNgn: 175000, lat: 6.4375, lng: 3.4799, image: IMAGES.bananaTerrace, hostName: 'Chiamaka Eze' },
  { name: 'Kofo Abayomi Gallery Flat', area: 'Victoria Island', address: '33 Kofo Abayomi Street, VI', bedrooms: 2, nightlyRateNgn: 240000, lat: 6.4339, lng: 3.4288, image: IMAGES.viLoft, hostName: 'Funmilayo Adeyemi' },
  { name: 'Oduduwa Crescent Pavilion', area: 'Ikeja GRA', address: '29 Oduduwa Crescent, Ikeja GRA', bedrooms: 2, nightlyRateNgn: 160000, lat: 6.5811, lng: 3.3515, image: IMAGES.lekkiBedroom, hostName: 'Babajide Coker' },
  { name: 'Commercial Avenue Loft', area: 'Yaba', address: '48 Commercial Avenue, Yaba', bedrooms: 1, nightlyRateNgn: 65000, lat: 6.5061, lng: 3.3765, image: IMAGES.viLoft, hostName: 'Emeka Nwosu' },
  { name: 'Thompson Avenue Residence', area: 'Ikoyi', address: '12 Thompson Avenue, Ikoyi', bedrooms: 2, nightlyRateNgn: 295000, lat: 6.4562, lng: 3.4356, image: IMAGES.ikoyiPenthouse, hostName: 'Folake Williams' },
  { name: 'Oniru Palm Courtyard', area: 'Victoria Island', address: '6 Palace Road, Oniru VI', bedrooms: 2, nightlyRateNgn: 225000, lat: 6.4252, lng: 3.4495, image: IMAGES.bananaTerrace, hostName: 'Tunde Bakare' },
  { name: 'Wole Olateju Maisonette', area: 'Lekki Phase 1', address: '19 Wole Olateju Crescent, Lekki', bedrooms: 3, nightlyRateNgn: 280000, lat: 6.4472, lng: 3.4658, image: IMAGES.viLoft, hostName: 'Adaeze Okafor' },
  { name: 'Moore Road Teak Suite', area: 'Ikoyi', address: '4 Moore Road, Ikoyi', bedrooms: 1, nightlyRateNgn: 185000, lat: 6.4581, lng: 3.4265, image: IMAGES.lekkiBedroom, hostName: 'Chiamaka Eze' },
  { name: 'Isaac John Timber Loft', area: 'Ikeja GRA', address: '42 Isaac John Street, Ikeja GRA', bedrooms: 2, nightlyRateNgn: 170000, lat: 6.5754, lng: 3.3612, image: IMAGES.viLoft, hostName: 'Ibrahim Musa' },
  { name: 'Hakeem Dickson Studio', area: 'Lekki Phase 1', address: '14 Hakeem Dickson Link, Lekki', bedrooms: 1, nightlyRateNgn: 98000, lat: 6.4404, lng: 3.4831, image: IMAGES.lekkiBedroom, hostName: 'Funmilayo Adeyemi' },
  { name: 'Eko Atlantic Horizon Suite', area: 'Victoria Island', address: 'Azuri Tower 12, Victoria Island', bedrooms: 3, nightlyRateNgn: 460000, lat: 6.4165, lng: 3.4125, image: IMAGES.ikoyiPenthouse, hostName: 'Folake Williams' },
  { name: 'Alagomeji Creative Flat', area: 'Yaba', address: '21 Montgomery Road, Yaba', bedrooms: 1, nightlyRateNgn: 58000, lat: 6.5032, lng: 3.3741, image: IMAGES.lekkiBedroom, hostName: 'Emeka Nwosu' },
  { name: 'Banana Island Sunset Villa', area: 'Banana Island', address: '215 Lagoon Drive, Banana Island', bedrooms: 4, nightlyRateNgn: 625000, lat: 6.4624, lng: 3.4521, image: IMAGES.bananaTerrace, hostName: 'Adaeze Okafor' },
  { name: 'Lugard Avenue Executive', area: 'Ikoyi', address: '7 Lugard Avenue, Ikoyi', bedrooms: 2, nightlyRateNgn: 325000, lat: 6.4519, lng: 3.4295, image: IMAGES.viLoft, hostName: 'Tunde Bakare' },
  { name: 'Akin Ogunlewe Penthouse', area: 'Victoria Island', address: '15 Akin Ogunlewe Street, VI', bedrooms: 3, nightlyRateNgn: 390000, lat: 6.4272, lng: 3.4384, image: IMAGES.ikoyiPenthouse, hostName: 'Chiamaka Eze' },
  { name: 'Emma Abimbola Cole Suite', area: 'Lekki Phase 1', address: '38 Emma Abimbola Cole, Lekki', bedrooms: 2, nightlyRateNgn: 185000, lat: 6.4352, lng: 3.4712, image: IMAGES.lekkiBedroom, hostName: 'Babajide Coker' },
  { name: 'Sobo Arobiodu Villa', area: 'Ikeja GRA', address: '11 Sobo Arobiodu Street, Ikeja GRA', bedrooms: 3, nightlyRateNgn: 230000, lat: 6.5834, lng: 3.3585, image: IMAGES.bananaTerrace, hostName: 'Funmilayo Adeyemi' },
  { name: 'Unilag Waterfront Studio', area: 'Yaba', address: '5 Harvey Road, Yaba', bedrooms: 1, nightlyRateNgn: 55000, lat: 6.5122, lng: 3.3832, image: IMAGES.lekkiBedroom, hostName: 'Emeka Nwosu' },
  { name: 'Queens Drive Lagoon Loft', area: 'Ikoyi', address: '19 Queens Drive, Ikoyi', bedrooms: 3, nightlyRateNgn: 445000, lat: 6.4479, lng: 3.4248, image: IMAGES.ikoyiPenthouse, hostName: 'Ibrahim Musa' },
  { name: 'Providence Street Residence', area: 'Lekki Phase 1', address: '27 Providence Street, Lekki', bedrooms: 2, nightlyRateNgn: 205000, lat: 6.4455, lng: 3.4622, image: IMAGES.viLoft, hostName: 'Folake Williams' },
  { name: 'Sanusi Fafunwa Atelier', area: 'Victoria Island', address: '52 Sanusi Fafunwa Street, VI', bedrooms: 2, nightlyRateNgn: 255000, lat: 6.4314, lng: 3.4321, image: IMAGES.viLoft, hostName: 'Babajide Coker' },
];

export const APARTMENTS: Apartment[] = LAGOS_APARTMENT_SEEDS.map((seed, idx) => {
  const id = `apt-${idx + 1}`;
  const isIkoyiHero = seed.image === IMAGES.ikoyiPenthouse;
  const isBedroomHero = seed.image === IMAGES.lekkiBedroom;
  const isViHero = seed.image === IMAGES.viLoft;

  const hotspots = isIkoyiHero
    ? [
        { id: `${id}-h1`, furnitureId: 'f-1', xPercent: 45, yPercent: 64, label: 'Bouclé Sofa' },
        { id: `${id}-h2`, furnitureId: 'f-2', xPercent: 72, yPercent: 34, label: 'Brass Arc Lamp' },
        { id: `${id}-h3`, furnitureId: 'f-3', xPercent: 32, yPercent: 32, label: 'Raffia Tapestry' },
        { id: `${id}-h4`, furnitureId: 'f-10', xPercent: 52, yPercent: 78, label: 'Travertine Table' },
      ]
    : isBedroomHero
      ? [
          { id: `${id}-h1`, furnitureId: 'f-4', xPercent: 46, yPercent: 62, label: 'Iroko King Bed' },
          { id: `${id}-h2`, furnitureId: 'f-5', xPercent: 79, yPercent: 50, label: 'Nok Ceramic Lamp' },
          { id: `${id}-h3`, furnitureId: 'f-13', xPercent: 31, yPercent: 71, label: 'Mudcloth Throw' },
        ]
      : isViHero
        ? [
            { id: `${id}-h1`, furnitureId: 'f-6', xPercent: 58, yPercent: 65, label: 'Teak Dining Table' },
            { id: `${id}-h2`, furnitureId: 'f-7', xPercent: 49, yPercent: 76, label: 'Cane & Leather Chair' },
            { id: `${id}-h3`, furnitureId: 'f-12', xPercent: 14, yPercent: 62, label: 'Fluted Sideboard' },
          ]
        : [
            { id: `${id}-h1`, furnitureId: 'f-8', xPercent: 36, yPercent: 72, label: 'Teak Terrace Sofa' },
            { id: `${id}-h2`, furnitureId: 'f-9', xPercent: 63, yPercent: 25, label: 'Rattan Lantern' },
            { id: `${id}-h3`, furnitureId: 'f-19', xPercent: 86, yPercent: 68, label: 'Kano Floor Vessel' },
          ];

  const images = [
    seed.image,
    isBedroomHero ? IMAGES.ikoyiPenthouse : IMAGES.lekkiBedroom,
    isViHero ? IMAGES.bananaTerrace : IMAGES.viLoft,
  ];

  const occupancy = 74 + ((idx * 7) % 21);
  const monthlyRev = Math.round(seed.nightlyRateNgn * 30 * (occupancy / 100));

  return {
    id,
    name: seed.name,
    area: seed.area,
    address: seed.address,
    bedrooms: seed.bedrooms,
    bathrooms: Math.max(1, seed.bedrooms),
    maxGuests: seed.bedrooms * 2,
    nightlyRateNgn: seed.nightlyRateNgn,
    cleaningFeeNgn: seed.bedrooms >= 3 ? 35000 : 20000,
    cautionDepositNgn: seed.nightlyRateNgn >= 350000 ? 150000 : 75000,
    rating: Number((4.75 + ((idx % 5) * 0.05)).toFixed(2)),
    reviewCount: 18 + ((idx * 11) % 64),
    images,
    hotspots,
    amenities: [
      '24/7 Inverter + Diesel Backup',
      'Starlink Fiber Wi-Fi',
      'Smart Keyless Entry',
      'Daily Housekeeping',
      'Shop-the-Room QR Tags',
      'Private Chef Kitchen',
    ],
    houseRules: [
      'Check-in from 2:00 PM · Check-out by 12:00 PM',
      'No indoor smoking (balcony permitted)',
      'Quiet hours after 10:30 PM',
      'Every piece of furniture is available to order',
    ],
    description: `Curated ${seed.bedrooms}-bedroom residence in ${seed.area} styled with bespoke Nigerian hardwood, handwoven textiles, and architectural lighting. Every piece in the residence carries a QR tag so you can order it for your own home.`,
    lat: seed.lat,
    lng: seed.lng,
    hostName: seed.hostName,
    landlordId: `ll-${(idx % 8) + 1}`,
    status: idx === 29 || idx === 30 ? 'Pending Approval' : idx === 31 ? 'Maintenance' : 'Active',
    occupancyPercent: occupancy,
    monthlyRevenueNgn: monthlyRev,
    blockedDates: ['2026-11-24', '2026-11-25'],
    reviews: [
      {
        id: `${id}-r1`,
        author: 'Kemi Adetiba-Okoro',
        date: 'Oct 2026',
        rating: 5,
        comment: 'Zero power flicker, spotless linen, and we ended up ordering the exact iroko bed frame for our home in Ikoyi.',
        purchasedFurniture: 'Iroko Heritage King Platform Bed',
      },
      {
        id: `${id}-r2`,
        author: 'Damilola Ogunleye',
        date: 'Sep 2026',
        rating: 4.9,
        comment: 'Seamless digital door code arrival from MMA2 airport. Calm aesthetic and fast Starlink.',
      },
    ],
  };
});

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-9041',
    apartmentId: 'apt-1',
    apartmentName: 'The Bourdillon Penthouse',
    area: 'Ikoyi',
    guestName: 'Olumide Adeola',
    checkIn: '2026-11-11',
    checkOut: '2026-11-16',
    nights: 5,
    guests: 2,
    nightlyRateNgn: 485000,
    cleaningFeeNgn: 35000,
    cautionDepositNgn: 150000,
    vatNgn: 184500,
    totalNgn: 2794500,
    status: 'Active',
    doorCode: '849204#',
    wifiSsid: 'IleForm_Bourdillon_5G',
    wifiPass: 'ikoyiAtelier26',
    paymentMethod: 'Paystack',
    createdAt: '2026-11-08',
  },
  {
    id: 'BK-9042',
    apartmentId: 'apt-2',
    apartmentName: 'Admiralty Clay Residence',
    area: 'Lekki Phase 1',
    guestName: 'Olumide Adeola',
    checkIn: '2026-11-22',
    checkOut: '2026-11-25',
    nights: 3,
    guests: 2,
    nightlyRateNgn: 195000,
    cleaningFeeNgn: 20000,
    cautionDepositNgn: 75000,
    vatNgn: 45375,
    totalNgn: 725375,
    status: 'Upcoming',
    doorCode: '310882#',
    wifiSsid: 'IleForm_Admiralty_5G',
    wifiPass: 'lekkiClay26',
    paymentMethod: 'Card',
    createdAt: '2026-11-10',
  },
  ...Array.from({ length: 24 }, (_, idx) => {
    const apt = APARTMENTS[(idx + 2) % APARTMENTS.length];
    const guestNames = [
      'Ngozi Nwankwo',
      'Seyi Ogunyemi',
      'Zainab Abdullahi',
      'Chinedu Okeke',
      'Bimbo Akintola',
      'Tobi Amusan-Cole',
      'Femi Otedola-Bello',
      'Amaka Igwe',
    ];
    const nights = 2 + (idx % 5);
    const sub = apt.nightlyRateNgn * nights + apt.cleaningFeeNgn;
    const vat = Math.round(sub * 0.075);
    return {
      id: `BK-${9015 + idx}`,
      apartmentId: apt.id,
      apartmentName: apt.name,
      area: apt.area,
      guestName: guestNames[idx % guestNames.length],
      checkIn: `2026-11-${String((idx % 20) + 1).padStart(2, '0')}`,
      checkOut: `2026-11-${String((idx % 20) + 1 + nights).padStart(2, '0')}`,
      nights,
      guests: 1 + (idx % 3),
      nightlyRateNgn: apt.nightlyRateNgn,
      cleaningFeeNgn: apt.cleaningFeeNgn,
      cautionDepositNgn: apt.cautionDepositNgn,
      vatNgn: vat,
      totalNgn: sub + vat + apt.cautionDepositNgn,
      status: idx < 5 ? ('Active' as const) : idx < 14 ? ('Upcoming' as const) : ('Completed' as const),
      doorCode: `${410000 + idx * 137}#`,
      wifiSsid: `IleForm_${apt.area.replace(/\s+/g, '')}`,
      wifiPass: 'lagosStay2026',
      paymentMethod: idx % 3 === 0 ? ('Bank Transfer' as const) : ('Paystack' as const),
      createdAt: '2026-11-05',
    };
  }),
];

const ORDER_STAGES: OrderStage[] = [
  'Order placed',
  'In workshop',
  'Quality check',
  'Out for delivery',
  'Installed',
];

export const INITIAL_FURNITURE_ORDERS: FurnitureOrder[] = Array.from({ length: 16 }, (_, idx) => {
  const stageIdx = idx % 5;
  const stage = ORDER_STAGES[stageIdx];
  const item = FURNITURE_ITEMS[idx % 10];
  const customerNames = [
    'Olumide Adeola',
    'Adaeze Okafor',
    'Tunde Bakare',
    'Chiamaka Eze',
    'Ibrahim Musa',
    'Funmilayo Adeyemi',
  ];
  return {
    id: `ORD-${4401 + idx}`,
    customerName: idx === 0 || idx === 3 ? 'Olumide Adeola' : customerNames[idx % customerNames.length],
    itemsSummary: `${item.name}${idx % 3 === 0 ? ' + 1 more' : ''}`,
    totalNgn: item.priceNgn + (idx % 3 === 0 ? 185000 : 0),
    stage,
    createdAt: `2026-11-${String(Math.max(1, 13 - idx)).padStart(2, '0')}`,
    estimatedDelivery: idx === 0 ? 'Today, 4:00 PM' : `2026-11-${String(16 + (idx % 12)).padStart(2, '0')}`,
    deliveryAddress: idx % 2 === 0 ? '14 Bourdillon Road, Old Ikoyi, Lagos' : '22 Admiralty Way, Lekki Phase 1, Lagos',
    isCustom: idx % 4 === 1,
    timeline: ORDER_STAGES.map((st, sIdx) => ({
      stage: st,
      timestamp: sIdx <= stageIdx ? `Nov ${Math.max(1, 10 - idx + sIdx)}, 10:30 AM` : 'Pending',
      completed: sIdx <= stageIdx,
    })),
  };
});

export const MONTHLY_PERFORMANCE: MonthlyPerformance[] = [
  { month: 'Dec', revenueNgn: 14200000, occupancyPercent: 89, adrNgn: 365000, payoutNgn: 11360000 },
  { month: 'Jan', revenueNgn: 12100000, occupancyPercent: 81, adrNgn: 340000, payoutNgn: 9680000 },
  { month: 'Feb', revenueNgn: 10850000, occupancyPercent: 76, adrNgn: 325000, payoutNgn: 8680000 },
  { month: 'Mar', revenueNgn: 11400000, occupancyPercent: 79, adrNgn: 330000, payoutNgn: 9120000 },
  { month: 'Apr', revenueNgn: 11900000, occupancyPercent: 82, adrNgn: 335000, payoutNgn: 9520000 },
  { month: 'May', revenueNgn: 11200000, occupancyPercent: 78, adrNgn: 328000, payoutNgn: 8960000 },
  { month: 'Jun', revenueNgn: 12450000, occupancyPercent: 83, adrNgn: 342000, payoutNgn: 9960000 },
  { month: 'Jul', revenueNgn: 13100000, occupancyPercent: 85, adrNgn: 350000, payoutNgn: 10480000 },
  { month: 'Aug', revenueNgn: 13500000, occupancyPercent: 86, adrNgn: 355000, payoutNgn: 10800000 },
  { month: 'Sep', revenueNgn: 12650000, occupancyPercent: 82, adrNgn: 345000, payoutNgn: 10120000 },
  { month: 'Oct', revenueNgn: 13800000, occupancyPercent: 88, adrNgn: 360000, payoutNgn: 11040000 },
  { month: 'Nov', revenueNgn: 14650000, occupancyPercent: 91, adrNgn: 372000, payoutNgn: 11720000 },
];

export const INITIAL_PAYOUTS: PayoutRecord[] = [
  { id: 'PAY-2026-11', date: '2026-11-05', propertyTitle: 'The Bourdillon Penthouse + 3 Units', grossNgn: 13800000, managementFeeNgn: 2760000, netPayoutNgn: 11040000, status: 'Paid', bankAccount: 'GTBank •••• 4821' },
  { id: 'PAY-2026-10', date: '2026-10-05', propertyTitle: 'The Bourdillon Penthouse + 3 Units', grossNgn: 12650000, managementFeeNgn: 2530000, netPayoutNgn: 10120000, status: 'Paid', bankAccount: 'GTBank •••• 4821' },
  { id: 'PAY-2026-09', date: '2026-09-05', propertyTitle: 'The Bourdillon Penthouse + 3 Units', grossNgn: 13500000, managementFeeNgn: 2700000, netPayoutNgn: 10800000, status: 'Paid', bankAccount: 'GTBank •••• 4821' },
  { id: 'PAY-2026-08', date: '2026-08-05', propertyTitle: 'The Bourdillon Penthouse + 3 Units', grossNgn: 13100000, managementFeeNgn: 2620000, netPayoutNgn: 10480000, status: 'Paid', bankAccount: 'GTBank •••• 4821' },
  { id: 'PAY-2026-07', date: '2026-07-05', propertyTitle: 'The Bourdillon Penthouse + 3 Units', grossNgn: 12450000, managementFeeNgn: 2490000, netPayoutNgn: 9960000, status: 'Paid', bankAccount: 'GTBank •••• 4821' },
];

export const INVESTMENT_OPPORTUNITIES: InvestmentOpportunity[] = [
  {
    id: 'inv-1',
    title: 'Ikoyi Cameron Road 3-Bed Showroom',
    area: 'Ikoyi',
    image: IMAGES.ikoyiPenthouse,
    totalValuationNgn: 320000000,
    minShareNgn: 500000,
    projectedYieldPercent: 18.4,
    fundedPercent: 78,
    investorsCount: 42,
    termMonths: 36,
    summary: 'Co-own an off-market Ikoyi residence fully furnished by Eko Atelier. Earn monthly rental yield plus 6% commission on showroom furniture sales inside the unit.',
  },
  {
    id: 'inv-2',
    title: 'Lekki Phase 1 Courtyard Loft Block',
    area: 'Lekki Phase 1',
    image: IMAGES.lekkiBedroom,
    totalValuationNgn: 185000000,
    minShareNgn: 500000,
    projectedYieldPercent: 16.8,
    fundedPercent: 64,
    investorsCount: 31,
    termMonths: 24,
    summary: 'High-occupancy corporate short-let block off Admiralty Way with solar-hybrid microgrid and zero diesel downtime.',
  },
  {
    id: 'inv-3',
    title: 'Victoria Island Executive Tower Floor',
    area: 'Victoria Island',
    image: IMAGES.viLoft,
    totalValuationNgn: 410000000,
    minShareNgn: 1000000,
    projectedYieldPercent: 19.2,
    fundedPercent: 86,
    investorsCount: 58,
    termMonths: 36,
    summary: 'Four executive 2-bedroom apartments targeting diaspora & multinational corporate stays along Akin Adesola.',
  },
  {
    id: 'inv-4',
    title: 'Banana Island Waterfront Villa Share',
    area: 'Banana Island',
    image: IMAGES.bananaTerrace,
    totalValuationNgn: 780000000,
    minShareNgn: 2500000,
    projectedYieldPercent: 21.0,
    fundedPercent: 52,
    investorsCount: 19,
    termMonths: 48,
    summary: 'Flagship waterfront residence with private jetty access and ultra-luxury Nigerian furniture showroom.',
  },
];

export const INITIAL_APPLICATIONS: LandlordApplication[] = [
  {
    id: 'APP-301',
    ownerName: 'Chief Babatunde Fashola-Cole',
    phone: '+234 803 412 8890',
    area: 'Ikoyi',
    address: '21 Cooper Road, Old Ikoyi',
    bedrooms: 3,
    plan: 'Revenue Share (80/20)',
    estimatedMonthlyNgn: 9200000,
    stage: 'Inspection Scheduled',
    submittedAt: '2026-11-10',
    documentsUploaded: ['Certificate of Occupancy (C-of-O).pdf', 'Floorplan_Ikoyi.pdf'],
    kycVerified: true,
  },
  {
    id: 'APP-302',
    ownerName: 'Dr. Chinweizu Okonkwo',
    phone: '+234 809 221 4501',
    area: 'Lekki Phase 1',
    address: '14 Chris Maduike Drive, Lekki Phase 1',
    bedrooms: 2,
    plan: 'Fixed Annual Lease',
    estimatedMonthlyNgn: 3800000,
    stage: 'Submitted',
    submittedAt: '2026-11-12',
    documentsUploaded: ['Governor_Consent.pdf'],
    kycVerified: false,
  },
  {
    id: 'APP-303',
    ownerName: 'Amina Bello-Dantata',
    phone: '+234 802 773 1904',
    area: 'Victoria Island',
    address: '44 Elsie Femi Pearse, VI',
    bedrooms: 3,
    plan: 'Revenue Share (80/20)',
    estimatedMonthlyNgn: 7800000,
    stage: 'Staging & Furniture',
    submittedAt: '2026-11-04',
    documentsUploaded: ['Deed_of_Assignment.pdf', 'Title_Clearance.pdf'],
    kycVerified: true,
  },
  {
    id: 'APP-304',
    ownerName: 'Kolawole Balogun',
    phone: '+234 818 550 3312',
    area: 'Ikeja GRA',
    address: '8 Oba Dosunmu Street, Ikeja GRA',
    bedrooms: 4,
    plan: 'Revenue Share (80/20)',
    estimatedMonthlyNgn: 6400000,
    stage: 'Submitted',
    submittedAt: '2026-11-12',
    documentsUploaded: ['Survey_Plan_GRA.pdf'],
    kycVerified: true,
  },
];

export const INITIAL_HOUSEKEEPING: HousekeepingTask[] = [
  { id: 'HK-1', apartmentName: 'The Bourdillon Penthouse', area: 'Ikoyi', type: 'Deep Linen Refresh', assignee: 'Blessing Ojo', scheduledTime: 'Today · 11:00 AM', status: 'In Progress' },
  { id: 'HK-2', apartmentName: 'Admiralty Clay Residence', area: 'Lekki Phase 1', type: 'Turnover Clean', assignee: 'Musa Danjuma', scheduledTime: 'Today · 1:30 PM', status: 'Scheduled' },
  { id: 'HK-3', apartmentName: 'Akin Adesola Glass Loft', area: 'Victoria Island', type: 'Showroom Staging', assignee: 'Yinka Adebiyi', scheduledTime: 'Today · 3:00 PM', status: 'Scheduled' },
  { id: 'HK-4', apartmentName: 'Lagoon Terrace Waterfront', area: 'Banana Island', type: 'Inspection', assignee: 'Chidi Nnamdi', scheduledTime: 'Yesterday · 4:00 PM', status: 'Completed' },
];

export const INITIAL_CHAT_THREADS: ChatThread[] = [
  {
    id: 'chat-1',
    name: 'Adaeze Okafor',
    roleLabel: 'Residence Concierge · Ikoyi',
    context: 'The Bourdillon Penthouse',
    unread: 1,
    messages: [
      { id: 'm1', sender: 'other', text: 'Good morning Olumide! Welcome to The Bourdillon Penthouse. Your smart-lock code is active.', timestamp: '09:12 AM' },
      { id: 'm2', sender: 'me', text: 'Thank you Adaeze! Quick question — is the curved ivory sofa available in warm oat linen too?', timestamp: '09:18 AM' },
      { id: 'm3', sender: 'other', text: 'Yes! Tap the marker on the living room photo or scan the brass QR tag under the armrest. We can deliver to your home in 3 days.', timestamp: '09:20 AM', attachmentLabel: 'Bourdillon Curved Bouclé Sofa · ₦1,850,000' },
    ],
  },
  {
    id: 'chat-2',
    name: 'Ogun Woodworks Atelier',
    roleLabel: 'Custom Furniture Workshop',
    context: 'Order #ORD-4402',
    unread: 0,
    messages: [
      { id: 'm4', sender: 'other', text: 'Your Iroko King Platform Bed timber has passed kiln moisture inspection. Upholstery starts tomorrow.', timestamp: 'Yesterday' },
    ],
  },
  {
    id: 'chat-3',
    name: 'Ilé & Form Portfolio Desk',
    roleLabel: 'Landlord Relations',
    context: 'Monthly Payouts & Staging',
    unread: 0,
    messages: [
      { id: 'm5', sender: 'other', text: 'November payout statement has been prepared. Occupancy across your 4 units is currently 91%.', timestamp: 'Nov 10' },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'n-1',
    title: 'Smart-Lock Active · Bourdillon Penthouse',
    body: 'Door code 849204# is active until Nov 16, 12:00 PM.',
    timestamp: '14m ago',
    read: false,
    deepLink: '/stay',
    category: 'booking',
  },
  {
    id: 'n-2',
    title: 'Showroom Order #ORD-4401',
    body: 'Bourdillon Curved Bouclé Sofa passed quality inspection.',
    timestamp: '2h ago',
    read: false,
    deepLink: '/orders',
    category: 'order',
  },
  {
    id: 'n-3',
    title: 'October Payout Settled',
    body: '₦11,040,000 transferred to GTBank •••• 4821.',
    timestamp: 'Nov 5',
    read: true,
    deepLink: '/landlord/statements',
    category: 'payout',
  },
];
