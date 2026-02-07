import avatarMap from "./avatarMap";
export interface Actor {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  avatar: string;
  verified: boolean;
}

export interface JourneyEvent {
  id: number;
  actor: Actor;
  action: string;
  details: string;
  timestamp: string;
  location: string;
  digitalSignature: string;
  dataPoints?: Record<string, string>;
  section: "origin" | "transit" | "final";
}

export interface Batch {
  id: string;
  productName: string;
  status: "Harvested" | "In-Transit" | "Processed" | "Delivered" | "Verified";
  createdAt: string;
  lastUpdated: string;
  origin: string;
  journey: JourneyEvent[];
}

export interface ERPRecord {
  erpRefId: string;
  quantity: string;
  timestamp: string;
  location: string;
  status: "Ready to Seal" | "Verified" | "Pending";
  validated: boolean;
}

const actors: Actor[] = [
  { id: "ACT-001", name: "Farmer Ramesh", role: "Farmer", organization: "Green Valley Farms", location: "Coorg, Karnataka", avatar: "", verified: true },
  { id: "ACT-002", name: "Priya Sharma", role: "Collector", organization: "AgroCollect India", location: "Madikeri, India", avatar: "", verified: true },
  { id: "ACT-003", name: "Vikram Patel", role: "Processing Unit", organization: "SpiceProcess Ltd.", location: "Mysore, India", avatar: "", verified: true },
  { id: "ACT-004", name: "TransitCorp", role: "Logistics", organization: "TransitCorp Pvt Ltd", location: "Bangalore Highway", avatar: "", verified: true },
  { id: "ACT-005", name: "Rajan Mehta", role: "Custom Agent", organization: "ClearPort Agency", location: "Mangalore Port", avatar: "", verified: true },
  { id: "ACT-006", name: "OceanShip Global", role: "Shipping", organization: "OceanShip Global", location: "Arabian Sea", avatar: "", verified: true },
  { id: "ACT-007", name: "Hans Mueller", role: "Custom Agent", organization: "EU ClearPort", location: "Port of Rotterdam", avatar: "", verified: true },
  { id: "ACT-008", name: "Dr. Anna Weber", role: "Testing Lab", organization: "EuroLab Certified", location: "Utrecht, Netherlands", avatar: "", verified: true },
  { id: "ACT-009", name: "Nestlé Factory", role: "Factory", organization: "Nestlé S.A.", location: "Vevey, Switzerland", avatar: "", verified: true },
  { id: "ACT-010", name: "GlobalDist GmbH", role: "Global Distributor", organization: "GlobalDist GmbH", location: "Frankfurt, Germany", avatar: "", verified: true },
  { id: "ACT-011", name: "QuickDeliver India", role: "Local Logistics", organization: "QuickDeliver Pvt Ltd", location: "New Delhi, India", avatar: "", verified: true },
  { id: "ACT-012", name: "Khan Market Store", role: "Retailer", organization: "Premium Grocers", location: "Khan Market, Delhi", avatar: "", verified: true },
];

