import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file, image, folder } = req.body || {};
    const base64Data = file || image;

    if (!base64Data) {
      return res.status(400).json({ success: false, error: 'Файл или изображение не передано.' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      // Return error if Cloudinary env vars not set in Vercel
      return res.status(503).json({
        success: false,
        error: 'Cloudinary не настроен на Vercel. Добавьте CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET в Environment Variables Vercel.',
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const uploadFolder = folder || 'rivauto_categories';
    const strToSign = `folder=${uploadFolder}&timestamp=${timestamp}${apiSecret}`;

    // SHA-1 signature
    const encoder = new TextEncoder();
    const data = encoder.encode(strToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new URLSearchParams();
    formData.append('file', base64Data);
    formData.append('folder', uploadFolder);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const cloudJson = await cloudRes.json();

    if (!cloudRes.ok) {
      console.error('Cloudinary upload error response:', cloudJson);
      return res.status(500).json({ success: false, error: cloudJson.error?.message || 'Ошибка загрузки в облако.' });
    }

    return res.status(200).json({
      success: true,
      url: cloudJson.secure_url,
      public_id: cloudJson.public_id,
    });
  } catch (err: any) {
    console.error('Upload serverless handler error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Ошибка обработки файла' });
  }
}
