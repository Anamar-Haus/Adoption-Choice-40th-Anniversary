/**
 * Cookie Security Configuration
 *
 * Provides helpers for setting secure cookies with proper security attributes.
 *
 * Security attributes applied:
 * - HttpOnly: Prevents JavaScript access to cookies
 * - Secure: Only transmit over HTTPS (production only)
 * - SameSite: Controls cross-site request behavior
 */

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

/**
 * Cookie options type
 */
export interface SecureCookieOptions {
    /** Cookie value */
    value: string
    /** Max age in seconds (default: 24 hours) */
    maxAge?: number
    /** Cookie path (default: '/') */
    path?: string
    /** Cookie domain (optional) */
    domain?: string
    /** SameSite attribute (default: 'lax') */
    sameSite?: 'strict' | 'lax' | 'none'
    /** Allow JavaScript access (default: false - HttpOnly) */
    httpOnly?: boolean
}

/**
 * Get secure cookie configuration
 *
 * Automatically applies security best practices:
 * - HttpOnly: true (unless explicitly disabled)
 * - Secure: true in production
 * - SameSite: 'lax' (or as specified)
 *
 * @param options - Cookie options
 * @returns Complete cookie configuration
 */
export function getSecureCookieConfig(options: SecureCookieOptions): ResponseCookie {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        name: '', // Will be set by the caller
        value: options.value,
        httpOnly: options.httpOnly ?? true,
        secure: isProduction,
        sameSite: options.sameSite ?? 'lax',
        path: options.path ?? '/',
        maxAge: options.maxAge ?? 60 * 60 * 24, // 24 hours default
        ...(options.domain && { domain: options.domain }),
    }
}

/**
 * Create a session cookie configuration
 *
 * Session cookies with strict security:
 * - HttpOnly: true
 * - Secure: true in production
 * - SameSite: 'lax'
 * - No expiry (expires when browser closes)
 *
 * @param value - Cookie value
 * @returns Cookie configuration
 */
export function createSessionCookie(value: string): Omit<ResponseCookie, 'name'> {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        value,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        // No maxAge = session cookie (expires when browser closes)
    }
}

/**
 * Create a persistent cookie configuration
 *
 * Long-lived cookies with strict security:
 * - HttpOnly: true
 * - Secure: true in production
 * - SameSite: 'lax'
 *
 * @param value - Cookie value
 * @param maxAgeDays - Maximum age in days (default: 30)
 * @returns Cookie configuration
 */
export function createPersistentCookie(
    value: string,
    maxAgeDays: number = 30
): Omit<ResponseCookie, 'name'> {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        value,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: maxAgeDays * 24 * 60 * 60, // Convert days to seconds
    }
}

/**
 * Create a strict security cookie configuration
 *
 * For sensitive operations (e.g., CSRF tokens):
 * - HttpOnly: true
 * - Secure: true in production
 * - SameSite: 'strict' (prevents CSRF attacks)
 *
 * @param value - Cookie value
 * @param maxAge - Maximum age in seconds (default: 1 hour)
 * @returns Cookie configuration
 */
export function createStrictCookie(
    value: string,
    maxAge: number = 60 * 60
): Omit<ResponseCookie, 'name'> {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        value,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge,
    }
}

/**
 * Create a delete cookie configuration
 *
 * Sets the cookie to expire immediately
 *
 * @returns Cookie configuration for deletion
 */
export function createDeleteCookie(): Omit<ResponseCookie, 'name'> {
    return {
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0, // Expire immediately
    }
}

/**
 * Validate cookie security properties
 *
 * Checks if a cookie configuration follows security best practices
 *
 * @param cookie - Cookie configuration to validate
 * @returns Array of validation warnings (empty if valid)
 */
export function validateCookieSecurity(
    cookie: Partial<ResponseCookie>
): string[] {
    const warnings: string[] = []
    const isProduction = process.env.NODE_ENV === 'production'

    if (!cookie.httpOnly) {
        warnings.push('Cookie should have HttpOnly flag to prevent XSS attacks')
    }

    if (isProduction && !cookie.secure) {
        warnings.push('Cookie should have Secure flag in production')
    }

    if (!cookie.sameSite) {
        warnings.push('Cookie should have SameSite attribute (use "lax" or "strict")')
    }

    if (cookie.sameSite === 'none' && !cookie.secure) {
        warnings.push('SameSite=None requires Secure flag')
    }

    return warnings
}