export const batches: Batch[] = [
  {
    id: "CP-9901",
    productName: "Organic Coffee Batch A1",
    status: "Verified",
    createdAt: "2026-01-15",
    lastUpdated: "2026-02-05",
    origin: "Coorg, Karnataka",
    journey: [
      { id: 1, actor: actors[0], action: "Harvesting (Raw Beans)", details: "Grade A Arabica beans harvested", timestamp: "2026-01-15 06:30 IST", location: "Coorg, Karnataka", digitalSignature: "0x7a2c9f8b3e1d...4a6f", dataPoints: { "Weight": "450 kg", "Moisture": "12%", "Grade": "A" }, section: "origin" },
      { id: 2, actor: actors[1], action: "Local Quality Sort (Grade A)", details: "Sorted and graded at collection center", timestamp: "2026-01-16 10:15 IST", location: "Madikeri, India", digitalSignature: "0x3b8e1f2c7d9a...8c2e", dataPoints: { "Accepted": "430 kg", "Rejected": "20 kg" }, section: "origin" },
      { id: 3, actor: actors[2], action: "Drying & Peeling", details: "Sun-dried and mechanically peeled", timestamp: "2026-01-18 14:00 IST", location: "Mysore, India", digitalSignature: "0x9d4f6a2b8e3c...1f7d", dataPoints: { "Output Weight": "380 kg", "Moisture Post-Dry": "8%" }, section: "origin" },
      { id: 4, actor: actors[3], action: "In-Transit (To Port)", details: "Temperature-controlled truck transport", timestamp: "2026-01-20 08:00 IST", location: "Bangalore Highway", digitalSignature: "0x1e5b9c3d7f2a...6e4b", dataPoints: { "Temp": "22°C", "Vehicle": "KA-01-XX-1234" }, section: "origin" },
      { id: 5, actor: actors[4], action: "Export Clearance", details: "All export documentation verified", timestamp: "2026-01-21 11:30 IST", location: "Mangalore Port", digitalSignature: "0x6c2d8f1a4b7e...3a9c", dataPoints: { "Doc ID": "EXP-2026-4421" }, section: "transit" },
      { id: 6, actor: actors[5], action: "Ocean Transit (Cold Storage)", details: "Container shipped via cargo vessel", timestamp: "2026-01-22 – 2026-02-01", location: "Arabian Sea", digitalSignature: "0x4a7e2c9d1f8b...5d3a", dataPoints: { "Container": "CSQU-2841", "Temp": "18°C" }, section: "transit" },
      { id: 7, actor: actors[6], action: "Import Clearance", details: "EU import and customs clearance completed", timestamp: "2026-02-01 09:00 CET", location: "Port of Rotterdam", digitalSignature: "0x8f3b1d6e9c4a...7b2f", section: "transit" },
      { id: 8, actor: actors[7], action: "Phytosanitary Check", details: "Lab tests passed: pesticide-free, organic certified", timestamp: "2026-02-02 14:30 CET", location: "Utrecht, Netherlands", digitalSignature: "0x2d9a4f7b8c1e...9e6d", dataPoints: { "Pesticide": "0.00 ppm", "Organic": "Pass" }, section: "transit" },
      { id: 9, actor: actors[8], action: "Roasting & Packaging", details: "Medium roast, vacuum sealed in 250g packs", timestamp: "2026-02-03 10:00 CET", location: "Vevey, Switzerland", digitalSignature: "0x5e8c3a1d7f9b...2c4a", dataPoints: { "Roast Level": "Medium", "Units": "1520 packs" }, section: "final" },
      { id: 10, actor: actors[9], action: "Bulk Storage", details: "Climate-controlled warehouse storage", timestamp: "2026-02-03 18:00 CET", location: "Frankfurt, Germany", digitalSignature: "0x7d1f4b9e2c6a...8f3e", section: "final" },
      { id: 11, actor: actors[10], action: "Last Mile Delivery", details: "Delivered to retail locations in Delhi", timestamp: "2026-02-05 06:00 IST", location: "New Delhi, India", digitalSignature: "0x3a6e9d2f1c8b...4d7a", section: "final" },
      { id: 12, actor: actors[11], action: "Retail Shelf Display (Verified)", details: "Product available for consumer purchase", timestamp: "2026-02-05 10:00 IST", location: "Khan Market, Delhi", digitalSignature: "0x9c4b7f2e8d1a...6a3e", section: "final" },
    ],
  },
  {
    id: "CP-9902",
    productName: "Basmati Rice Premium",
    status: "In-Transit",
    createdAt: "2026-01-20",
    lastUpdated: "2026-02-04",
    origin: "Punjab, India",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Farmer Gurmeet", location: "Amritsar, Punjab" }, action: "Harvested (Paddy)", details: "Premium long-grain basmati paddy", timestamp: "2026-01-20 07:00 IST", location: "Amritsar, Punjab", digitalSignature: "0xa1b2c3d4e5f6...7890", dataPoints: { "Weight": "2000 kg", "Variety": "1121 Basmati" }, section: "origin" },
      { id: 2, actor: { ...actors[2], name: "RiceMill Enterprises", location: "Karnal, Haryana" }, action: "Milling & Polishing", details: "De-husked and polished to premium grade", timestamp: "2026-01-23 14:00 IST", location: "Karnal, Haryana", digitalSignature: "0xf6e5d4c3b2a1...0987", dataPoints: { "Output": "1400 kg", "Broken": "2%" }, section: "origin" },
      { id: 3, actor: actors[3], action: "In-Transit (Domestic)", details: "Transport to Delhi distribution center", timestamp: "2026-02-02 09:00 IST", location: "NH-44 Highway", digitalSignature: "0x1234abcd5678...ef90", section: "transit" },
    ],
  },
  {
    id: "CP-9903",
    productName: "Ayurvedic Herbal Supplement",
    status: "Processed",
    createdAt: "2026-01-25",
    lastUpdated: "2026-02-03",
    origin: "Kerala, India",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Herbalist Suresh", location: "Munnar, Kerala" }, action: "Herb Harvesting", details: "Wild-sourced herbs collected", timestamp: "2026-01-25 06:00 IST", location: "Munnar, Kerala", digitalSignature: "0xab12cd34ef56...7890", dataPoints: { "Herbs": "Ashwagandha, Tulsi", "Weight": "120 kg" }, section: "origin" },
    ],
  },
  {
    id: "CP-9904",
    productName: "Cold-Pressed Coconut Oil",
    status: "Harvested",
    createdAt: "2026-02-01",
    lastUpdated: "2026-02-01",
    origin: "Thrissur, Kerala",
    journey: [],
  },
  {
    id: "CP-9905",
    productName: "Organic Turmeric Powder",
    status: "Delivered",
    createdAt: "2026-01-10",
    lastUpdated: "2026-02-06",
    origin: "Erode, Tamil Nadu",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Farmer Lakshmi", location: "Erode, Tamil Nadu" }, action: "Turmeric Harvesting", details: "Premium Erode turmeric harvested", timestamp: "2026-01-10 06:00 IST", location: "Erode, Tamil Nadu", digitalSignature: "0xdd11ee22ff33...4455", dataPoints: { "Weight": "800 kg", "Curcumin": "7.2%" }, section: "origin" },
    ],
  },
];

