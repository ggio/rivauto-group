import type { VercelRequest, VercelResponse } from '@vercel/node';

let catalogMemoryCache: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // 1. Check memory cache first
    if (catalogMemoryCache && Object.keys(catalogMemoryCache).length > 0) {
      return res.status(200).json({ success: true, catalog: catalogMemoryCache });
    }

    // 2. Fallback to Cloudinary CDN raw storage backup
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (cloudName) {
      try {
        const cloudUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/v1/rivauto_catalog.json`;
        const response = await fetch(cloudUrl);
        if (response.ok) {
          const remoteCatalog = await response.json();
          catalogMemoryCache = remoteCatalog;
          return res.status(200).json({ success: true, catalog: remoteCatalog });
        }
      } catch (err) {
        console.warn('Cloudinary catalog fetch error:', err);
      }
    }

    return res.status(200).json({ success: true, catalog: null });
  }

  if (req.method === 'POST') {
    try {
      const { catalog } = req.body || {};
      if (!catalog) {
        return res.status(400).json({ success: false, error: 'No catalog provided' });
      }

      catalogMemoryCache = {
        ...catalogMemoryCache,
        ...catalog,
        updatedAt: new Date().toISOString(),
      };

      // Async upload to Cloudinary for cross-device global sync
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (cloudName && apiKey && apiSecret) {
        try {
          const timestamp = Math.floor(Date.now() / 1000);
          const strToSign = `format=json&invalidate=true&overwrite=true&public_id=rivauto_catalog&timestamp=${timestamp}${apiSecret}`;
          
          // Simple crypto signature using Web Crypto API
          const encoder = new TextEncoder();
          const data = encoder.encode(strToSign);
          const hashBuffer = await crypto.subtle.digest('SHA-1', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

          const formData = new URLSearchParams();
          formData.append('file', `data:application/json;base64,${Buffer.from(JSON.stringify(catalogMemoryCache)).toString('base64')}`);
          formData.append('public_id', 'rivauto_catalog');
          formData.append('format', 'json');
          formData.append('overwrite', 'true');
          formData.append('invalidate', 'true');
          formData.append('api_key', apiKey);
          formData.append('timestamp', timestamp.toString());
          formData.append('signature', signature);

          fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
            method: 'POST',
            body: formData,
          }).catch(cloudErr => console.error('Cloudinary sync error:', cloudErr));
        } catch (err) {
          console.error('Error creating Cloudinary signature:', err);
        }
      }

      return res.status(200).json({ success: true, catalog: catalogMemoryCache });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to update catalog' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
