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
  // VERIFIED BATCH 1
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
  // VERIFIED BATCH 2
  {
    id: "CP-9902",
    productName: "Premium Black Tea",
    status: "Verified",
    createdAt: "2026-01-12",
    lastUpdated: "2026-02-06",
    origin: "Darjeeling, West Bengal",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Tea Garden Manager", location: "Darjeeling, West Bengal" }, action: "Tea Leaf Plucking", details: "First flush premium tea leaves", timestamp: "2026-01-12 05:00 IST", location: "Darjeeling, West Bengal", digitalSignature: "0xa1b2c3d4e5f6...1234", dataPoints: { "Weight": "500 kg", "Grade": "FTGFOP1" }, section: "origin" },
      { id: 2, actor: actors[2], action: "Withering & Rolling", details: "Traditional tea processing", timestamp: "2026-01-13 08:00 IST", location: "Darjeeling Factory", digitalSignature: "0xb2c3d4e5f6a1...2345", dataPoints: { "Output": "450 kg" }, section: "origin" },
      { id: 3, actor: actors[3], action: "Oxidation & Drying", details: "Controlled fermentation and drying", timestamp: "2026-01-14 12:00 IST", location: "Darjeeling Factory", digitalSignature: "0xc3d4e5f6a1b2...3456", dataPoints: { "Final Weight": "400 kg", "Moisture": "3%" }, section: "origin" },
      { id: 4, actor: actors[4], action: "Quality Grading", details: "Manual sorting and grading", timestamp: "2026-01-15 14:00 IST", location: "Siliguri, West Bengal", digitalSignature: "0xd4e5f6a1b2c3...4567", section: "transit" },
      { id: 5, actor: actors[8], action: "Packaging", details: "Vacuum sealed in aluminum pouches", timestamp: "2026-01-18 10:00 IST", location: "Kolkata, West Bengal", digitalSignature: "0xe5f6a1b2c3d4...5678", dataPoints: { "Units": "800 pouches x 500g" }, section: "final" },
      { id: 6, actor: actors[10], action: "Distribution", details: "Distributed to premium retailers", timestamp: "2026-02-05 08:00 IST", location: "Mumbai, Maharashtra", digitalSignature: "0xf6a1b2c3d4e5...6789", section: "final" },
      { id: 7, actor: actors[11], action: "Retail Display (Verified)", details: "Available for consumer purchase", timestamp: "2026-02-06 09:00 IST", location: "Khan Market, Delhi", digitalSignature: "0xa1b2c3d4e5f6...7890", section: "final" },
    ],
  },
  // VERIFIED BATCH 3
  {
    id: "CP-9903",
    productName: "Organic Honey",
    status: "Verified",
    createdAt: "2026-01-08",
    lastUpdated: "2026-02-04",
    origin: "Himachal Pradesh",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Beekeeper Sunil", location: "Kullu, Himachal Pradesh" }, action: "Honey Extraction", details: "Wild flower honey harvested", timestamp: "2026-01-08 07:00 IST", location: "Kullu, Himachal Pradesh", digitalSignature: "0x1a2b3c4d5e6f...abcd", dataPoints: { "Weight": "300 kg", "Purity": "99.8%" }, section: "origin" },
      { id: 2, actor: actors[2], action: "Filtration & Testing", details: "Multi-stage filtration and lab testing", timestamp: "2026-01-10 11:00 IST", location: "Shimla, Himachal Pradesh", digitalSignature: "0x2b3c4d5e6f1a...bcde", dataPoints: { "Filtered": "285 kg", "Sugar": "Natural" }, section: "origin" },
      { id: 3, actor: actors[8], action: "Bottling", details: "Filled in glass bottles", timestamp: "2026-01-15 09:00 IST", location: "Chandigarh", digitalSignature: "0x3c4d5e6f1a2b...cdef", dataPoints: { "Bottles": "570 x 500g" }, section: "transit" },
      { id: 4, actor: actors[10], action: "Distribution", details: "Shipped to retailers nationwide", timestamp: "2026-02-02 07:00 IST", location: "Delhi NCR", digitalSignature: "0x4d5e6f1a2b3c...def0", section: "final" },
      { id: 5, actor: actors[11], action: "Retail Shelf (Verified)", details: "Organic certified honey available", timestamp: "2026-02-04 10:00 IST", location: "Khan Market, Delhi", digitalSignature: "0x5e6f1a2b3c4d...ef01", section: "final" },
    ],
  },
  // VERIFIED BATCH 4
  {
    id: "CP-9904",
    productName: "Basmati Rice Premium",
    status: "Verified",
    createdAt: "2026-01-20",
    lastUpdated: "2026-02-07",
    origin: "Punjab, India",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Farmer Gurmeet", location: "Amritsar, Punjab" }, action: "Harvested (Paddy)", details: "Premium long-grain basmati paddy", timestamp: "2026-01-20 07:00 IST", location: "Amritsar, Punjab", digitalSignature: "0xa1b2c3d4e5f6...7890", dataPoints: { "Weight": "2000 kg", "Variety": "1121 Basmati" }, section: "origin" },
      { id: 2, actor: { ...actors[2], name: "RiceMill Enterprises", location: "Karnal, Haryana" }, action: "Milling & Polishing", details: "De-husked and polished to premium grade", timestamp: "2026-01-23 14:00 IST", location: "Karnal, Haryana", digitalSignature: "0xf6e5d4c3b2a1...0987", dataPoints: { "Output": "1400 kg", "Broken": "2%" }, section: "origin" },
      { id: 3, actor: actors[3], action: "Quality Check", details: "Grain length and aroma verified", timestamp: "2026-01-25 10:00 IST", location: "Karnal, Haryana", digitalSignature: "0x1234abcd5678...ef90", dataPoints: { "Length": "8.3mm", "Aroma": "Excellent" }, section: "transit" },
      { id: 4, actor: actors[8], action: "Packaging", details: "Vacuum packed in 5kg bags", timestamp: "2026-01-28 09:00 IST", location: "Panipat, Haryana", digitalSignature: "0xabcd1234ef56...7890", dataPoints: { "Bags": "280 x 5kg" }, section: "final" },
      { id: 5, actor: actors[10], action: "Distribution", details: "Delivered to retail chain", timestamp: "2026-02-06 08:00 IST", location: "New Delhi", digitalSignature: "0x9876fedc5432...ba10", section: "final" },
      { id: 6, actor: actors[11], action: "Retail Display (Verified)", details: "Premium basmati available", timestamp: "2026-02-07 09:00 IST", location: "Khan Market, Delhi", digitalSignature: "0x5678abcd1234...ef90", section: "final" },
    ],
  },
  // VERIFIED BATCH 5
  {
    id: "CP-9905",
    productName: "Organic Turmeric Powder",
    status: "Verified",
    createdAt: "2026-01-10",
    lastUpdated: "2026-02-06",
    origin: "Erode, Tamil Nadu",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Farmer Lakshmi", location: "Erode, Tamil Nadu" }, action: "Turmeric Harvesting", details: "Premium Erode turmeric harvested", timestamp: "2026-01-10 06:00 IST", location: "Erode, Tamil Nadu", digitalSignature: "0xdd11ee22ff33...4455", dataPoints: { "Weight": "800 kg", "Curcumin": "7.2%" }, section: "origin" },
      { id: 2, actor: actors[2], action: "Boiling & Drying", details: "Traditional boiling and sun drying", timestamp: "2026-01-12 10:00 IST", location: "Erode, Tamil Nadu", digitalSignature: "0xee22ff33dd11...5566", dataPoints: { "Dried Weight": "200 kg" }, section: "origin" },
      { id: 3, actor: actors[2], action: "Grinding & Sieving", details: "Fine powder with 100 mesh", timestamp: "2026-01-15 14:00 IST", location: "Coimbatore, Tamil Nadu", digitalSignature: "0xff33dd11ee22...6677", dataPoints: { "Powder": "190 kg", "Mesh": "100" }, section: "transit" },
      { id: 4, actor: actors[8], action: "Lab Testing", details: "Curcumin content and purity verified", timestamp: "2026-01-20 11:00 IST", location: "Chennai, Tamil Nadu", digitalSignature: "0x11ee22ff33dd...7788", dataPoints: { "Curcumin": "7.5%", "Lead": "< 2ppm" }, section: "transit" },
      { id: 5, actor: actors[8], action: "Packaging", details: "Packed in airtight pouches", timestamp: "2026-01-25 09:00 IST", location: "Chennai, Tamil Nadu", digitalSignature: "0x22ff33dd11ee...8899", dataPoints: { "Pouches": "950 x 200g" }, section: "final" },
      { id: 6, actor: actors[11], action: "Retail Display (Verified)", details: "Organic certified turmeric", timestamp: "2026-02-06 10:00 IST", location: "Khan Market, Delhi", digitalSignature: "0x33dd11ee22ff...99aa", section: "final" },
    ],
  },
  // VERIFIED BATCH 6
  {
    id: "CP-9906",
    productName: "Alphonso Mango Pulp",
    status: "Verified",
    createdAt: "2026-01-18",
    lastUpdated: "2026-02-05",
    origin: "Ratnagiri, Maharashtra",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Mango Farmer Ajay", location: "Ratnagiri, Maharashtra" }, action: "Mango Harvesting", details: "Premium Alphonso mangoes picked", timestamp: "2026-01-18 06:00 IST", location: "Ratnagiri, Maharashtra", digitalSignature: "0xaa11bb22cc33...dd44", dataPoints: { "Weight": "1200 kg", "Grade": "Premium" }, section: "origin" },
      { id: 2, actor: actors[2], action: "Sorting & Washing", details: "Manual sorting and water wash", timestamp: "2026-01-19 09:00 IST", location: "Ratnagiri, Maharashtra", digitalSignature: "0xbb22cc33dd44...ee55", dataPoints: { "Accepted": "1100 kg" }, section: "origin" },
      { id: 3, actor: actors[2], action: "Pulping & Preservation", details: "Aseptic pulping process", timestamp: "2026-01-20 12:00 IST", location: "Pune, Maharashtra", digitalSignature: "0xcc33dd44ee55...ff66", dataPoints: { "Pulp": "850 kg", "Brix": "18" }, section: "transit" },
      { id: 4, actor: actors[8], action: "Quality Testing", details: "Microbial and sensory tests passed", timestamp: "2026-01-23 10:00 IST", location: "Pune, Maharashtra", digitalSignature: "0xdd44ee55ff66...aa77", dataPoints: { "Microbes": "Pass", "Taste": "Excellent" }, section: "transit" },
      { id: 5, actor: actors[8], action: "Canning", details: "Filled in sterilized cans", timestamp: "2026-01-28 08:00 IST", location: "Mumbai, Maharashtra", digitalSignature: "0xee55ff66aa77...bb88", dataPoints: { "Cans": "1700 x 500g" }, section: "final" },
      { id: 6, actor: actors[11], action: "Retail Display (Verified)", details: "Premium mango pulp available", timestamp: "2026-02-05 11:00 IST", location: "Khan Market, Delhi", digitalSignature: "0xff66aa77bb88...cc99", section: "final" },
    ],
  },
  // VERIFIED BATCH 7
  {
    id: "CP-9907",
    productName: "Cold-Pressed Coconut Oil",
    status: "Verified",
    createdAt: "2026-01-05",
    lastUpdated: "2026-02-03",
    origin: "Thrissur, Kerala",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Coconut Farmer Ravi", location: "Thrissur, Kerala" }, action: "Coconut Harvesting", details: "Fresh coconuts collected", timestamp: "2026-01-05 07:00 IST", location: "Thrissur, Kerala", digitalSignature: "0x1122aabbccdd...eeff", dataPoints: { "Coconuts": "5000 units", "Type": "Tall Variety" }, section: "origin" },
      { id: 2, actor: actors[2], action: "Dehusking & Drying", details: "Copra preparation", timestamp: "2026-01-07 10:00 IST", location: "Thrissur, Kerala", digitalSignature: "0x22bbccddee11...ff00", dataPoints: { "Copra": "600 kg", "Moisture": "6%" }, section: "origin" },
      { id: 3, actor: actors[2], action: "Cold Pressing", details: "Extracted at room temperature", timestamp: "2026-01-10 08:00 IST", location: "Kochi, Kerala", digitalSignature: "0xbbccddee1122...00ff", dataPoints: { "Oil": "380 liters", "Temp": "28°C" }, section: "transit" },
      { id: 4, actor: actors[8], action: "Filtration & Testing", details: "Multi-stage filtration and purity test", timestamp: "2026-01-15 11:00 IST", location: "Kochi, Kerala", digitalSignature: "0xccddee112233...ff00", dataPoints: { "Purity": "99.9%", "Acidity": "0.2%" }, section: "transit" },
      { id: 5, actor: actors[8], action: "Bottling", details: "Filled in dark glass bottles", timestamp: "2026-01-20 09:00 IST", location: "Kochi, Kerala", digitalSignature: "0xddee112233ff...0011", dataPoints: { "Bottles": "760 x 500ml" }, section: "final" },
      { id: 6, actor: actors[11], action: "Retail Display (Verified)", details: "Cold-pressed virgin coconut oil", timestamp: "2026-02-03 10:00 IST", location: "Khan Market, Delhi", digitalSignature: "0xee112233ff00...1122", section: "final" },
    ],
  },
  // IN-TRANSIT BATCH 8
  {
    id: "CP-9908",
    productName: "Saffron Premium Grade",
    status: "In-Transit",
    createdAt: "2026-02-01",
    lastUpdated: "2026-02-06",
    origin: "Pampore, Kashmir",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Saffron Grower Noor", location: "Pampore, Kashmir" }, action: "Saffron Harvesting", details: "Hand-picked saffron threads", timestamp: "2026-02-01 05:00 IST", location: "Pampore, Kashmir", digitalSignature: "0xaabbccdd1122...3344", dataPoints: { "Weight": "2 kg", "Grade": "Mongra" }, section: "origin" },
      { id: 2, actor: actors[2], action: "Drying & Grading", details: "Sun dried and quality sorted", timestamp: "2026-02-03 10:00 IST", location: "Srinagar, Kashmir", digitalSignature: "0xbbccdd112233...4455", dataPoints: { "Dried": "1.8 kg", "Grade": "A+" }, section: "origin" },
      { id: 3, actor: actors[3], action: "In-Transit to Packaging", details: "Temperature-controlled transport", timestamp: "2026-02-05 08:00 IST", location: "Jammu Highway", digitalSignature: "0xccdd11223344...5566", section: "transit" },
    ],
  },
  // PROCESSED BATCH 9
  {
    id: "CP-9909",
    productName: "Cardamom Premium Green",
    status: "Processed",
    createdAt: "2026-01-28",
    lastUpdated: "2026-02-04",
    origin: "Idukki, Kerala",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Spice Farmer Mohan", location: "Idukki, Kerala" }, action: "Cardamom Harvesting", details: "Green cardamom pods picked", timestamp: "2026-01-28 06:00 IST", location: "Idukki, Kerala", digitalSignature: "0x1122334455aa...bbcc", dataPoints: { "Weight": "150 kg", "Type": "Malabar" }, section: "origin" },
      { id: 2, actor: actors[2], action: "Drying & Cleaning", details: "Air dried and machine cleaned", timestamp: "2026-01-30 11:00 IST", location: "Kottayam, Kerala", digitalSignature: "0x22334455aabb...ccdd", dataPoints: { "Dried": "45 kg", "Moisture": "10%" }, section: "origin" },
      { id: 3, actor: actors[2], action: "Grading & Sorting", details: "Size and color grading", timestamp: "2026-02-04 09:00 IST", location: "Kochi, Kerala", digitalSignature: "0x334455aabbcc...ddee", dataPoints: { "Grade": "AGEB", "Bold": "85%" }, section: "transit" },
    ],
  },
  // HARVESTED BATCH 10
  {
    id: "CP-9910",
    productName: "Red Chilli Guntur",
    status: "Harvested",
    createdAt: "2026-02-03",
    lastUpdated: "2026-02-03",
    origin: "Guntur, Andhra Pradesh",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Chilli Farmer Reddy", location: "Guntur, Andhra Pradesh" }, action: "Chilli Harvesting", details: "Red hot chilli peppers picked", timestamp: "2026-02-03 07:00 IST", location: "Guntur, Andhra Pradesh", digitalSignature: "0x4455aabbccdd...eeff", dataPoints: { "Weight": "900 kg", "Variety": "Sannam S4" }, section: "origin" },
    ],
  },
  // IN-TRANSIT BATCH 11
  {
    id: "CP-9911",
    productName: "Assam Black Tea CTC",
    status: "In-Transit",
    createdAt: "2026-01-22",
    lastUpdated: "2026-02-05",
    origin: "Jorhat, Assam",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Tea Estate Manager", location: "Jorhat, Assam" }, action: "Tea Plucking", details: "CTC grade tea leaves", timestamp: "2026-01-22 06:00 IST", location: "Jorhat, Assam", digitalSignature: "0x55aabbccddee...ff00", dataPoints: { "Weight": "1000 kg", "Grade": "BOP" }, section: "origin" },
      { id: 2, actor: actors[2], action: "CTC Processing", details: "Crush-Tear-Curl method", timestamp: "2026-01-24 10:00 IST", location: "Guwahati, Assam", digitalSignature: "0xaabbccddeeff...0011", dataPoints: { "Output": "850 kg" }, section: "origin" },
      { id: 3, actor: actors[3], action: "In-Transit to Packaging", details: "Shipped to packaging unit", timestamp: "2026-02-03 08:00 IST", location: "Kolkata Highway", digitalSignature: "0xbbccddeeff00...1122", section: "transit" },
    ],
  },
  // HARVESTED BATCH 12
  {
    id: "CP-9912",
    productName: "Amul Fresh Milk",
    status: "Harvested",
    createdAt: "2026-02-06",
    lastUpdated: "2026-02-06",
    origin: "Anand, Gujarat",
    journey: [
      { id: 1, actor: { ...actors[0], name: "Dairy Farmer Patel", location: "Anand, Gujarat" }, action: "Milk Collection", details: "Fresh cow milk collected", timestamp: "2026-02-06 05:00 IST", location: "Anand, Gujarat", digitalSignature: "0xccddeeff0011...2233", dataPoints: { "Volume": "5000 liters", "Fat": "4.5%" }, section: "origin" },
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
