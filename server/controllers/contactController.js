// server/controllers/contactController.js
const sendEmail = require('../utils/sendEmail');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

exports.handleContact = async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    // Very simple length guard
    if (message.length > 5000) {
      return res
        .status(400)
        .json({ message: 'Message is too long (max 5000 characters).' });
    }

    // Build email content
    const subject = `New Contact Message from ${name}`;
    const plainText = `
From: ${name}
Email: ${email}

Message:
${message}
    `.trim();

    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; word-wrap: break-word;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    `;

    await sendEmail({
      to: process.env.CONTACT_RECEIVER || 'info@abdulhaqdimensions.com',
      subject,
      text: plainText,
      html,
    });

    return res.status(200).json({
      message: 'Message sent successfully.',
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return res
      .status(500)
      .json({ message: 'Something went wrong. Please try again later.' });
  }
};