export const erpRecords: ERPRecord[] = [
  { erpRefId: "ERP-NES-2026-001", quantity: "450 kg", timestamp: "2026-01-15 06:30", location: "Coorg, Karnataka", status: "Verified", validated: true },
  { erpRefId: "ERP-NES-2026-002", quantity: "430 kg", timestamp: "2026-01-16 10:15", location: "Madikeri, India", status: "Verified", validated: true },
  { erpRefId: "ERP-NES-2026-003", quantity: "380 kg", timestamp: "2026-01-18 14:00", location: "Mysore, India", status: "Ready to Seal", validated: false },
  { erpRefId: "ERP-NES-2026-004", quantity: "380 kg", timestamp: "2026-01-20 08:00", location: "Bangalore Highway", status: "Ready to Seal", validated: false },
  { erpRefId: "ERP-NES-2026-005", quantity: "380 kg", timestamp: "2026-01-21 11:30", location: "Mangalore Port", status: "Pending", validated: false },
];

export const activityData = [
  { time: "00:00", users: 12 },
  { time: "04:00", users: 8 },
  { time: "08:00", users: 34 },
  { time: "12:00", users: 48 },
  { time: "16:00", users: 52 },
  { time: "20:00", users: 38 },
  { time: "Now", users: 42 },
];
