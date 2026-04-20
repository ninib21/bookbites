# Pretty Party Sweets - Security Documentation

## 🔐 Admin Security Implementation

### Security Features Implemented

#### 1. Strong Password Hashing ✅
- **Algorithm**: bcrypt with 12 rounds
- **Salt**: Auto-generated unique salt per password
- **Storage**: Passwords never stored in plain text
- **Hash Format**: `$2a$12$...` (bcrypt standard)

#### 2. Protected Admin Sessions ✅
- **Session Token**: 64-character cryptographically secure random string
- **Session Storage**: HTTP-only cookies (not accessible via JavaScript)
- **Cookie Security**:
  - `httpOnly: true` - Prevents XSS attacks
  - `secure: true` - HTTPS only in production
  - `sameSite: 'strict'` - CSRF protection
  - `path: '/'` - Available across all routes
- **Session Duration**: 24 hours with automatic expiry
- **Session Validation**: Checked on every admin request

#### 3. Route Guards ✅
- **Middleware**: `src/middleware.ts` protects all admin routes
- **Protected Routes**:
  - `/admin/dashboard`
  - `/admin/leads`
  - `/admin/bookings`
  - `/admin/reviews`
  - `/admin/settings`
- **Automatic Redirect**: Unauthenticated users redirected to `/admin/login`
- **Return URL**: Preserves intended destination after login

#### 4. Rate Limiting ✅
- **Target**: Login attempts by IP + email combination
- **Limit**: 5 attempts per 15-minute window
- **Reset**: Automatic after 15 minutes
- **Response**: HTTP 429 (Too Many Requests)
- **Clear**: Resets on successful login

#### 5. Secure Cookies ✅
- **HTTP-Only**: Prevents JavaScript access
- **Secure Flag**: HTTPS required in production
- **SameSite**: Strict CSRF protection
- **Expiry**: 24-hour session duration
- **Path**: Root path for all routes

#### 6. Environment Secret Review ✅

**Required Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://..."  # Never expose credentials

# Session Secret
NEXTAUTH_SECRET="<64-char-random>"  # Generate with: openssl rand -base64 32

# Admin Credentials
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD_HASH="$2a$12$..."  # bcrypt hash only, never plain text

# Email
RESEND_API_KEY="re_..."  # Keep private

# Site
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

**Security Checklist:**
- [ ] `.env` added to `.gitignore`
- [ ] No secrets committed to Git
- [ ] Strong password hash generated
- [ ] Plain text password removed from `.env`
- [ ] Session secret is 64+ characters
- [ ] Production uses HTTPS

#### 7. Logout & Session Expiry ✅
- **Logout API**: `POST /api/admin/logout`
- **Session Destruction**: Server-side session deletion
- **Cookie Clear**: Client cookie removed
- **Automatic Expiry**: Sessions expire after 24 hours
- **Cleanup**: Expired sessions automatically purged

#### 8. Security Headers ✅
Added to all responses via middleware:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Limits referrer info
- `X-XSS-Protection: 1; mode=block` - XSS filter

---

## 🚀 Production Security Setup

### Step 1: Generate Admin Password Hash

```bash
# Set your admin password in .env temporarily
ADMIN_PASSWORD="YourSecurePassword123!"

# Generate hash
npx ts-node scripts/generate-password-hash.ts "YourSecurePassword123!"

# Output:
# Password Hash:
# $2a$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#
# Add this to your .env file:
# ADMIN_PASSWORD_HASH="$2a$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Remove plain text password from .env
# Keep only ADMIN_PASSWORD_HASH
```

### Step 2: Generate Session Secret

```bash
# Generate secure random secret
openssl rand -base64 32

# Output:
# abc123... (64 characters)

# Add to .env
NEXTAUTH_SECRET="abc123..."
```

### Step 3: Configure Production Environment

```env
# .env.production
NODE_ENV="production"

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"

# Session
NEXTAUTH_SECRET="<64-char-secret>"
NEXTAUTH_URL="https://yourdomain.com"

# Site
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Admin (HASH ONLY - no plain text)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD_HASH="$2a$12$..."

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="hello@yourdomain.com"
```

### Step 4: Deploy with Security Headers

Already configured in `src/middleware.ts`:
- All admin routes protected
- Security headers applied
- Rate limiting active

### Step 5: Verify Security

```bash
# Test login rate limiting
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@domain.com","password":"wrong"}'
# Repeat 5 times - should get 429 on 6th attempt

# Test session protection
curl http://localhost:3000/admin/dashboard
# Should redirect to /admin/login

# Test security headers
curl -I http://localhost:3000/admin/login
# Should see X-Frame-Options, X-Content-Type-Options, etc.
```

---

## 🔒 Security Best Practices

### Password Requirements
- Minimum 12 characters
- Uppercase and lowercase letters
- Numbers
- Special characters
- No dictionary words
- Unique (not used elsewhere)

### Session Management
- Sessions expire after 24 hours
- Logout destroys session immediately
- New session on each login
- Sessions stored server-side (memory - upgrade to Redis for production scale)

### Environment Security
- Never commit `.env` to Git
- Use different secrets for dev/staging/prod
- Rotate secrets periodically
- Monitor for exposed credentials

### HTTPS Enforcement
- Always use HTTPS in production
- Vercel provides automatic HTTPS
- Cookies set to `secure: true` in production

### Monitoring & Alerts
- Monitor failed login attempts
- Set up alerts for suspicious activity
- Review logs regularly
- Use Sentry for error tracking

---

## 🚨 Security Incident Response

### If Admin Credentials Compromised

1. **Immediate Actions**:
   ```bash
   # Generate new password hash
   npx ts-node scripts/generate-password-hash.ts "NewSecurePassword!"
   
   # Update .env with new hash
   # Restart server
   ```

2. **Review**:
   - Check admin logs for unauthorized access
   - Review recent bookings/leads changes
   - Verify no data exported without authorization

3. **Notify**:
   - Inform team members
   - Contact affected customers if needed
   - Document incident

### If Session Token Leaked

1. **Restart Server** (clears in-memory sessions)
2. **Generate New Session Secret**:
   ```bash
   openssl rand -base64 32
   ```
3. **Update .env** and redeploy
4. **Force all admins to re-login**

---

## 📋 Pre-Launch Security Checklist

- [ ] Admin password hash generated
- [ ] Plain text password removed from .env
- [ ] Session secret is 64+ random characters
- [ ] .env added to .gitignore
- [ ] No secrets in code repository
- [ ] HTTPS enabled on production domain
- [ ] Rate limiting tested
- [ ] Session expiry working
- [ ] Logout functionality tested
- [ ] Security headers present
- [ ] Route guards active
- [ ] Failed login attempts logged
- [ ] Database credentials secure
- [ ] Email API key protected

---

## 🔐 Security Contacts

**Emergency Contacts:**
- Hosting Provider: [Your hosting support]
- Domain Registrar: [Your registrar support]
- Database Provider: [Your DB provider support]

**Security Resources:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Next.js Security: https://nextjs.org/docs/advanced-features/security-headers
- bcrypt Info: https://www.npmjs.com/package/bcryptjs

---

**Last Updated**: 2024
**Security Version**: 1.0
**Review Schedule**: Quarterly
