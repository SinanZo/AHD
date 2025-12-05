// server/src/app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

// Simple rate limiter implementation (until express-rate-limit is installed)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function simpleRateLimit(windowMs: number = 60000, max: number = 5) {
  return (req: Request, res: Response, next: () => void) => {
    if (process.env.NODE_ENV === 'development') {
      return next(); // Skip in dev
    }

    const ip = req.ip || 'unknown';
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      // Reset or create new record
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({ 
        error: 'rateLimited',
        message: 'Too many contact form submissions. Please try again later.' 
      });
    }

    record.count++;
    next();
  };
}

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: allowedOrigins.length ? allowedOrigins : true,
    })
  );
  app.use(express.json());

  // Simple health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Contact form endpoint
  app.post('/api/contact', simpleRateLimit(60000, 5), async (req: Request, res: Response) => {
    try {
      const { name, email, message } = req.body || {};
      const nm = String(name || '').trim();
      const em = String(email || '').trim();
      const msg = String(message || '').trim();

      // Validation
      const errors: Record<string, string> = {};
      if (!nm) errors.name = 'required';
      if (!em) errors.email = 'required';
      
      // RFC-lite email check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (em && !emailRegex.test(em)) errors.email = 'emailInvalid';
      
      if (!msg || msg.length < 3) errors.message = 'tooShort';
      if (msg.length > 5000) errors.message = 'tooLong';

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      // If email creds are missing, return success stub for development
      const user = process.env.EMAIL_USER || process.env.SMTP_USER;
      const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = Number(process.env.SMTP_PORT) || 465;
      const smtpSecure = process.env.SMTP_SECURE !== 'false'; // default true

      // In development, avoid real SMTP sending to reduce friction
      if ((process.env.NODE_ENV || 'development') === 'development') {
        console.warn('[contact] Development mode: skipping real email send.');
        return res.json({ success: true, message: 'Message accepted (dev mode).' });
      }

      if (!user || !pass) {
        console.warn('[contact] Email credentials missing. Stub response.');
        return res.json({ success: true, message: 'Message accepted (no SMTP creds).' });
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: { user, pass },
      });

      const contactReceiver = process.env.CONTACT_RECEIVER || user;
      const htmlContent = `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${nm}</p>
        <p><strong>Email:</strong> <a href="mailto:${em}">${em}</a></p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; word-wrap: break-word;">${msg.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      `;

      const info = await transporter.sendMail({
        from: `"Abdulhaq Dimensions Website" <${user}>`,
        to: contactReceiver,
        subject: `New Contact Message from ${nm}`,
        text: `From: ${nm}\nEmail: ${em}\n\nMessage:\n${msg}`,
        html: htmlContent,
      });

      if (info && info.messageId) {
        console.log(`[contact] Email sent: ${info.messageId}`);
        return res.json({ success: true, message: 'Message sent successfully.' });
      }
      
      return res.status(500).json({ error: 'sendFailed', message: 'Failed to send email.' });
    } catch (err) {
      console.error('[contact] Error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      return res.status(500).json({ error: 'serverError', message });
    }
  });

  return app;
}
