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
}

module.exports = sendEmail;
