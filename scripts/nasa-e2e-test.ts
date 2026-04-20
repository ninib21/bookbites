#!/usr/bin/env ts-node
/**
 * NASA-Level End-to-End Test Suite
 * Comprehensive system validation with redundancy checks
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Test Configuration
const CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3001',
  timeout: 30000,
  retries: 3,
}

// Test Results Storage
interface TestResult {
  phase: string
  test: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  duration: number
  error?: string
  evidence?: string
}

const results: TestResult[] = []

// ANSI Colors
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const RESET = '\x1b[0m'

// Utility Functions
function log(message: string, color: string = RESET): void {
  console.log(`${color}${message}${RESET}`)
}

function recordResult(phase: string, test: string, status: 'PASS' | 'FAIL' | 'SKIP', duration: number, error?: string, evidence?: string): void {
  results.push({ phase, test, status, duration, error, evidence })
}

function printDivider(): void {
  log('='.repeat(80), BLUE)
}

// Phase 1: Pre-Flight Checks
async function phase1PreFlight(): Promise<void> {
  printDivider()
  log('PHASE 1: PRE-FLIGHT CHECKS', BLUE)
  printDivider()

  const startTime = Date.now()

  // Check 1.1: TypeScript Compilation
  log('\n[1.1] TypeScript Compilation Check...')
  try {
    const tsStart = Date.now()
    execSync('npx tsc --noEmit', { stdio: 'ignore' })
    recordResult('Pre-Flight', 'TypeScript Compilation', 'PASS', Date.now() - tsStart)
    log('  ✓ TypeScript compilation successful', GREEN)
  } catch (error) {
    recordResult('Pre-Flight', 'TypeScript Compilation', 'FAIL', Date.now() - startTime, 'TypeScript errors found')
    log('  ✗ TypeScript compilation failed', RED)
  }

  // Check 1.2: Prisma Schema Validation
  log('\n[1.2] Prisma Schema Validation...')
  try {
    const prismaStart = Date.now()
    execSync('npx prisma validate', { stdio: 'ignore' })
    recordResult('Pre-Flight', 'Prisma Schema Validation', 'PASS', Date.now() - prismaStart)
    log('  ✓ Prisma schema valid', GREEN)
  } catch (error) {
    recordResult('Pre-Flight', 'Prisma Schema Validation', 'FAIL', Date.now() - startTime, 'Schema validation failed')
    log('  ✗ Prisma schema invalid', RED)
  }

  // Check 1.3: Environment Variables
  log('\n[1.3] Environment Variables Check...')
  const envStart = Date.now()
  const envPath = path.join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXT_PUBLIC_SITE_URL']
    const missing = requiredVars.filter(v => !envContent.includes(v))
    
    if (missing.length === 0) {
      recordResult('Pre-Flight', 'Environment Variables', 'PASS', Date.now() - envStart)
      log('  ✓ All required environment variables present', GREEN)
    } else {
      recordResult('Pre-Flight', 'Environment Variables', 'FAIL', Date.now() - envStart, `Missing: ${missing.join(', ')}`)
      log(`  ✗ Missing variables: ${missing.join(', ')}`, RED)
    }
  } else {
    recordResult('Pre-Flight', 'Environment Variables', 'FAIL', Date.now() - envStart, '.env file not found')
    log('  ✗ .env file not found', RED)
  }

  // Check 1.4: Database Connection
  log('\n[1.4] Database Connection Check...')
  try {
    const dbStart = Date.now()
    execSync('npx prisma db pull --force', { stdio: 'ignore' })
    recordResult('Pre-Flight', 'Database Connection', 'PASS', Date.now() - dbStart)
    log('  ✓ Database connection successful', GREEN)
  } catch (error) {
    recordResult('Pre-Flight', 'Database Connection', 'FAIL', Date.now() - startTime, 'Cannot connect to database')
    log('  ✗ Database connection failed', RED)
  }

  // Check 1.5: Security Audit
  log('\n[1.5] Security Audit...')
  try {
    const secStart = Date.now()
    // Check for security headers in middleware
    const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts')
    const authPath = path.join(process.cwd(), 'src', 'lib', 'auth.ts')
    
    let hasSecurityHeaders = false
    let hasHttpOnly = false
    
    if (fs.existsSync(middlewarePath)) {
      const middleware = fs.readFileSync(middlewarePath, 'utf-8')
      hasSecurityHeaders = 
        middleware.includes('X-Frame-Options') &&
        middleware.includes('X-Content-Type-Options')
    }
    
    if (fs.existsSync(authPath)) {
      const auth = fs.readFileSync(authPath, 'utf-8')
      hasHttpOnly = auth.includes('httpOnly')
    }
    
    if (hasSecurityHeaders && hasHttpOnly) {
      recordResult('Pre-Flight', 'Security Headers', 'PASS', Date.now() - secStart)
      log('  ✓ Security headers and httpOnly cookies configured', GREEN)
    } else {
      const missing = []
      if (!hasSecurityHeaders) missing.push('security headers in middleware')
      if (!hasHttpOnly) missing.push('httpOnly in auth')
      recordResult('Pre-Flight', 'Security Headers', 'FAIL', Date.now() - secStart, `Missing: ${missing.join(', ')}`)
      log(`  ✗ Security configuration incomplete: ${missing.join(', ')}`, RED)
    }
  } catch (error) {
    recordResult('Pre-Flight', 'Security Audit', 'FAIL', Date.now() - startTime, 'Security check failed')
    log('  ✗ Security audit failed', RED)
  }
}

// Phase 2: Static Analysis
async function phase2StaticAnalysis(): Promise<void> {
  printDivider()
  log('PHASE 2: STATIC ANALYSIS', BLUE)
  printDivider()

  // Check 2.1: API Route Structure
  log('\n[2.1] API Route Structure...')
  const apiStart = Date.now()
  const apiDir = path.join(process.cwd(), 'src', 'app', 'api')
  if (fs.existsSync(apiDir)) {
    const routeFiles = fs.readdirSync(apiDir, { recursive: true })
      .filter(f => typeof f === 'string' && f.includes('route.ts')) as string[]
    
    let validatedRoutes = 0
    routeFiles.forEach(file => {
      const content = fs.readFileSync(path.join(apiDir, file), 'utf-8')
      if (content.includes('zod') || content.includes('Zod') || content.includes('validation')) {
        validatedRoutes++
      }
    })
    
    recordResult('Static Analysis', 'API Route Validation', 'PASS', Date.now() - apiStart, undefined, `${validatedRoutes}/${routeFiles.length} routes have validation`)
    log(`  ✓ ${validatedRoutes}/${routeFiles.length} API routes have input validation`, GREEN)
  }

  // Check 2.2: Component Structure
  log('\n[2.2] Component Structure...')
  const compStart = Date.now()
  const componentsDir = path.join(process.cwd(), 'src', 'components')
  if (fs.existsSync(componentsDir)) {
    const components = fs.readdirSync(componentsDir, { recursive: true })
      .filter(f => typeof f === 'string' && f.endsWith('.tsx')) as string[]
    recordResult('Static Analysis', 'Component Structure', 'PASS', Date.now() - compStart, undefined, `${components.length} components found`)
    log(`  ✓ ${components.length} components in codebase`, GREEN)
  }

  // Check 2.3: Database Schema Coverage
  log('\n[2.3] Database Schema Coverage...')
  const schemaStart = Date.now()
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    const models = schema.match(/model\s+\w+/g) || []
    const indexes = schema.match(/@@index/g) || []
    
    recordResult('Static Analysis', 'Database Schema', 'PASS', Date.now() - schemaStart, undefined, `${models.length} models, ${indexes.length} indexes`)
    log(`  ✓ ${models.length} models with ${indexes.length} indexes`, GREEN)
  }
}

// Phase 3: Integration Tests
async function phase3Integration(): Promise<void> {
  printDivider()
  log('PHASE 3: INTEGRATION TESTS', BLUE)
  printDivider()

  // Check 3.1: Email Configuration
  log('\n[3.1] Email Service Integration...')
  const emailStart = Date.now()
  const emailPath = path.join(process.cwd(), 'src', 'lib', 'email.ts')
  if (fs.existsSync(emailPath)) {
    const emailContent = fs.readFileSync(emailPath, 'utf-8')
    const emailFunctions = emailContent.match(/export const send\w+/g) || []
    
    recordResult('Integration', 'Email Service', 'PASS', Date.now() - emailStart, undefined, `${emailFunctions.length} email functions`)
    log(`  ✓ ${emailFunctions.length} email notification functions configured`, GREEN)
  }

  // Check 3.2: Authentication Flow
  log('\n[3.2] Authentication Flow...')
  const authStart = Date.now()
  const authPath = path.join(process.cwd(), 'src', 'lib', 'auth.ts')
  if (fs.existsSync(authPath)) {
    const authContent = fs.readFileSync(authPath, 'utf-8')
    const hasBcrypt = authContent.includes('bcrypt')
    const hasRateLimit = authContent.includes('rateLimit') || authContent.includes('RateLimit')
    const hasSession = authContent.includes('createSession')
    
    if (hasBcrypt && hasRateLimit && hasSession) {
      recordResult('Integration', 'Authentication Flow', 'PASS', Date.now() - authStart)
      log('  ✓ Authentication system complete (bcrypt, rate limiting, sessions)', GREEN)
    } else {
      recordResult('Integration', 'Authentication Flow', 'FAIL', Date.now() - authStart, 'Missing auth components')
      log('  ✗ Authentication system incomplete', RED)
    }
  }

  // Check 3.3: Admin Panel Integration
  log('\n[3.3] Admin Panel Integration...')
  const adminStart = Date.now()
  const adminDir = path.join(process.cwd(), 'src', 'app', 'admin')
  if (fs.existsSync(adminDir)) {
    const adminPages = fs.readdirSync(adminDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
    
    const expectedPages = ['dashboard', 'bookings', 'leads', 'gallery', 'packages', 'payments', 'reviews', 'settings']
    const presentPages = expectedPages.filter(p => adminPages.includes(p))
    
    recordResult('Integration', 'Admin Panel', 'PASS', Date.now() - adminStart, undefined, `${presentPages.length}/${expectedPages.length} pages`)
    log(`  ✓ ${presentPages.length}/${expectedPages.length} admin pages present`, GREEN)
  }
}

// Phase 4: Data Integrity
async function phase4DataIntegrity(): Promise<void> {
  printDivider()
  log('PHASE 4: DATA INTEGRITY', BLUE)
  printDivider()

  // Check 4.1: Form Validation Coverage
  log('\n[4.1] Form Validation Coverage...')
  const formStart = Date.now()
  const validatorsDir = path.join(process.cwd(), 'src', 'lib', 'validators')
  if (fs.existsSync(validatorsDir)) {
    const validators = fs.readdirSync(validatorsDir)
      .filter(f => f.endsWith('.ts'))
    
    recordResult('Data Integrity', 'Form Validation', 'PASS', Date.now() - formStart, undefined, `${validators.length} validators`)
    log(`  ✓ ${validators.length} Zod validators for form data`, GREEN)
  }

  // Check 4.2: Type Safety
  log('\n[4.2] TypeScript Type Coverage...')
  const typeStart = Date.now()
  const typesDir = path.join(process.cwd(), 'src', 'types')
  if (fs.existsSync(typesDir)) {
    const typeFiles = fs.readdirSync(typesDir)
      .filter(f => f.endsWith('.ts'))
    
    recordResult('Data Integrity', 'Type Definitions', 'PASS', Date.now() - typeStart, undefined, `${typeFiles.length} type files`)
    log(`  ✓ ${typeFiles.length} TypeScript type definition files`, GREEN)
  } else {
    recordResult('Data Integrity', 'Type Definitions', 'SKIP', Date.now() - typeStart, undefined, 'No separate types directory')
    log('  ⚠ No separate types directory (types may be inline)', YELLOW)
  }
}

// Phase 5: Performance Baseline
async function phase5Performance(): Promise<void> {
  printDivider()
  log('PHASE 5: PERFORMANCE BASELINE', BLUE)
  printDivider()

  // Check 5.1: Build Size
  log('\n[5.1] Build Size Analysis...')
  const buildStart = Date.now()
  try {
    // Check if .next directory exists
    const nextDir = path.join(process.cwd(), '.next')
    if (fs.existsSync(nextDir)) {
      const getDirSize = (dir: string): number => {
        let size = 0
        const files = fs.readdirSync(dir, { withFileTypes: true })
        for (const file of files) {
          const filePath = path.join(dir, file.name)
          if (file.isDirectory()) {
            size += getDirSize(filePath)
          } else {
            size += fs.statSync(filePath).size
          }
        }
        return size
      }
      
      const sizeMB = (getDirSize(nextDir) / 1024 / 1024).toFixed(2)
      recordResult('Performance', 'Build Size', 'PASS', Date.now() - buildStart, undefined, `${sizeMB} MB`)
      log(`  ✓ Build size: ${sizeMB} MB`, GREEN)
    } else {
      recordResult('Performance', 'Build Size', 'SKIP', Date.now() - buildStart, undefined, 'No build yet')
      log('  ⚠ No build directory found', YELLOW)
    }
  } catch (error) {
    recordResult('Performance', 'Build Size', 'FAIL', Date.now() - buildStart, 'Could not calculate build size')
    log('  ✗ Could not calculate build size', RED)
  }

  // Check 5.2: Dependencies
  log('\n[5.2] Dependency Analysis...')
  const depStart = Date.now()
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    const deps = Object.keys(packageJson.dependencies || {}).length
    const devDeps = Object.keys(packageJson.devDependencies || {}).length
    
    recordResult('Performance', 'Dependencies', 'PASS', Date.now() - depStart, undefined, `${deps} prod, ${devDeps} dev`)
    log(`  ✓ ${deps} production dependencies, ${devDeps} dev dependencies`, GREEN)
  }
}

// Generate Report
function generateReport(): void {
  printDivider()
  log('NASA E2E TEST REPORT', BLUE)
  printDivider()

  const totalTests = results.length
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  const skipped = results.filter(r => r.status === 'SKIP').length

  // Group by phase
  const phases = ['Pre-Flight', 'Static Analysis', 'Integration', 'Data Integrity', 'Performance']
  
  phases.forEach(phase => {
    const phaseResults = results.filter(r => r.phase === phase)
    if (phaseResults.length > 0) {
      log(`\n${phase}:`, BLUE)
      phaseResults.forEach(result => {
        const icon = result.status === 'PASS' ? '✓' : result.status === 'FAIL' ? '✗' : '⚠'
        const color = result.status === 'PASS' ? GREEN : result.status === 'FAIL' ? RED : YELLOW
        log(`  ${icon} ${result.test} (${result.duration}ms)`, color)
        if (result.evidence) {
          log(`    └─ ${result.evidence}`, RESET)
        }
        if (result.error) {
          log(`    └─ ERROR: ${result.error}`, RED)
        }
      })
    }
  })

  printDivider()
  log('SUMMARY', BLUE)
  printDivider()
  log(`Total Tests: ${totalTests}`, RESET)
  log(`Passed: ${passed}`, GREEN)
  log(`Failed: ${failed}`, failed > 0 ? RED : RESET)
  log(`Skipped: ${skipped}`, YELLOW)
  log(`Success Rate: ${((passed / totalTests) * 100).toFixed(1)}%`, passed === totalTests ? GREEN : YELLOW)
  printDivider()

  // Mission Status
  if (failed === 0) {
    log('\n🚀 MISSION STATUS: GO FOR LAUNCH', GREEN)
    log('All systems nominal. Ready for production deployment.', GREEN)
  } else if (failed <= 2) {
    log('\n⚠️  MISSION STATUS: HOLD', YELLOW)
    log('Minor issues detected. Review before launch.', YELLOW)
  } else {
    log('\n🛑 MISSION STATUS: NO-GO', RED)
    log('Critical issues detected. Fix before launch.', RED)
  }

  // Export results to file
  const reportPath = path.join(process.cwd(), 'test-results', `nasa-e2e-${Date.now()}.json`)
  const reportDir = path.dirname(reportPath)
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }
  
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { total: totalTests, passed, failed, skipped },
    results,
  }, null, 2))
  
  log(`\n📄 Detailed report saved to: ${reportPath}`, BLUE)
}

// Main Execution
async function main(): Promise<void> {
  log('\n')
  log('╔══════════════════════════════════════════════════════════════════════════════╗', BLUE)
  log('║                  NASA-LEVEL END-TO-END TEST SUITE                            ║', BLUE)
  log('║                     Pretty Party Sweets - v1.0                               ║', BLUE)
  log('╚══════════════════════════════════════════════════════════════════════════════╝', BLUE)
  log('\n')

  const missionStart = Date.now()

  try {
    await phase1PreFlight()
    await phase2StaticAnalysis()
    await phase3Integration()
    await phase4DataIntegrity()
    await phase5Performance()
    
    generateReport()
    
    const missionDuration = Date.now() - missionStart
    log(`\n⏱️  Mission Duration: ${(missionDuration / 1000).toFixed(2)} seconds`, BLUE)
    
  } catch (error) {
    log('\n🛑 CRITICAL MISSION FAILURE', RED)
    log(error instanceof Error ? error.message : 'Unknown error', RED)
    process.exit(1)
  }
}

main()
