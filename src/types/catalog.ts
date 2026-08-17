export interface CadDimension {
  id: string;
  code: string; // e.g., 'A', 'B', 'C', 'D'
  label: string; // e.g. 'Outer Diameter (D)'
  value: number; // e.g. 348
  unit: string; // e.g. 'mm'
  tolerance?: string; // e.g. '±0.05 mm'
  calloutPosition: { x: number; y: number }; // Percentage coordinates for 2D diagram pin
}

export interface TechnicalSpec {
  key: string;
  label: string;
  value: string;
  unit?: string;
  category: 'Metallurgy' | 'Geometry' | 'Performance' | 'Standards';
}

export interface CrossReference {
  id: string;
  brand: string; // e.g. 'BMW', 'Bosch', 'TRW', 'Brembo', 'Mahle', 'Denso'
  oemNumber: string; // e.g. '34 11 6 860 017'
  normalizedNumber: string; // e.g. '34116860017'
  type: 'OEM' | 'Competitor' | 'OES';
  notes?: string;
}

export interface VehicleFitment {
  id: string;
  make: string; // e.g. 'BMW'
  model: string; // e.g. '5 Series (G30, F90)'
  generation?: string; // e.g. 'G30'
  yearStart: number; // 2016
  yearEnd?: number; // 2023 or null for current
  engineCode: string; // e.g. 'B48B20O1', 'B58B30M0', 'N20B20A'
  displacementCc: number; // e.g. 1998
  powerKw: number; // e.g. 185
  powerHp: number; // e.g. 252
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'EV';
  position: 'Front Axle' | 'Rear Axle' | 'Left/Right' | 'Engine Bay' | 'Transmission' | 'Universal';
  restrictionNotes?: string; // e.g., 'Only for M-Sport Braking System S2NHA'
}

export interface QualityCert {
  name: string; // e.g., 'TÜV Rheinland High Thermal Load Test'
  isoStandard: string; // e.g., 'ISO/TS 16949 / DIN EN 10083'
  result: string; // e.g., 'Passed 1,000,000 thermal cycles @ 850°C'
  date: string;
  inspectorId: string;
}

export interface BrandItem {
  id: string; // 'dextra' | 'kaido' | 'katsumoto' | 'luxor'
  name: string;
  slug: string;
  tagline: string;
  subtitle: string;
  badgeText: string;
  badgeBg: string;
  accentColor: string; // e.g. '#EAB308'
  brandColorClass: string;
  bannerImage: string;
  logoUrl?: string;
  description: string;
  featuredCategories: string[];
  catalogCount: number;
}

export interface LuxorPart {
  id: string;
  sku: string; // e.g., 'LX-3891-HC'
  itemCode?: string; // e.g., 'LFS 0550'
  brandId?: string; // 'dextra' | 'kaido' | 'katsumoto' | 'luxor'
  brandName?: string; // 'DEXTRA' | 'KAIDO' | 'KATSUMOTO' | 'LUXOR'
  title: string; // e.g., 'High-Carbon Ventilated Front Brake Disc'
  category: string; // 'Brake Systems' | 'Engine Components' | 'Turbochargers' | 'Suspension & Steering' | 'Filtration' | 'Fuel Injection'
  categorySlug: string;
  productLine: 'Luxor HighCarbon' | 'Luxor HeavyDuty' | 'Luxor Precision' | 'Luxor ProTurbo';
  description: string;
  drawingType: 'BrakeDisc2D' | 'BrakePad2D' | 'ControlArm2D' | 'Turbocharger2D' | 'Filter2D' | 'Pump2D' | 'Gasket2D';
  dimensions: CadDimension[];
  specs: TechnicalSpec[];
  crossReferences: CrossReference[];
  fitments: VehicleFitment[];
  certificates: QualityCert[];
  weightKg: number;
  eanBarcode: string;
  inStockStatus: 'In Stock' | 'Production Run' | 'Special Order';
  warehouseLocation: string;
  cadFileAvailable: boolean;
  pdfDatasheetUrl: string;
  materialCode: string; // e.g., 'GG25 HC (High Carbon 3.4% C, 2.1% Si)'
  surfaceFinish: string; // e.g., 'Geomet 500 Anti-Corrosion Zinc-Aluminum Coating'
  priceRub?: number; // e.g., 2750
  oldPriceRub?: number; // e.g., 3160
  imageUrl?: string; // product photo URL
  subcategory?: string; // e.g. 'Кожухи вентилятора'
}

export interface VehicleSelection {
  make: string;
  model: string;
  year: number | null;
  engineCode: string;
}

export interface ColumnMapping {
  csvColumn: string;
  targetField: keyof LuxorPart | 'crossReferenceOem' | 'fitmentMake' | 'fitmentModel' | 'fitmentEngine' | 'skip';
}

export interface ImportPreviewRow {
  rowNumber: number;
  data: Record<string, string>;
  status: 'valid' | 'warning' | 'error';
  messages: string[];
}
