export const DB_SCHEMA_SQL = `-- ====================================================================
-- LUXOR AUTOMOTIVE AFTERMARKET B2B SYSTEM DATABASE SCHEMA (PostgreSQL 16)
-- Target Volume: 100,000+ SKUs, 5,000,000+ Vehicle Fitment Rows
-- Architecture: Normalized Relational + Trigram Fuzzy Search + Partitioning
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 1. CATEGORIES TABLE
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    name_ru VARCHAR(128) NOT NULL,
    name_en VARCHAR(128) NOT NULL,
    name_de VARCHAR(128) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PARTS MASTER TABLE
CREATE TABLE parts (
    part_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'LX-3891-HC'
    normalized_sku VARCHAR(64) NOT NULL, -- Strip spaces, dashes for fast match
    category_id UUID NOT NULL REFERENCES categories(category_id),
    product_line VARCHAR(64) NOT NULL, -- 'Luxor HighCarbon', etc.
    title_ru VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_ru TEXT,
    drawing_type VARCHAR(64) NOT NULL, -- 'BrakeDisc2D', 'Turbocharger2D', etc.
    material_code VARCHAR(128) NOT NULL,
    surface_finish VARCHAR(128),
    weight_kg NUMERIC(8,3) CHECK (weight_kg > 0),
    ean_barcode VARCHAR(18),
    in_stock_status VARCHAR(32) DEFAULT 'In Stock',
    warehouse_location VARCHAR(128),
    cad_file_available BOOLEAN DEFAULT FALSE,
    pdf_datasheet_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. OEM & COMPETITOR CROSS-REFERENCES
CREATE TABLE oem_cross_references (
    cross_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID NOT NULL REFERENCES parts(part_id) ON DELETE CASCADE,
    brand_name VARCHAR(64) NOT NULL, -- 'BMW', 'Mercedes-Benz', 'Bosch', 'TRW'
    oem_number VARCHAR(64) NOT NULL, -- '34 11 6 860 017'
    normalized_number VARCHAR(64) NOT NULL, -- '34116860017'
    ref_type VARCHAR(16) CHECK (ref_type IN ('OEM', 'Competitor', 'OES')),
    notes VARCHAR(255)
);

-- 4. VEHICLE MASTER (TecDoc Compatible)
CREATE TABLE vehicles (
    vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make VARCHAR(64) NOT NULL, -- 'BMW', 'Audi', 'Mercedes-Benz'
    model VARCHAR(128) NOT NULL, -- '5 Series (G30, F90)'
    generation VARCHAR(32), -- 'G30'
    year_start INT NOT NULL,
    year_end INT,
    engine_code VARCHAR(64) NOT NULL, -- 'B48B20O1'
    displacement_cc INT CHECK (displacement_cc > 0),
    power_kw INT CHECK (power_kw > 0),
    power_hp INT CHECK (power_hp > 0),
    fuel_type VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PART FITMENT MATRIX (Partitioned by Make for High-Volume Performance)
CREATE TABLE part_fitments (
    fitment_id UUID DEFAULT uuid_generate_v4(),
    part_id UUID NOT NULL REFERENCES parts(part_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    position VARCHAR(64) NOT NULL, -- 'Front Axle', 'Rear Axle'
    restriction_notes TEXT,
    PRIMARY KEY (fitment_id, part_id)
);

-- 6. CAD DIMENSIONS (Blueprint Callouts)
CREATE TABLE part_cad_dimensions (
    dimension_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID NOT NULL REFERENCES parts(part_id) ON DELETE CASCADE,
    code CHAR(4) NOT NULL, -- 'A', 'B', 'TH', 'CB'
    label_ru VARCHAR(128) NOT NULL,
    dimension_value NUMERIC(10,3) NOT NULL,
    unit VARCHAR(16) DEFAULT 'mm',
    tolerance VARCHAR(32),
    callout_x NUMERIC(5,2),
    callout_y NUMERIC(5,2)
);

-- 7. TECHNICAL SPECIFICATIONS
CREATE TABLE part_specifications (
    spec_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID NOT NULL REFERENCES parts(part_id) ON DELETE CASCADE,
    spec_key VARCHAR(64) NOT NULL,
    label_ru VARCHAR(128) NOT NULL,
    spec_value VARCHAR(255) NOT NULL,
    spec_category VARCHAR(32) CHECK (spec_category IN ('Metallurgy', 'Geometry', 'Performance', 'Standards'))
);

-- 8. QUALITY & ISO CERTIFICATIONS
CREATE TABLE quality_certifications (
    cert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID NOT NULL REFERENCES parts(part_id) ON DELETE CASCADE,
    cert_name VARCHAR(255) NOT NULL,
    iso_standard VARCHAR(128) NOT NULL,
    test_result TEXT NOT NULL,
    test_date DATE NOT NULL,
    inspector_id VARCHAR(128) NOT NULL
);

-- ====================================================================
-- HIGH-PERFORMANCE INDEXING STRATEGY (Sub-10ms Cross-Reference Lookups)
-- ====================================================================

-- Trigram index for fuzzy searches across normalized OEM numbers
CREATE INDEX idx_oem_trgm ON oem_cross_references USING gin (normalized_number gin_trgm_ops);

-- B-Tree exact index for OEM searches
CREATE INDEX idx_oem_exact ON oem_cross_references (normalized_number, brand_name);

-- B-Tree index for Part SKU searches
CREATE INDEX idx_part_sku ON parts (normalized_sku);

-- Compound index for Vehicle Garage lookup
CREATE INDEX idx_vehicle_lookup ON vehicles (make, model, year_start, engine_code);

-- Fitment matrix join index
CREATE INDEX idx_fitment_part_vehicle ON part_fitments (vehicle_id, part_id);
`;

export const ARCHITECTURE_SECTIONS = [
  {
    id: 'db-schema',
    title: '1. Реляционная схема БД (PostgreSQL 16)',
    subtitle: 'Высоконормализованная модель данных TecDoc-стандарта для 100,000+ артикулов',
    description: 'Отказ от unstructured JSONB в пользу строго нормализованной связки tables для гарантирования ссылочной целостности, сверхбыстрого соединения таблицы кросс-номеров и матриц совместимости.',
  },
  {
    id: 'search-engine',
    title: '2. Логика "Умного поиска" за 3 клика',
    titleEn: '3-Click Smart Search Logic',
    description: 'Комбинация гибридного полнотекстового поиска (Meilisearch + pg_trgm) с каскадным гаражным фильтром. Обработка неочищенных артикулов со спецсимволами (пробелы, тире, слэши) через алгоритм нормализации regex `[^a-zA-Z0-9]`.',
  },
  {
    id: 'tech-stack',
    title: '3. Технологический стек и масштабируемость',
    subtitle: 'Архитектурный каркас для мгновенного отклика при 50,000+ SKU',
    description: 'Backend API на Go / Node.js Express с кешированием в Redis 7 (TTL 24 часа для кросс-матриц). Frontend на React 19 + TypeScript + Tailwind CSS с отрисовкой векторных CAD-чертежей через SVG Canvas.',
  },
  {
    id: 'content-strategy',
    title: '4. Контентная стратегия и Tone of Voice',
    subtitle: 'Строгий инженерный язык для B2B-закупщиков и главных механиков',
    description: 'Нулевая толерантность к маркетинговым штампам ("лучший", "революционный"). Только физико-химические параметры: сплавы чугунов (GG25, GG30 HC), допуски биения (≤ 0.015 мм), температурные пределы (до 1050°C), результаты соляного тумана (DIN 50021).',
  },
];
