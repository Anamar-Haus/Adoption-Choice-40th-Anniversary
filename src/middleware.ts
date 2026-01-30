import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateRequestId } from '@/lib/logger'
import { applySecurityHeaders } from '@/lib/security/headers'

/**
 * Next.js Middleware
 *
 * This middleware runs on every request and handles:
 * 1. Request ID generation for tracing
 * 2. Security headers application
 *
 * Security Note: All cross-cutting security concerns should be handled here
 * to ensure consistent application across all routes
 */
export function middleware(_request: NextRequest) {
    // Generate unique request ID for tracing
    const requestId = generateRequestId()

    // Create response and continue to the next handler
    const response = NextResponse.next()

    // Add request ID to response headers
    response.headers.set('X-Request-ID', requestId)

    // Apply security headers
    applySecurityHeaders(response)

    return response
}

/**
 * Configure which routes the middleware should run on
 *
 * This runs on all routes except:
 * - Static files (_next/static)
 * - Image optimization files (_next/image)
 * - Favicon
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
