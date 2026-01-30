/**
 * Sensitive patterns to redact from log messages
 * These patterns match common secret formats to prevent accidental exposure
 *
 * Security Note: This is a defense-in-depth measure. Always avoid logging
 * sensitive data in the first place when possible.
 */
const SENSITIVE_PATTERNS = [
    // Key-value patterns
    /password["\s:=]+[^\s",}]*/gi,
    /token["\s:=]+[^\s",}]*/gi,
    /api[_-]?key["\s:=]+[^\s",}]*/gi,
    /secret["\s:=]+[^\s",}]*/gi,
    /credential["\s:=]+[^\s",}]*/gi,

    // Authorization headers
    /authorization:\s*bearer\s+\S+/gi,
    /authorization:\s*basic\s+\S+/gi,

    // Connection strings
    /postgresql?:\/\/[^@\s]+@/gi,
    /mysql:\/\/[^@\s]+@/gi,
    /mongodb(\+srv)?:\/\/[^@\s]+@/gi,
]

/**
 * Redact sensitive information from a string
 * Replaces matched patterns with [REDACTED]
 *
 * @param message - The message to redact secrets from
 * @returns The message with sensitive data redacted
 */
export function redactSecrets(message: string): string {
    let redacted = message

    for (const pattern of SENSITIVE_PATTERNS) {
        redacted = redacted.replace(pattern, '[REDACTED]')
    }

    return redacted
}

/**
 * Generate a unique request ID
 * Used to correlate logs and trace requests across the system
 */
export function generateRequestId(): string {
    return crypto.randomUUID()
}

/**
 * Logger context interface
 * Additional metadata to include with log entries
 */
export interface LogContext {
    requestId?: string
    userId?: string
    module?: string
    [key: string]: unknown
}

/**
 * Log level type
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/**
 * Logger class with context and secret redaction
 *
 * Usage:
 * ```
 * const logger = createLogger({ requestId: 'abc-123' })
 * logger.info('Processing request', { userId: 'user-1' })
 * ```
 */
export class Logger {
    private context: LogContext

    constructor(context: LogContext = {}) {
        this.context = context
    }

    /**
     * Format a log entry as JSON
     */
    private format(level: LogLevel, message: string, meta?: unknown): string {
        const entry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            ...this.context,
            ...(meta && typeof meta === 'object' ? meta : { data: meta }),
        }

        // Redact secrets from the entire JSON output
        return redactSecrets(JSON.stringify(entry))
    }

    /**
     * Log an info message
     */
    info(message: string, meta?: unknown): void {
        console.log(this.format('info', message, meta))
    }

    /**
     * Log a warning message
     */
    warn(message: string, meta?: unknown): void {
        console.warn(this.format('warn', message, meta))
    }

    /**
     * Log an error message
     */
    error(message: string, meta?: unknown): void {
        console.error(this.format('error', message, meta))
    }

    /**
     * Log a debug message (only in non-production environments)
     */
    debug(message: string, meta?: unknown): void {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(this.format('debug', message, meta))
        }
    }

    /**
     * Create a child logger with additional context
     */
    child(additionalContext: LogContext): Logger {
        return new Logger({
            ...this.context,
            ...additionalContext,
        })
    }
}

/**
 * Create a new logger instance with optional context
 *
 * @param context - Initial context for all log entries
 * @returns A Logger instance
 */
export function createLogger(context: LogContext = {}): Logger {
    return new Logger(context)
}

/**
 * Default logger instance
 */
export const logger = createLogger()
