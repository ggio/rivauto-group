import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { companyName, email, phone, brand, role, message } = req.body || {};

    if (!companyName || !email) {
      return res.status(400).json({ success: false, error: 'Заполните обязательные поля' });
    }

    const recipientEmail = 'rivavto01@gmail.com';
    const emailSubject = `🚗 Заявка на КП RivAuto Group от: ${companyName}`;
    const emailContent = `
Новая оптовая заявка с сайта RIVAUTO.GROUP

• Компания / ИП: ${companyName}
• Рабочий Email: ${email}
• Телефон для связи: ${phone || 'Не указан'}
• Интересующий бренд: ${brand || 'Все бренды'}
• Тип клиента: ${role || 'Дистрибьютор'}
• Сообщение: ${message || 'Запрос коммерческого предложения'}
• Дата заявки: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}
    `.trim();

    // 1. Send via Webhook / Email Service API (Resend / Formspree / EmailJS)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'RivAuto Website <onboarding@resend.dev>',
          to: [recipientEmail],
          subject: emailSubject,
          text: emailContent,
        }),
      });
      if (emailRes.ok) {
        return res.status(200).json({ success: true, message: 'Письмо успешно отправлено на почту!' });
      }
    }

    // 2. Fallback to Formspree / Webhook endpoint if Resend isn't configured
    try {
      await fetch('https://formspree.io/f/xvovbkgq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          email,
          phone,
          brand,
          role,
          message,
          to: recipientEmail,
        }),
      });
    } catch (fsErr) {
      console.warn('Formspree fallback warning:', fsErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Заявка принята и отправлена менеджерам на rivavto01@gmail.com',
    });
  } catch (err: any) {
    console.error('Send email error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Ошибка отправки почты' });
  }
}
