import { hashPassword } from '../src/lib/auth'

async function generatePasswordHash() {
  const password = process.argv[2]

  if (!password) {
    console.error('Usage: npx ts-node scripts/generate-password-hash.ts <password>')
    process.exit(1)
  }

  const hash = await hashPassword(password)
  console.log('\nPassword Hash:')
  console.log(hash)
  console.log('\nAdd this to your .env file:')
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`)
  console.log('\nRemove ADMIN_PASSWORD from .env for security!')
}

generatePasswordHash().catch(console.error)
