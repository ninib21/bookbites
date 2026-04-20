import { prisma } from '@/lib/prisma'

export type ManualPaymentSettings = {
  cashAppTag: string
  chimeTag: string
  applePayValue: string
  applePayLabel: string
  instructions: string
  depositNote: string
  isCashAppEnabled: boolean
  isChimeEnabled: boolean
  isApplePayEnabled: boolean
}

const PAYMENT_SETTINGS_KEY = 'manual_payment_settings'

const defaultSettings: ManualPaymentSettings = {
  cashAppTag: '',
  chimeTag: '',
  applePayValue: '',
  applePayLabel: 'Apple Pay',
  instructions:
    'Send your payment using one of the methods below. After sending payment, return to the booking lookup page and click the payment submitted button so the owner can review and approve it.',
  depositNote:
    'Your date is not fully secured until the owner reviews and approves your payment submission.',
  isCashAppEnabled: true,
  isChimeEnabled: true,
  isApplePayEnabled: true,
}

export async function getManualPaymentSettings(): Promise<ManualPaymentSettings> {
  const record = await prisma.siteSetting.findUnique({
    where: { key: PAYMENT_SETTINGS_KEY },
  })

  if (!record?.value) {
    return defaultSettings
  }

  try {
    const parsed =
      typeof record.value === 'string'
        ? JSON.parse(record.value)
        : (record.value as Partial<ManualPaymentSettings>)

    return {
      ...defaultSettings,
      ...parsed,
    }
  } catch {
    return defaultSettings
  }
}

export async function upsertManualPaymentSettings(
  input: Partial<ManualPaymentSettings>
): Promise<ManualPaymentSettings> {
  const current = await getManualPaymentSettings()

  const merged: ManualPaymentSettings = {
    ...current,
    ...input,
  }

  await prisma.siteSetting.upsert({
    where: { key: PAYMENT_SETTINGS_KEY },
    update: {
      value: JSON.stringify(merged),
    },
    create: {
      key: PAYMENT_SETTINGS_KEY,
      value: JSON.stringify(merged),
    },
  })

  return merged
}

export function buildManualPaymentLines(settings: ManualPaymentSettings): string[] {
  const lines: string[] = []

  if (settings.isCashAppEnabled && settings.cashAppTag.trim()) {
    lines.push(`Cash App: ${settings.cashAppTag}`)
  }

  if (settings.isChimeEnabled && settings.chimeTag.trim()) {
    lines.push(`Chime: ${settings.chimeTag}`)
  }

  if (settings.isApplePayEnabled && settings.applePayValue.trim()) {
    lines.push(`${settings.applePayLabel}: ${settings.applePayValue}`)
  }

  return lines
}
