// netlify/functions/contact.js
// Netlify serverless function to handle contact form submissions

const nodemailer = require('nodemailer');

// Simple email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());
}

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, message } = body;

    // Validation
    const errors = {};
    
    const nm = String(name || '').trim();
    const em = String(email || '').trim();
    const msg = String(message || '').trim();

    if (!nm) errors.name = 'required';
    if (!em) errors.email = 'required';
    if (em && !isValidEmail(em)) errors.email = 'emailInvalid';
    if (!msg || msg.length < 3) errors.message = 'tooShort';
    if (msg.length > 5000) errors.message = 'tooLong';

    if (Object.keys(errors).length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ errors }),
      };
    }

    // Get SMTP credentials from environment variables
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpSecure = process.env.SMTP_SECURE !== 'false';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactReceiver = process.env.CONTACT_RECEIVER || 'hello@abdulhaqdimensions.com';

    // If no SMTP credentials, return success stub (for testing)
    if (!smtpUser || !smtpPass) {
      console.warn('[contact] No SMTP credentials configured. Returning stub response.');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Message received (SMTP not configured)' 
        }),
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Build email content
    const htmlContent = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${nm}</p>
      <p><strong>Email:</strong> <a href="mailto:${em}">${em}</a></p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; word-wrap: break-word;">${msg.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Abdulhaq Dimensions Website" <${smtpUser}>`,
      to: contactReceiver,
      subject: `New Contact Message from ${nm}`,
      text: `From: ${nm}\nEmail: ${em}\n\nMessage:\n${msg}`,
      html: htmlContent,
    });

    console.log('[contact] Email sent:', info.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully' 
      }),
    };
  } catch (error) {
    console.error('[contact] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'serverError', 
        message: 'Failed to send message. Please try again later.' 
      }),
    };
  }
};
