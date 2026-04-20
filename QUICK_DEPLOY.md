# 🚀 Quick Deploy to Vercel

## 5-Minute Deployment Guide

### Step 1: Push to GitHub

```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Pretty Party Sweets - Production ready"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/pretty-party-sweets.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

```bash
# Install Vercel CLI (one time)
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=hello@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure_password
```

### Step 4: Set Up Database

**Option A: Vercel Postgres (Easiest)**
1. Vercel Dashboard → Storage → Create Database
2. Choose Postgres
3. Copy connection string to DATABASE_URL

**Option B: Supabase (Free)**
1. Sign up at https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string

**Option C: Neon (Free, Serverless)**
1. Sign up at https://neon.tech
2. Create project
3. Copy connection string

### Step 5: Push Schema to Database

```bash
# In your terminal
npx prisma generate
npx prisma db push
```

### Step 6: Connect Custom Domain

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as shown
4. Wait for SSL (automatic)

### Done! 🎉

Your site is now live at: `https://yourdomain.com`

---

## Test Your Deployment

- [ ] Visit homepage
- [ ] Submit inquiry form
- [ ] Submit contact form
- [ ] Create booking
- [ ] Lookup booking
- [ ] Login to admin
- [ ] Approve booking
- [ ] Export CSV

---

## Email Setup (Resend)

1. Sign up at https://resend.com
2. Get API key from dashboard
3. Verify your domain (add DNS records)
4. Add RESEND_API_KEY to Vercel env vars

---

## Troubleshooting

**Build fails:**
- Check Node version (must be 18+)
- Run `npm run build` locally first
- Check error logs in Vercel dashboard

**Database connection error:**
- Verify DATABASE_URL is correct
- Ensure database allows connections from Vercel IPs
- Check firewall rules

**Emails not sending:**
- Verify RESEND_API_KEY is set
- Check domain is verified in Resend
- Review Resend dashboard for delivery status

---

## Production URLs

- Public: https://yourdomain.com
- Admin: https://yourdomain.com/admin/login
- Booking: https://yourdomain.com/booking
- API: https://yourdomain.com/api/*
