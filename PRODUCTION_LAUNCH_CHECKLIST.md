# Pretty Party Sweets - Production Launch Checklist

## Phase 1: Database Migration (SQLite → PostgreSQL)

### 1.1 Set Up PostgreSQL Database
- [ ] Choose hosting provider:
  - **Vercel Postgres** (easiest, recommended)
  - **Supabase** (free tier available)
  - **Neon** (free tier, serverless)
  - **Railway** (easy setup)
  - **AWS RDS** (enterprise)
- [ ] Create PostgreSQL database
- [ ] Get connection string
- [ ] Test connection locally

### 1.2 Migrate Data
```bash
# 1. Update .env with PostgreSQL URL
DATABASE_URL="postgresql://user:password@host:5432/pretty_party_sweets?schema=public"

# 2. Generate new Prisma client
npx prisma generate

# 3. Push schema to PostgreSQL
npx prisma db push

# 4. (Optional) Migrate existing SQLite data
# Use a migration tool or manual export/import
```

### 1.3 Verify Migration
- [ ] Test all API routes
- [ ] Verify data persistence
- [ ] Check admin panel works
- [ ] Test form submissions

---

## Phase 2: Environment Variables

### 2.1 Production .env
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/pretty_party_sweets?schema=public"

# NextAuth - Generate secure secret
NEXTAUTH_SECRET="<run: openssl rand -base64 32>"
NEXTAUTH_URL="https://yourdomain.com"

# Site URL
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Email (Resend)
RESEND_API_KEY="re_your_actual_api_key"
EMAIL_FROM="hello@yourdomain.com"

# Admin Credentials (CHANGE THESE!)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="<secure_password>"

# (Optional) Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

### 2.2 Security Checklist
- [ ] Generate new NEXTAUTH_SECRET
- [ ] Change admin password to strong password
- [ ] Use production Resend API key
- [ ] Remove all development keys
- [ ] Never commit .env to Git

---

## Phase 3: Deploy to Vercel (Recommended)

### 3.1 Prepare Repository
```bash
# 1. Initialize Git (if not done)
git init
git add .
git commit -m "Initial commit - Pretty Party Sweets"

# 2. Create GitHub repository
# Go to GitHub → New Repo → Follow instructions

# 3. Push to GitHub
git remote add origin <your-repo-url>
git push -u origin main
```

### 3.2 Deploy on Vercel
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy (preview)
vercel

# 4. Deploy to production
vercel --prod
```

### 3.3 Vercel Dashboard Setup
- [ ] Import project from GitHub
- [ ] Set framework preset to Next.js
- [ ] Add all environment variables
- [ ] Set Node version to 18+
- [ ] Enable automatic deployments

### 3.4 Connect Custom Domain
- [ ] Go to Vercel → Settings → Domains
- [ ] Add your domain (yourdomain.com)
- [ ] Update DNS records:
  - Type: A or CNAME
  - Value: Provided by Vercel
- [ ] Wait for SSL certificate (auto-enabled)
- [ ] Test HTTPS

---

## Phase 4: Email Notifications (Resend)

### 4.1 Setup Resend
```bash
# 1. Sign up at https://resend.com
# 2. Get API key from dashboard
# 3. Verify your domain in Resend
# 4. Add DNS records for email authentication
```

### 4.2 Install Dependencies
```bash
npm install resend
```

### 4.3 Create Email Service
Create: `src/lib/email.ts`
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  return resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
    to,
    subject,
    html,
  })
}
```

### 4.4 Email Templates to Build
- [ ] `src/emails/inquiry-received.ts` - Owner notification
- [ ] `src/emails/contact-received.ts` - Owner notification
- [ ] `src/emails/booking-received.ts` - Owner notification
- [ ] `src/emails/booking-confirmed.ts` - Client confirmation
- [ ] `src/emails/booking-declined.ts` - Client notification
- [ ] `src/emails/payment-received.ts` - Receipt

### 4.5 Wire to API Routes
- [ ] Update `/api/inquiry` to send emails
- [ ] Update `/api/contact` to send emails
- [ ] Update `/api/booking` to send emails
- [ ] Update `/api/admin/bookings/[id]` to send status emails

---

## Phase 5: Security Hardening

### 5.1 Admin Authentication
- [ ] Implement proper password hashing (bcrypt)
- [ ] Add session management
- [ ] Set secure cookie flags
- [ ] Add session expiry (24 hours)
- [ ] Implement logout functionality

### 5.2 Route Protection
- [ ] Add middleware to protect `/admin/*` routes
- [ ] Verify authentication on server-side
- [ ] Redirect unauthenticated users to login
- [ ] Add rate limiting to login endpoint

### 5.3 API Security
- [ ] Add CORS configuration
- [ ] Implement rate limiting on forms
- [ ] Add CSRF protection
- [ ] Validate all inputs (already done with Zod ✅)
- [ ] Sanitize HTML outputs

