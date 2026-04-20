type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  error?: Error
}

class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    }

    // Store in memory (in production, send to external service)
    this.logs.push(entry)

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output
    const timestamp = new Date().toLocaleTimeString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    switch (level) {
      case 'debug':
        console.debug(prefix, message, context || '')
        break
      case 'info':
        console.info(prefix, message, context || '')
        break
      case 'warn':
        console.warn(prefix, message, context || '')
        break
      case 'error':
        console.error(prefix, message, context || '', error || '')
        break
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(entry)
    }
  }

  private sendToMonitoring(entry: LogEntry) {
    // TODO: Integrate with Sentry, LogRocket, or similar
    // Example: Sentry.captureMessage(entry.message, entry.level)
    
    // For now, just log to console in production
    if (entry.level === 'error') {
      // Could send to email notification system
      console.error('PRODUCTION ERROR:', entry)
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('error', message, context, error)
  }

  // Get recent logs (for admin dashboard)
  getRecentLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let filtered = this.logs
    if (level) {
      filtered = this.logs.filter((log) => log.level === level)
    }
    return filtered.slice(-limit)
  }

  // Clear logs
  clear() {
    this.logs = []
  }
}

export const logger = Logger.getInstance()

// Helper functions for common logging patterns
export const logAPIRequest = (
  method: string,
  path: string,
  duration: number,
  status: number
) => {
  logger.info(`API ${method} ${path}`, {
    method,
    path,
    duration: `${duration}ms`,
    status,
  })
}

export const logAuthAttempt = (
  email: string,
  success: boolean,
  ip?: string
) => {
  if (success) {
    logger.info('Admin login successful', { email, ip })
  } else {
    logger.warn('Admin login failed', { email, ip })
  }
}

export const logDatabaseError = (operation: string, error: Error) => {
  logger.error(`Database error during ${operation}`, error, { operation })
}

export const logSecurityEvent = (
  event: string,
  details: Record<string, unknown>
) => {
  logger.warn(`Security event: ${event}`, details)
}
