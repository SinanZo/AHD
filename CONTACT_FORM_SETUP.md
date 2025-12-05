# Contact Form Backend Setup Guide

## ✅ What's Already Done

Your backend Express server (`server/src/app.ts`) now includes:

- **POST /api/contact endpoint** with built-in validation
- **Rate limiting** (5 requests per IP per minute, skipped in dev)
- **Email sending** via Nodemailer
- **HTML email template** with styled content
- **Error handling** with appropriate status codes
- **Environment-based configuration**

## 📋 Setup Steps

### 1️⃣ Install Dependencies (if not already installed)

```bash
# From the server folder
cd server
pnpm add nodemailer
# or
npm install nodemailer
```

If you want to use proper rate limiting (optional):
```bash
pnpm add express-rate-limit @types/express-rate-limit
```

### 2️⃣ Configure Environment Variables

Create or update `.env` in your **server root** folder:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Gmail requires an App Password (not your regular password)
# 1. Enable 2FA on your Google Account
# 2. Go to myaccount.google.com/apppasswords
# 3. Select "Mail" and "Windows Computer"
# 4. Copy the generated 16-character password and paste below
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password

# Sender and Receiver Configuration
SMTP_FROM="Abdulhaq Dimensions <no-reply@abdulhaqdimensions.com>"
CONTACT_RECEIVER=info@abdulhaqdimensions.com

# Server Configuration
NODE_ENV=development
PORT=5000
```

### 3️⃣ Update Frontend API Endpoint

If your frontend dev server is running on a different port (e.g., Vite on 5173 while backend is 5000), update the fetch URL in `client/src/pages/ContactPage.tsx`:

```typescript
// Option 1: If backend runs on same localhost, adjust port
const res = await fetch('http://localhost:5000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});

// Option 2: Or proxy through Vite (vite.config.ts)
// See vite.config.ts proxy configuration below
```

### 4️⃣ (Optional) Vite Proxy Configuration

If you want to use `/api/contact` without specifying the full URL, add to `client/vite.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});
```

Then in frontend:
```typescript
const res = await fetch('/api/contact', { ... });
```

### 5️⃣ Run Both Servers

**Terminal 1 (Backend):**
```bash
cd server
pnpm dev
# Output: [server] Server successfully running on port 5000
```

**Terminal 2 (Frontend):**
```bash
cd client
pnpm dev
# Output: Vite running at http://localhost:5173
```

### 6️⃣ Test the Contact Form

1. Navigate to http://localhost:5173/contact
2. Fill in the form with test data
3. Submit the form
4. Check:
   - ✅ Success message appears on form
   - ✅ Form clears
   - ✅ Email received in your inbox

## 🔧 Troubleshooting

### "Email credentials missing" message
- **Cause:** `SMTP_USER` and `SMTP_PASS` not set in `.env`
- **Fix:** Add them to `.env` and restart server
- **Dev Mode:** The form will still show success but email won't actually send

### Gmail authentication fails
- **Common Issue:** Using your regular Google password instead of App Password
- **Fix:** 
  1. Go to https://myaccount.google.com/apppasswords
  2. Make sure 2FA is enabled
  3. Generate a new app-specific password for Mail
  4. Use that 16-character password in `.env`

### CORS errors from frontend
- **Cause:** Frontend and backend on different origins
- **Fix:** Backend already has `cors()` middleware enabled. If still getting CORS errors:
  ```typescript
  // In server/src/app.ts
  app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
  }));
  ```

### Rate limiting too strict
- **Cause:** Testing repeatedly from same IP
- **Fix:** Rate limiting is skipped in development mode (NODE_ENV=development)
- **Prod Mode:** Set `NODE_ENV=production` to enable rate limiting (5 requests/min per IP)

## 📧 Production Email Setup

For production, use a transactional email service instead of Gmail:

### Option 1: SendGrid SMTP
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

### Option 2: Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.com
SMTP_PASS=your_mailgun_password
```

### Option 3: AWS SES
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_ses_username
SMTP_PASS=your_ses_password
```

## 📝 Response Format

### Success (200)
```json
{
  "success": true,
  "message": "Message sent successfully."
}
```

### Validation Error (400)
```json
{
  "errors": {
    "name": "required",
    "email": "emailInvalid",
    "message": "tooLong"
  }
}
```

### Rate Limited (429)
```json
{
  "error": "rateLimited",
  "message": "Too many contact form submissions. Please try again later."
}
```

### Server Error (500)
```json
{
  "error": "serverError",
  "message": "Something went wrong. Please try again later."
}
```

## ✨ Features Included

- ✅ Form validation (name, email, message)
- ✅ Email format verification
- ✅ Message length limits (3-5000 characters)
- ✅ HTML email template
- ✅ Rate limiting (5/minute per IP)
- ✅ Security: XSS prevention in HTML content
- ✅ CORS enabled for frontend communication
- ✅ Detailed error messages for debugging
- ✅ Console logging for email tracking
- ✅ Dev mode bypass for testing without email

## 🚀 You're All Set!

Your contact form is now fully wired end-to-end. Test it out and adjust as needed!
