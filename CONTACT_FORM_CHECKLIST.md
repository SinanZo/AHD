# Contact Form Implementation Checklist

## Frontend (✅ Complete)
- [x] ContactPage.tsx component created with form validation
- [x] Success/error state handling with styled alerts
- [x] Loading spinner during submission
- [x] Full i18n support (contact namespace)
- [x] RTL/LTR support
- [x] Google Maps embed integrated
- [x] Contact details (phone, email, address)
- [x] Proper accessibility attributes
- [x] Route integrated in App.tsx

## Backend (✅ Complete)
- [x] POST /api/contact endpoint implemented
- [x] Input validation (name, email, message)
- [x] Email format verification
- [x] Message length validation (3-5000 chars)
- [x] Built-in rate limiting (5 req/min per IP)
- [x] Nodemailer integration
- [x] HTML email template with styling
- [x] XSS prevention in email content
- [x] CORS enabled
- [x] Error handling with appropriate status codes
- [x] Console logging for debugging
- [x] Dev mode stub response (when no email creds)

## Configuration (📋 To Do)

### 1. Environment Variables
Create `server/.env`:
```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password

# Receiver Configuration
CONTACT_RECEIVER=info@abdulhaqdimensions.com

# Server
NODE_ENV=development
PORT=5000
```

### 2. Install Dependencies (if needed)
```bash
cd server
pnpm install nodemailer
```

### 3. Gmail Setup (for testing)
- [ ] Enable 2FA on Google Account
- [ ] Go to myaccount.google.com/apppasswords
- [ ] Generate app password for Mail
- [ ] Add to `.env` as `SMTP_PASS`

### 4. Vite Proxy (optional - simplifies frontend URL)
Add to `client/vite.config.ts` if needed:
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

### 5. Frontend .env (if using absolute URLs)
`client/.env`:
```
VITE_API_URL=http://localhost:5000
```

Then use in ContactPage.tsx:
```typescript
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, ...)
```

## Testing Workflow

1. **Terminal 1 - Backend:**
   ```bash
   cd server
   pnpm dev
   ```
   Expected: `[server] Server successfully running on port 5000`

2. **Terminal 2 - Frontend:**
   ```bash
   cd client
   pnpm dev
   ```
   Expected: `Vite running at http://localhost:5173`

3. **Test Form:**
   - Navigate to http://localhost:5173/contact
   - Fill in test data
   - Submit form
   - Verify success message

4. **Check Email:**
   - Look for email in `CONTACT_RECEIVER` inbox
   - Verify HTML formatting
   - Confirm sender is correct

## Debugging Tips

### Check server is running
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

### Check SMTP connection
```bash
# Backend console should show:
# [contact] Email sent: <message-id>
```

### Rate limiting test
Submit form 6 times rapidly - 6th should return 429 error

### Dev mode stub response
If no SMTP creds set, form submits successfully but no email sends (console shows warning)

## Production Checklist

- [ ] Switch to transactional email service (SendGrid, Mailgun, AWS SES)
- [ ] Set `NODE_ENV=production` to enable rate limiting
- [ ] Configure CONTACT_RECEIVER for your business email
- [ ] Test with real email addresses
- [ ] Set up email monitoring/alerts
- [ ] Add reCAPTCHA to frontend form (optional, advanced)
- [ ] Enable HTTPS on production
- [ ] Update CORS if frontend on different domain
- [ ] Set up rate limiting with Redis for distributed apps (optional)

## Files Created/Modified

**Created:**
- `server/src/app.ts` - Enhanced with contact endpoint
- `client/src/pages/ContactPage.tsx` - New contact page component
- `CONTACT_FORM_SETUP.md` - Setup documentation
- `server/utils/sendEmail.js` - Email utility (optional, for modular structure)
- `server/controllers/contactController.js` - Controller pattern (optional)
- `server/routes/contactRoutes.js` - Routes module (optional)

**Modified:**
- `client/src/App.tsx` - Added ContactPage route

## Support References

- [Nodemailer Docs](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Express CORS](https://github.com/expressjs/cors)
- [Form Validation Best Practices](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)

---

**Status:** ✅ Ready for testing
**Last Updated:** 2025-12-04
