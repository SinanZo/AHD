// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html, text }) {
  if (!fromEmail) {
    throw new Error('SMTP_FROM or SMTP_USER must be defined in .env');
  }

  try {
    const info = await transporter.sendMail({
      from: `"Abdulhaq Dimensions Website" <${fromEmail}>`,
      to,
      subject,
      text,
      html,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('✉️  Email sent:', info.messageId);
    }

    return info;
  } catch (err) {
    // In non-production/dev environments, fall back to logging the email to a local file
    if (process.env.NODE_ENV !== 'production') {
      const fs = require('fs');
      const path = require('path');
      const out = {
        timestamp: new Date().toISOString(),
        to,
        subject,
        text,
        html,
        error: String(err),
      };
      const logPath = path.join(__dirname, '..', 'emails.log');
      try {
        fs.appendFileSync(logPath, JSON.stringify(out) + '\n');
        console.log(`✉️  Email write fallback: saved to ${logPath}`);
      } catch (fsErr) {
        console.error('Failed to write fallback email log:', fsErr);
      }

      // Return a stub info object to satisfy callers
      return { messageId: 'local-fallback-' + Date.now(), accepted: [to] };
    }

    // In production, rethrow so upstream can handle/report
    throw err;
  }
}

module.exports = sendEmail;
