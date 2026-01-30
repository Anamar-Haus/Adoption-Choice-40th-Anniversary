import { describe, test, expect } from 'vitest'
import * as fc from 'fast-check'
import {
    redactSecrets,
    generateRequestId,
    createLogger,
} from '@/lib/logger'

/**
 * Logger Tests
 *
 * These tests validate the logger module using property-based testing.
 */

describe('Logger', () => {
    // Feature: nextjs-seo-toolkit, Property 10: Secret Redaction in Logs
    describe('Property 10: Secret Redaction in Logs', () => {
        test('redacts password patterns', () => {
            fc.assert(
                fc.property(fc.string({ minLength: 1, maxLength: 50 }), (secretValue) => {
                    const message = `User login with password=${secretValue} failed`
                    const redacted = redactSecrets(message)
                    expect(redacted).toContain('[REDACTED]')
                }),
                { numRuns: 100 }
            )
        })

        test('redacts token patterns', () => {
            fc.assert(
                fc.property(fc.string({ minLength: 20, maxLength: 64 }), (tokenValue) => {
                    const message = `API call with token=${tokenValue}`
                    const redacted = redactSecrets(message)
                    expect(redacted).toContain('[REDACTED]')
                }),
                { numRuns: 100 }
            )
        })

        test('redacts api_key patterns', () => {
            fc.assert(
                fc.property(fc.string({ minLength: 16, maxLength: 32 }), (keyValue) => {
                    const message = `Request with api_key=${keyValue}`
                    const redacted = redactSecrets(message)
                    expect(redacted).toContain('[REDACTED]')
                }),
                { numRuns: 100 }
            )
        })

        test('redacts secret patterns', () => {
            fc.assert(
                fc.property(fc.string({ minLength: 1, maxLength: 50 }), (secretValue) => {
                    const message = `Using secret=${secretValue} for encryption`
                    const redacted = redactSecrets(message)
                    expect(redacted).toContain('[REDACTED]')
                }),
                { numRuns: 100 }
            )
        })

        test('redacts Authorization Bearer headers', () => {
            fc.assert(
                fc.property(fc.string({ minLength: 20, maxLength: 100 }), (token) => {
                    const message = `Authorization: Bearer ${token}`
                    const redacted = redactSecrets(message)
                    expect(redacted).toContain('[REDACTED]')
                }),
                { numRuns: 100 }
            )
        })

        test('does not modify messages without sensitive data', () => {
            const safeMesages = [
                'User logged in successfully',
                'Processing request for /api/users',
                'Database connection established',
                'Cache miss for key: user:123',
            ]

            for (const message of safeMesages) {
                expect(redactSecrets(message)).toBe(message)
            }
        })
    })

    // Feature: nextjs-seo-toolkit, Property 11: Request ID Uniqueness
    describe('Property 11: Request ID Uniqueness', () => {
        test('generates unique request IDs', () => {
            fc.assert(
                fc.property(fc.integer({ min: 10, max: 100 }), (count) => {
                    const ids = new Set<string>()

                    for (let i = 0; i < count; i++) {
                        ids.add(generateRequestId())
                    }

                    // All IDs should be unique
                    expect(ids.size).toBe(count)
                }),
                { numRuns: 100 }
            )
        })

        test('request IDs are valid UUIDs', () => {
            fc.assert(
                fc.property(fc.constant(null), () => {
                    const id = generateRequestId()
                    // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                    expect(id).toMatch(
                        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                    )
                }),
                { numRuns: 100 }
            )
        })
    })

    // Feature: nextjs-seo-toolkit, Property 12: Request ID in Log Context
    describe('Property 12: Request ID in Log Context', () => {
        test('logger includes requestId in all log entries', () => {
            fc.assert(
                fc.property(fc.uuid(), (requestId) => {
                    const logs: string[] = []
                    const originalLog = console.log
                    console.log = (msg: string) => logs.push(msg)

                    const logger = createLogger({ requestId })
                    logger.info('Test message')

                    console.log = originalLog

                    expect(logs.length).toBe(1)
                    expect(logs[0]).toContain(requestId)
                }),
                { numRuns: 100 }
            )
        })

        test('child logger inherits parent context', () => {
            const parentLogger = createLogger({ requestId: 'parent-123', module: 'auth' })
            const childLogger = parentLogger.child({ userId: 'user-456' })

            const logs: string[] = []
            const originalLog = console.log
            console.log = (msg: string) => logs.push(msg)

            childLogger.info('Child log message')

            console.log = originalLog

            expect(logs[0]).toContain('parent-123')
            expect(logs[0]).toContain('user-456')
            expect(logs[0]).toContain('auth')
        })
    })

    describe('Logger Methods', () => {
        test('logger has all required methods', () => {
            const logger = createLogger()

            expect(typeof logger.info).toBe('function')
            expect(typeof logger.warn).toBe('function')
            expect(typeof logger.error).toBe('function')
            expect(typeof logger.debug).toBe('function')
            expect(typeof logger.child).toBe('function')
        })

        test('log entries are valid JSON', () => {
            const logs: string[] = []
            const originalLog = console.log
            console.log = (msg: string) => logs.push(msg)

            const logger = createLogger({ requestId: 'test-123' })
            logger.info('Test message', { key: 'value' })

            console.log = originalLog

            // Should be valid JSON
            expect(() => JSON.parse(logs[0])).not.toThrow()

            const parsed = JSON.parse(logs[0])
            expect(parsed.level).toBe('INFO')
            expect(parsed.message).toBe('Test message')
            expect(parsed.requestId).toBe('test-123')
        })
    })
})
