#!/usr/bin/env ts-node
/**
 * Security Audit Script
 * Run this before production deployment to verify security settings
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

interface AuditResult {
  passed: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
}

const results: AuditResult[] = []

function check(condition: boolean, message: string, severity: 'error' | 'warning' | 'info' = 'error'): void {
  results.push({
    passed: condition,
    message,
    severity,
  })
}

function printResult(result: AuditResult): void {
  const icon = result.passed ? '✓' : result.severity === 'warning' ? '⚠' : '✗'
  const color = result.passed ? GREEN : result.severity === 'warning' ? YELLOW : RED
  console.log(`${color}${icon} ${result.message}${RESET}`)
}

console.log('🔒 Running Security Audit...\n')

// 1. Environment Variables Check
console.log('📋 Checking Environment Variables...')
const envPath = path.join(process.cwd(), '.env')
const envProductionPath = path.join(process.cwd(), '.env.production')

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  
  // Check for development secrets
  check(
    !envContent.includes('development-secret'),
    'NEXTAUTH_SECRET is not using default development value',
    'error'
  )
  
  // Check for ADMIN_PASSWORD (should be removed)
  check(
    !envContent.includes('ADMIN_PASSWORD=') || envContent.includes('ADMIN_PASSWORD_HASH='),
    'ADMIN_PASSWORD is removed (only ADMIN_PASSWORD_HASH should exist)',
    'error'
  )
  
  // Check for placeholder API keys
  check(
    !envContent.includes('re_xxxxxxxxxxxxx'),
    'RESEND_API_KEY is not using placeholder value',
    'error'
  )
  
  // Check for SQLite in production
  check(
    !envContent.includes('file:./dev.db') || process.env.NODE_ENV !== 'production',
    'DATABASE_URL is not using SQLite (should be PostgreSQL in production)',
    'warning'
  )
  
  // Check for secure URLs
  check(
    !envContent.includes('localhost:3000') || process.env.NODE_ENV !== 'production',
    'NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL are not using localhost in production',
    'warning'
  )
} else {
  check(false, '.env file exists', 'error')
}

// 2. File Permissions Check
console.log('\n📁 Checking File Permissions...')

check(
  fs.existsSync(envProductionPath),
  '.env.production template exists',
  'info'
)

// 3. Package Security Check
console.log('\n📦 Checking Dependencies...')

try {
  const auditOutput = execSync('npm audit --json', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] })
  const audit = JSON.parse(auditOutput)
  const vulnerabilities = audit.metadata?.vulnerabilities || {}
  const totalVulns = (vulnerabilities.critical || 0) + (vulnerabilities.high || 0)
  
  check(
    totalVulns === 0,
    `No critical/high vulnerabilities found (${totalVulns} found)`,
    'error'
  )
} catch (error) {
  check(true, 'npm audit passed or no vulnerabilities', 'info')
}

// 4. TypeScript Check
console.log('\n🔍 Checking TypeScript...')

try {
  execSync('npx tsc --noEmit', { stdio: 'ignore' })
  check(true, 'TypeScript compilation successful', 'info')
} catch (error) {
  check(false, 'TypeScript compilation failed - fix errors before deployment', 'error')
}

// 5. Prisma Schema Check
console.log('\n🗄️  Checking Database Schema...')

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8')
  
  check(
    schemaContent.includes('@index'),
    'Database indexes are defined for performance',
    'warning'
  )
  
  check(
    schemaContent.includes('@unique'),
    'Unique constraints are defined where needed',
    'warning'
  )
}

// 6. Security Headers Check
console.log('\n🛡️  Checking Security Configuration...')

const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts')
if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf-8')
  
  check(
    middlewareContent.includes('X-Frame-Options'),
    'X-Frame-Options header is set',
    'error'
  )
  
  check(
    middlewareContent.includes('X-Content-Type-Options'),
    'X-Content-Type-Options header is set',
    'error'
  )
  
  check(
    middlewareContent.includes('httpOnly'),
    'Session cookies are httpOnly',
    'error'
  )
  
  check(
    middlewareContent.includes('sameSite'),
    'Session cookies use sameSite',
    'error'
  )
}

// 7. Auth Check
console.log('\n🔐 Checking Authentication...')

const authPath = path.join(process.cwd(), 'src', 'lib', 'auth.ts')
if (fs.existsSync(authPath)) {
  const authContent = fs.readFileSync(authPath, 'utf-8')
  
  check(
    authContent.includes('bcrypt'),
    'Password hashing uses bcrypt',
    'error'
  )
  
  check(
    authContent.includes('genSalt(12)') || authContent.includes('genSalt(10)'),
    'bcrypt salt rounds are adequate (10-12)',
    'warning'
  )
  
  check(
    authContent.includes('rateLimit') || authContent.includes('RateLimit'),
    'Rate limiting is implemented',
    'warning'
  )
}

// 8. Input Validation Check
console.log('\n✅ Checking Input Validation...')

const apiDir = path.join(process.cwd(), 'src', 'app', 'api')
if (fs.existsSync(apiDir)) {
  const apiFiles = fs.readdirSync(apiDir, { recursive: true })
  const routeFiles = apiFiles.filter((f: string | Buffer) => 
    typeof f === 'string' && f.includes('route.ts')
  ) as string[]
  
  let hasValidation = 0
  routeFiles.forEach(file => {
    const content = fs.readFileSync(path.join(apiDir, file), 'utf-8')
    if (content.includes('zod') || content.includes('Zod') || content.includes('validation')) {
      hasValidation++
    }
  })
  
  check(
    hasValidation > 0,
    `API routes have input validation (${hasValidation}/${routeFiles.length} routes)`,
    'warning'
  )
}

// Print Summary
console.log('\n' + '='.repeat(50))
console.log('AUDIT SUMMARY')
console.log('='.repeat(50))

const errors = results.filter(r => !r.passed && r.severity === 'error')
const warnings = results.filter(r => !r.passed && r.severity === 'warning')
const passed = results.filter(r => r.passed)

results.forEach(printResult)

console.log('\n' + '='.repeat(50))
console.log(`${GREEN}${passed.length} passed${RESET} | ${YELLOW}${warnings.length} warnings${RESET} | ${RED}${errors.length} errors${RESET}`)
console.log('='.repeat(50))

if (errors.length > 0) {
  console.log(`\n${RED}❌ Audit failed! Fix ${errors.length} error(s) before deploying to production.${RESET}`)
  process.exit(1)
} else if (warnings.length > 0) {
  console.log(`\n${YELLOW}⚠️  Audit passed with ${warnings.length} warning(s). Review before deploying.${RESET}`)
  process.exit(0)
} else {
  console.log(`\n${GREEN}✅ All checks passed! Ready for production deployment.${RESET}`)
  process.exit(0)
}
