import { describe, test, expect } from 'vitest'
import * as fc from 'fast-check'
import { NextResponse } from 'next/server'
import { applySecurityHeaders, generateCSP, getSecurityHeaders } from '@/lib/security/headers'

/**
 * Security Headers Tests
 *
 * These tests validate the security headers module using property-based testing.
 */

describe('Security Headers', () => {
    // Feature: nextjs-seo-toolkit, Property 1: Security Headers Completeness
    describe('Property 1: Security Headers Completeness', () => {
        test('all responses include required security headers', () => {
            fc.assert(
                fc.property(
                    fc.record({
                        path: fc.webPath(),
                        method: fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
                    }),
                    () => {
                        // Create a NextResponse
                        const response = NextResponse.next()

                        // Apply security headers
                        applySecurityHeaders(response)

                        // Verify all required headers are present
                        expect(response.headers.has('Content-Security-Policy')).toBe(true)
                        expect(response.headers.has('X-Frame-Options')).toBe(true)
                        expect(response.headers.has('X-Content-Type-Options')).toBe(true)
                        expect(response.headers.has('Referrer-Policy')).toBe(true)
                        expect(response.headers.has('Permissions-Policy')).toBe(true)
                    }
                ),
                { numRuns: 100 }
            )
        })

        test('X-Frame-Options is set to DENY for clickjacking protection', () => {
            const response = NextResponse.next()
            applySecurityHeaders(response)

            expect(response.headers.get('X-Frame-Options')).toBe('DENY')
        })

        test('X-Content-Type-Options is set to nosniff', () => {
            const response = NextResponse.next()
            applySecurityHeaders(response)

            expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
        })

        test('Referrer-Policy is set correctly', () => {
            const response = NextResponse.next()
            applySecurityHeaders(response)

            expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
        })

        test('Permissions-Policy restricts dangerous features', () => {
            const response = NextResponse.next()
            applySecurityHeaders(response)

            const permissionsPolicy = response.headers.get('Permissions-Policy')
            expect(permissionsPolicy).toContain('camera=()')
            expect(permissionsPolicy).toContain('microphone=()')
            expect(permissionsPolicy).toContain('geolocation=()')
        })
    })

    describe('Content Security Policy', () => {
        test('CSP includes required directives', () => {
            const csp = generateCSP()

            expect(csp).toContain("default-src 'self'")
            expect(csp).toContain("script-src")
            expect(csp).toContain("style-src")
            expect(csp).toContain("img-src")
            expect(csp).toContain("frame-ancestors 'none'")
        })

        test('CSP is properly formatted', () => {
            const csp = generateCSP()

            // CSP should be semicolon-separated directives
            const directives = csp.split('; ')
            expect(directives.length).toBeGreaterThan(1)

            // Each directive should have a valid format
            for (const directive of directives) {
                expect(directive).toMatch(/^[\w-]+\s+/)
            }
        })
    })

    describe('getSecurityHeaders', () => {
        test('returns all required headers as object', () => {
            const headers = getSecurityHeaders()

            expect(headers['Content-Security-Policy']).toBeDefined()
            expect(headers['X-Frame-Options']).toBe('DENY')
            expect(headers['X-Content-Type-Options']).toBe('nosniff')
            expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
            expect(headers['Permissions-Policy']).toBeDefined()
        })
    })
})
