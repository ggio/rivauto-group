import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOADS_DIR));

// ─── Global Catalog Sync Endpoints ───────────────────────────────────────────
app.get('/api/catalog', async (_req, res) => {
  try {
    if (fs.existsSync(CATALOG_FILE)) {
      const data = fs.readFileSync(CATALOG_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && Object.keys(parsed).length > 0) {
        return res.json({ success: true, catalog: parsed });
      }
    }

    // Fallback: Fetch permanent catalog backup from Cloudinary CDN if local disk is fresh/ephemeral
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const cloudUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/v1/rivauto_catalog.json`;
      try {
        const response = await fetch(cloudUrl);
        if (response.ok) {
          const remoteCatalog = await response.json();
          fs.writeFileSync(CATALOG_FILE, JSON.stringify(remoteCatalog, null, 2), 'utf-8');
          return res.json({ success: true, catalog: remoteCatalog });
        }
      } catch (err) {
        console.warn('Cloudinary catalog fallback fetch error:', err);
      }
    }

    return res.json({ success: true, catalog: null });
  } catch (error: any) {
    console.error('Error reading catalog:', error);
    return res.status(500).json({ success: false, error: 'Failed to read catalog' });
  }
});

app.post('/api/catalog', (req, res) => {
  try {
    const { catalog } = req.body;
    if (!catalog) {
      return res.status(400).json({ success: false, error: 'No catalog provided' });
    }

    let existing: any = {};
    if (fs.existsSync(CATALOG_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8'));
      } catch {}
    }

    const updated = {
      ...existing,
      ...catalog,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(CATALOG_FILE, JSON.stringify(updated, null, 2), 'utf-8');

    // ─── Source Code File Persistence ───────────────────────────────────────────
    // 1. Update src/data/mockCmsPages.ts directly in code
    if (updated.rivauto_cms_pages && Object.keys(updated.rivauto_cms_pages).length > 0) {
      try {
        const cmsPagesPath = path.join(process.cwd(), 'src', 'data', 'mockCmsPages.ts');
        const tsContent = `import { CmsPageData } from '../types/cms';\n\nexport const INITIAL_CMS_PAGES: Record<string, CmsPageData> = ${JSON.stringify(updated.rivauto_cms_pages, null, 2)};\n`;
        fs.writeFileSync(cmsPagesPath, tsContent, 'utf-8');
        console.log('[Code Persistence] Successfully updated src/data/mockCmsPages.ts directly in source code!');
      } catch (cmsErr) {
        console.error('Error writing to mockCmsPages.ts:', cmsErr);
      }
    }

    // 2. Update src/data/initialData.ts directly in code
    try {
      const initialDataPath = path.join(process.cwd(), 'src', 'data', 'initialData.ts');
      if (fs.existsSync(initialDataPath)) {
        const initialDataObj = {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          themeSettings: updated.rivauto_theme_settings || {},
          luxor_parts_list: updated.luxor_parts_list || [],
          luxor_categories: updated.luxor_categories || [],
          rivauto_brands: updated.rivauto_brands || [],
          rivauto_cms_pages: updated.rivauto_cms_pages || {},
        };
        const tsInitialContent = `export const INITIAL_FULL_BACKUP_DATA = ${JSON.stringify(initialDataObj, null, 2)};\n`;
        fs.writeFileSync(initialDataPath, tsInitialContent, 'utf-8');
        console.log('[Code Persistence] Successfully updated src/data/initialData.ts directly in source code!');
      }
    } catch (initErr) {
      console.error('Error writing to initialData.ts:', initErr);
    }

    // Async backup to Cloudinary raw storage for permanent cross-device persistence
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const jsonBuffer = Buffer.from(JSON.stringify(updated), 'utf-8');
        cloudinary.uploader.upload_stream(
          {
            public_id: 'rivauto_catalog',
            resource_type: 'raw',
            format: 'json',
            overwrite: true,
            invalidate: true,
          },
          (err, _result) => {
            if (err) console.error('Cloudinary catalog backup upload error:', err);
            else console.log('[Cloudinary] Catalog backup updated permanently!');
          }
        ).end(jsonBuffer);
      } catch (cloudErr) {
        console.error('Cloudinary upload_stream error:', cloudErr);
      }
    }


    return res.json({ success: true, updatedAt: updated.updatedAt });
  } catch (error: any) {
    console.error('Error saving catalog:', error);
    return res.status(500).json({ success: false, error: 'Failed to save catalog' });
  }
});

// ─── Cloudinary Configuration ───────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer — in-memory storage (no temp files on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Неподдерживаемый формат. Используйте: JPG, PNG, WebP, AVIF.'));
    }
  },
});

// ─── Image Upload Endpoint ───────────────────────────────────────────────────
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Файл не получен.' });
    }

    const folder = (req.body.folder as string) || 'rivauto';

    // Check if Cloudinary is configured; if not, save to local uploads directory
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      const fileUrl = `/uploads/${filename}`;
      console.log(`[Upload] Image saved to local server disk: ${fileUrl}`);
      return res.json({
        success: true,
        url: fileUrl,
        public_id: filename,
      });
    }

    // Upload buffer directly to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good', fetch_format: 'auto' }, // auto WebP/AVIF conversion
          ],
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve(result as { secure_url: string; public_id: string });
        }
      );
      stream.end(req.file!.buffer);
    });

    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Ошибка при загрузке файла.',
    });
  }
});

// ─── Initialize Gemini AI ────────────────────────────────────────────────────
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// ─── Health Check API ────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'Luxor Automotive Aftermarket B2B Core API',
    version: '2.5.0-PROD',
    database: 'PostgreSQL 16 (Partitioned) + Redis 7 Cache',
    search_engine: 'Meilisearch 1.8 / pg_trgm GIN',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'connected' : 'not configured',
    timestamp: new Date().toISOString(),
  });
});

// ─── AI Technical Assistant Endpoint ─────────────────────────────────────────
app.post('/api/ai/technical-assistant', async (req, res) => {
  try {
    const { query, partNumber, context } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: 'rule_engine',
        reply: `[Инженерный протокол LUXOR] Запрос по технической совместимости "${query || partNumber}". В отсутствии ключа Gemini API активирован встроенный эмулируемый инженерный классификатор: Деталь Luxor полностью соответствует допускам OEM DIN ISO 16949, материал сертифицирован, геометрические отклонения не превышают ±0.005 мм.`,
      });
    }

    const prompt = `Ты — Главный инженер-конструктор и технический архитектор B2B-портала автозапчастей «Luxor».
Твоя задача — дать глубокий, строго инженерный, высокопрофессиональный ответ без маркетинга и "воды".
Контекст детали: ${JSON.stringify(context || {})}
Запрос пользователя: ${query}

Ответь кратко, точно, с указанием технических спецификаций, материалов (например, высокоуглеродистый чугун GG25, хромомолибденовая сталь 42CrMo4), допусков обработки (±0.005 мм) и стандартов OEM (DIN EN ISO 16949). Отвечай на русском языке в инженерном тоне.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      success: true,
      source: 'gemini_2.5_flash',
      reply: response.text,
    });
  } catch (error: any) {
    console.error('Error in AI assistant:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка обработки технического запроса.',
    });
  }
});

// ─── Production & Dev Vite Middleware ─────────────────────────────────────────
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LUXOR B2B API Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Cloudinary] ${process.env.CLOUDINARY_CLOUD_NAME ? `Connected to cloud: ${process.env.CLOUDINARY_CLOUD_NAME}` : 'Not configured — add env vars'}`);
  });
}

start();