### 5.4 Headers & SSL
- [ ] Enable HTTPS (automatic on Vercel ✅)
- [ ] Add security headers:
  ```typescript
  // next.config.js
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  }
  ```

---

## Phase 6: Full QA Testing

### 6.1 Public Site Tests
- [ ] Home page loads correctly
- [ ] All navigation links work
- [ ] All forms submit successfully
- [ ] Success messages display
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop layout correct

### 6.2 Booking Flow Tests
- [ ] Create booking → saves to DB
- [ ] Receive booking reference
- [ ] Lookup booking → shows correct data
- [ ] Status updates work
- [ ] Payment status updates

### 6.3 Admin Tests
- [ ] Login with credentials
- [ ] View dashboard stats
- [ ] View leads list
- [ ] Filter leads
- [ ] Export leads CSV
- [ ] View bookings list
- [ ] Approve booking
- [ ] Decline booking
- [ ] Mark payment received
- [ ] View booking timeline
- [ ] Add admin notes
- [ ] Export bookings CSV
- [ ] Moderate reviews
- [ ] Logout works

### 6.4 Edge Cases
- [ ] Submit form with empty fields
- [ ] Submit invalid email
- [ ] Submit past event date
- [ ] Lookup non-existent booking
- [ ] Wrong admin credentials
- [ ] Network error handling

---

## Phase 7: Monitoring & Backups

### 7.1 Error Monitoring
- [ ] Sign up for Sentry (https://sentry.io)
- [ ] Install: `npm install @sentry/nextjs`
- [ ] Configure Sentry in Next.js
- [ ] Test error capture

### 7.2 Analytics
- [ ] Set up Google Analytics or Plausible
- [ ] Add tracking code to layout.tsx
- [ ] Verify tracking works

### 7.3 Database Backups
```bash
# PostgreSQL backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql

# Set up automated daily backups
# Vercel Postgres: automatic backups
# Supabase: automatic backups
# Self-hosted: cron job
```

### 7.4 Backup Testing
- [ ] Export database
- [ ] Test restore procedure
- [ ] Verify data integrity
- [ ] Document restore steps

---

## Phase 8: Payment Integration (Stripe)

### 8.1 Setup Stripe
- [ ] Create Stripe account
- [ ] Get API keys
- [ ] Add to .env:
  ```env
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_PUBLISHABLE_KEY=pk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

### 8.2 Install Stripe
```bash
npm install @stripe/stripe-js stripe
```

### 8.3 Build Payment Flow
- [ ] Create `/api/payment/create-session`
- [ ] Create `/api/payment/webhook`
- [ ] Add payment button to booking confirmation
- [ ] Create payment success page
- [ ] Update booking status on payment
- [ ] Send receipt email

---

## Phase 9: Final Launch Checks

### 9.1 Pre-Launch
- [ ] All environment variables set
- [ ] Database migrated to PostgreSQL
- [ ] Email notifications working
- [ ] Admin security verified
- [ ] All tests passing
- [ ] Backups configured
- [ ] Analytics tracking
- [ ] Domain connected
- [ ] SSL active

### 9.2 Launch Day
- [ ] Final production build test
- [ ] Deploy to production
- [ ] Test all critical flows
- [ ] Monitor error logs
- [ ] Check email delivery
- [ ] Verify database persistence

### 9.3 Post-Launch
- [ ] Monitor for 24 hours
- [ ] Check error logs regularly
- [ ] Test admin daily
- [ ] Verify backups running
- [ ] Collect user feedback

---

## Quick Deploy Commands

```bash
# 1. Build test
npm run build

# 2. Start production server
npm start

# 3. Deploy to Vercel
vercel --prod

# 4. Check deployment
vercel ls

# 5. View logs
vercel logs
```

---

## Production URLs Template

- **Public Site**: https://yourdomain.com
- **Admin Panel**: https://yourdomain.com/admin/login
- **Booking Page**: https://yourdomain.com/booking
- **Inquiry Page**: https://yourdomain.com/inquire
- **Contact Page**: https://yourdomain.com/contact

---

## Estimated Timeline

1. **Database Migration**: 1-2 hours
2. **Vercel Deployment**: 1 hour
3. **Email Setup**: 2-3 hours
4. **Security Hardening**: 2 hours
5. **QA Testing**: 3-4 hours
6. **Monitoring Setup**: 1 hour
7. **Final Launch**: 1 hour

**Total: ~12-15 hours to production**

---

## Next Immediate Steps

**Start with these 3 tasks:**

1. **Set up PostgreSQL database** (Supabase or Vercel Postgres)
2. **Deploy to Vercel** (preview first, then production)
3. **Add email notifications** (Resend integration)

After that, everything else is polish and enhancements!
