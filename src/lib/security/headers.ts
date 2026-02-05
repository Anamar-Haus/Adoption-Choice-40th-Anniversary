import type { NextResponse } from 'next/server'

/**
 * Security headers configuration
 *
 * These headers implement OWASP security best practices:
 * - CSP: Prevents XSS and data injection attacks
 * - HSTS: Forces HTTPS connections (production only)
 * - X-Frame-Options: Prevents clickjacking
 * - X-Content-Type-Options: Prevents MIME-type sniffing
 * - Referrer-Policy: Controls referrer information leakage
 * - Permissions-Policy: Restricts browser features
 */

/**
 * Content Security Policy directives
 * Adjust these based on your application's needs
 *
 * Security Note: Start strict and loosen only as needed
 * 'unsafe-inline' and 'unsafe-eval' are included for Next.js compatibility
 * Consider using nonces in production for stricter CSP
 */
export function generateCSP(): string {
    const directives = [
        // Default to self only
        "default-src 'self'",
        // Scripts: self + inline for Next.js + Umami analytics
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.umami.is",
        // Styles: self + inline for styled-components/CSS-in-JS
        "style-src 'self' 'unsafe-inline'",
        // Images: self, data URIs, and HTTPS
        "img-src 'self' data: https:",
        // Fonts: self and data URIs
        "font-src 'self' data:",
        // Connect: self for API calls + Umami analytics
        "connect-src 'self' https://*.umami.is",
        // Frames: allow embedding on adoptionchoiceinc.org
        "frame-ancestors 'self' https://adoptionchoiceinc.org https://www.adoptionchoiceinc.org",
        // Form actions: self only
        "form-action 'self'",
        // Base URI: self only
        "base-uri 'self'",
        // Upgrade insecure requests in production
        ...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),
    ]

    return directives.join('; ')
}

/**
 * Apply security headers to a response
 *
 * @param response - NextResponse object to add headers to
 */
export function applySecurityHeaders(response: NextResponse): void {
    const isProduction = process.env.NODE_ENV === 'production'

    // Content Security Policy
    response.headers.set('Content-Security-Policy', generateCSP())

    // HTTP Strict Transport Security (HSTS) - Production only
    // Forces all connections to use HTTPS for 1 year
    if (isProduction) {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }

    // Note: X-Frame-Options removed - using CSP frame-ancestors instead
    // which supports multiple allowed origins

    // MIME Type Sniffing Protection
    // Prevents browsers from interpreting files as a different MIME type
    response.headers.set('X-Content-Type-Options', 'nosniff')

    // Referrer Policy
    // Controls how much referrer information is included with requests
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Permissions Policy (formerly Feature-Policy)
    // Restricts access to browser features
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), payment=()'
    )

    // Additional security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('X-XSS-Protection', '1; mode=block') // Legacy browsers

    // Remove potentially dangerous headers
    response.headers.delete('X-Powered-By')
}

/**
 * Get security headers as an object (for next.config.js)
 */
export function getSecurityHeaders(): Record<string, string> {
    const isProduction = process.env.NODE_ENV === 'production'

    const headers: Record<string, string> = {
        'Content-Security-Policy': generateCSP(),
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    }

    if (isProduction) {
        headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    }

    return headers
}
