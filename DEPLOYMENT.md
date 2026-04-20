# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration

#### Generate Secure Secrets
```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate admin password hash
npx ts-node scripts/generate-password-hash.ts your_secure_password
```

#### Update .env.production
- [ ] Set `DATABASE_URL` to your PostgreSQL connection string
- [ ] Set `NEXTAUTH_SECRET` to a secure 32+ character random string
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Set `RESEND_API_KEY` with your actual Resend API key
- [ ] Set `EMAIL_FROM` to your verified sender email
- [ ] Set `ADMIN_EMAIL` to your admin email
- [ ] Set `ADMIN_PASSWORD_HASH` (remove ADMIN_PASSWORD line)

### 2. Database Migration (SQLite → PostgreSQL)

#### Option A: Fresh Start (Recommended for new deployments)
```bash
# 1. Switch to PostgreSQL schema
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# 2. Install PostgreSQL dependencies
npm install @prisma/client

# 3. Deploy migrations
npx prisma migrate deploy

# 4. Generate client
npx prisma generate
```

#### Option B: Data Migration (If you have existing data)
```bash
# 1. Export SQLite data
npx prisma db pull --schema=prisma/schema.sqlite.prisma

# 2. Transform and import to PostgreSQL
# Use a tool like pgloader or custom script

# 3. Deploy schema
npx prisma migrate deploy
```

### 3. Security Verification

#### Admin Authentication
- [ ] Password is hashed with bcrypt (12 rounds)
- [ ] ADMIN_PASSWORD is removed from .env
- [ ] Only ADMIN_PASSWORD_HASH is present
- [ ] Admin email is not a common/default email

#### Session Security
- [ ] Session cookies are httpOnly
- [ ] Session cookies use secure flag in production
- [ ] Session cookies use sameSite=strict
- [ ] Session duration is 24 hours
- [ ] Rate limiting is enabled (5 attempts per 15 min)

#### API Security
- [ ] All admin API routes are protected by middleware
- [ ] Input validation with Zod on all mutations
- [ ] Rate limiting on login endpoints
- [ ] CSRF protection via sameSite cookies

#### Security Headers
The following headers are automatically set by middleware:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`

### 4. File Upload Safety

#### Gallery/Package Images
- [ ] Images are validated (type: jpg, png, webp)
- [ ] Images are validated (size: max 5MB)
- [ ] Images are stored on external service (UploadThing)
- [ ] URLs are validated before storage
- [ ] No local file storage for user uploads

### 5. Email Configuration

#### Resend Setup
- [ ] Domain is verified in Resend
- [ ] API key has proper permissions
- [ ] FROM email is verified
- [ ] Test email sent successfully

### 6. Build & Deploy

```bash
# 1. Install dependencies
npm ci

# 2. Run database migrations
npx prisma migrate deploy

# 3. Generate Prisma client
npx prisma generate

# 4. Build application
npm run build

# 5. Start production server
npm start
```

### 7. Post-Deployment Verification

#### Smoke Tests
- [ ] Homepage loads
- [ ] Inquiry form submits
- [ ] Booking flow completes
- [ ] Payment submission works
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Gallery manager works
- [ ] Package manager works
- [ ] Email notifications send

#### Security Tests
- [ ] Admin routes redirect to login when not authenticated
- [ ] API routes return 401 when not authenticated
- [ ] Rate limiting works on login
- [ ] Invalid passwords are rejected
- [ ] Session expires after 24 hours

#### Mobile Tests
- [ ] Site is responsive on mobile
- [ ] Forms work on mobile
- [ ] Navigation works on mobile

### 8. Backup & Monitoring

#### Backup Strategy
- [ ] Database backups scheduled (daily)
- [ ] Backup retention policy (30 days)
- [ ] Backup restoration tested

#### Monitoring
- [ ] Error tracking configured (Sentry recommended)
- [ ] Uptime monitoring configured
- [ ] Performance monitoring configured
- [ ] Log aggregation configured

### 9. Domain & SSL

- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] HTTPS redirects enabled
- [ ] WWW redirects configured (optional)

## Platform-Specific Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

**Environment Variables in Vercel:**
- Add all variables from `.env.production` to Vercel dashboard
- Mark `DATABASE_URL`, `NEXTAUTH_SECRET`, `RESEND_API_KEY` as sensitive

### Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Link project
railway link

# 4. Deploy
railway up
```

### Render

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm ci && npx prisma migrate deploy && npm run build`
4. Set start command: `npm start`
5. Add environment variables

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Check connection string format
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Build Failures
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm ci
npm run build
```

### Email Not Sending
- Verify Resend API key
- Check domain verification status
- Review email logs in Resend dashboard

### Session Issues
- Verify NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches domain
- Check cookie settings in browser

## Rollback Plan

1. **Database**: Restore from backup
2. **Code**: Revert to previous Git commit
3. **Environment**: Restore previous .env values
4. **Verify**: Run smoke tests after rollback

## Support Contacts

- **Hosting**: Check your platform's support
- **Database**: PostgreSQL documentation
- **Email**: Resend support
- **Framework**: Next.js documentation
