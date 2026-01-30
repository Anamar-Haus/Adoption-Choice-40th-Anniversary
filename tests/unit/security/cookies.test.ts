import { describe, test, expect } from 'vitest'
import * as fc from 'fast-check'
import {
    getSecureCookieConfig,
    createSessionCookie,
    createPersistentCookie,
    createStrictCookie,
    validateCookieSecurity,
} from '@/lib/security/cookies'

/**
 * Cookie Security Tests
 *
 * These tests validate the cookie security module.
 */

describe('Cookie Security', () => {
    // Feature: nextjs-seo-toolkit, Property 3: Cookie Security Attributes
    describe('Property 3: Cookie Security Attributes', () => {
        test('all cookies include HttpOnly flag', () => {
            fc.assert(
                fc.property(fc.string({ minLength: 1, maxLength: 100 }), (value) => {
                    const config = getSecureCookieConfig({ value })
                    expect(config.httpOnly).toBe(true)
                }),
                { numRuns: 100 }
            )
        })

        test('all cookies include SameSite attribute', () => {
            fc.assert(
                fc.property(fc.string({ minLength: 1, maxLength: 100 }), (value) => {
                    const config = getSecureCookieConfig({ value })
                    expect(['strict', 'lax', 'none']).toContain(config.sameSite)
                }),
                { numRuns: 100 }
            )
        })

        test('session cookies have correct attributes', () => {
            const cookie = createSessionCookie('session-value')

            expect(cookie.httpOnly).toBe(true)
            expect(cookie.sameSite).toBe('lax')
            expect(cookie.maxAge).toBeUndefined() // Session cookie
        })

        test('strict cookies have strict SameSite', () => {
            const cookie = createStrictCookie('csrf-token')

            expect(cookie.httpOnly).toBe(true)
            expect(cookie.sameSite).toBe('strict')
        })

        test('persistent cookies have maxAge', () => {
            const cookie = createPersistentCookie('remember-me', 30) // 30 days

            expect(cookie.httpOnly).toBe(true)
            expect(cookie.maxAge).toBe(30 * 24 * 60 * 60)
        })
    })

    describe('validateCookieSecurity', () => {
        test('returns no warnings for secure cookie', () => {
            const cookie = {
                httpOnly: true,
                secure: true,
                sameSite: 'lax' as const,
            }

            const warnings = validateCookieSecurity(cookie)
            expect(warnings.length).toBe(0)
        })

        test('warns about missing HttpOnly', () => {
            const cookie = {
                httpOnly: false,
                secure: true,
                sameSite: 'lax' as const,
            }

            const warnings = validateCookieSecurity(cookie)
            expect(warnings.some((w) => w.includes('HttpOnly'))).toBe(true)
        })

        test('warns about missing SameSite', () => {
            const cookie = {
                httpOnly: true,
                secure: true,
            }

            const warnings = validateCookieSecurity(cookie)
            expect(warnings.some((w) => w.includes('SameSite'))).toBe(true)
        })

        test('warns about SameSite=None without Secure', () => {
            const cookie = {
                httpOnly: true,
                secure: false,
                sameSite: 'none' as const,
            }

            const warnings = validateCookieSecurity(cookie)
            expect(warnings.some((w) => w.includes('SameSite=None'))).toBe(true)
        })
    })
})
