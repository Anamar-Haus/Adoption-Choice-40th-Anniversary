import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import {
    InMemoryRateLimiter,
    checkRateLimit,
    RateLimitConfigs,
} from '@/lib/security/rate-limit'

/**
 * Rate Limiter Tests
 *
 * These tests validate the rate limiting module using property-based testing.
 */

describe('Rate Limiter', () => {
    let limiter: InMemoryRateLimiter

    beforeEach(() => {
        limiter = new InMemoryRateLimiter(10, 60000) // 10 requests per minute
    })

    afterEach(() => {
        limiter.destroy()
    })

    // Feature: nextjs-seo-toolkit, Property 4: Rate Limit Enforcement
    describe('Property 4: Rate Limit Enforcement', () => {
        test('allows requests up to the limit', async () => {
            const identifier = 'test-user'

            // Make requests up to the limit
            for (let i = 0; i < 10; i++) {
                const result = await limiter.check(identifier)
                expect(result.allowed).toBe(true)
                expect(result.remaining).toBe(10 - i - 1)
            }
        })

        test('rejects requests after limit is exceeded', async () => {
            const identifier = 'test-user'

            // Exhaust the limit
            for (let i = 0; i < 10; i++) {
                await limiter.check(identifier)
            }

            // Next request should be rejected
            const result = await limiter.check(identifier)
            expect(result.allowed).toBe(false)
            expect(result.remaining).toBe(0)
        })

        test('returns correct rate limit headers when exceeded', async () => {
            const identifier = 'test-user'

            // Exhaust the limit
            for (let i = 0; i < 10; i++) {
                await limiter.check(identifier)
            }

            const result = await limiter.check(identifier)

            expect(result.allowed).toBe(false)
            expect(result.limit).toBe(10)
            expect(result.remaining).toBe(0)
            expect(typeof result.reset).toBe('number')
        })

        test('tracks different identifiers separately', async () => {
            fc.assert(
                fc.asyncProperty(
                    fc.array(fc.uuid(), { minLength: 5, maxLength: 10 }),
                    async (identifiers) => {
                        const testLimiter = new InMemoryRateLimiter(5, 60000)

                        // Each identifier should have its own counter
                        for (const id of identifiers) {
                            const result = await testLimiter.check(id)
                            expect(result.allowed).toBe(true)
                            expect(result.remaining).toBe(4) // First request of 5 allowed
                        }

                        testLimiter.destroy()
                    }
                ),
                { numRuns: 100 }
            )
        })

        test('returns 429 response when rate limited', async () => {
            // Create a strict limiter
            const strictLimiter = new InMemoryRateLimiter(1, 60000)

            // Create mock request
            const mockRequest = new Request('http://localhost/api', {
                headers: { 'x-forwarded-for': '1.2.3.4' },
            })

            // First request should pass
            const firstResult = await checkRateLimit(mockRequest, strictLimiter)
            expect(firstResult).toBeNull()

            // Second request should be rate limited
            const secondResult = await checkRateLimit(mockRequest, strictLimiter)
            expect(secondResult).not.toBeNull()
            expect(secondResult?.status).toBe(429)

            // Check required headers
            expect(secondResult?.headers.get('Retry-After')).toBeDefined()
            expect(secondResult?.headers.get('X-RateLimit-Limit')).toBe('1')
            expect(secondResult?.headers.get('X-RateLimit-Remaining')).toBe('0')
            expect(secondResult?.headers.get('X-RateLimit-Reset')).toBeDefined()

            strictLimiter.destroy()
        })
    })

    describe('Rate Limiter Configurations', () => {
        test('standard config allows 100 requests per minute', () => {
            expect(RateLimitConfigs.standard.maxRequests).toBe(100)
            expect(RateLimitConfigs.standard.windowMs).toBe(60000)
        })

        test('strict config allows 10 requests per minute', () => {
            expect(RateLimitConfigs.strict.maxRequests).toBe(10)
            expect(RateLimitConfigs.strict.windowMs).toBe(60000)
        })

        test('auth config allows 5 requests per 15 minutes', () => {
            expect(RateLimitConfigs.auth.maxRequests).toBe(5)
            expect(RateLimitConfigs.auth.windowMs).toBe(15 * 60 * 1000)
        })
    })

    describe('Reset Functionality', () => {
        test('reset clears rate limit for identifier', async () => {
            const identifier = 'test-user'

            // Exhaust the limit
            for (let i = 0; i < 10; i++) {
                await limiter.check(identifier)
            }

            // Should be rate limited
            let result = await limiter.check(identifier)
            expect(result.allowed).toBe(false)

            // Reset
            await limiter.reset(identifier)

            // Should be allowed again
            result = await limiter.check(identifier)
            expect(result.allowed).toBe(true)
            expect(result.remaining).toBe(9)
        })
    })
})
