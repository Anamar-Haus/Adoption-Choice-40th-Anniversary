/**
 * Rate Limiter Module
 *
 * Provides rate limiting functionality to protect API endpoints from abuse.
 * Uses an in-memory store by default (suitable for development).
 *
 * Security Note: For production with multiple instances, use Redis or similar
 * distributed storage. The interface is designed for easy swapping.
 */

/**
 * Result of a rate limit check
 */
export interface RateLimitResult {
    /** Whether the request is allowed */
    allowed: boolean
    /** Number of remaining requests in the current window */
    remaining: number
    /** Timestamp when the rate limit resets (ms since epoch) */
    reset: number
    /** Maximum requests allowed per window */
    limit: number
}

/**
 * Rate limiter interface for swappable implementations
 */
export interface RateLimiter {
    /**
     * Check if a request is allowed and update counters
     * @param identifier - Unique identifier for rate limiting (e.g., IP, user ID)
     */
    check(identifier: string): Promise<RateLimitResult>

    /**
     * Reset rate limit for an identifier
     * @param identifier - Unique identifier to reset
     */
    reset(identifier: string): Promise<void>
}

/**
 * In-memory rate limiter implementation
 * Suitable for single-instance development/testing
 *
 * For production with multiple instances, implement a Redis-based version
 */
export class InMemoryRateLimiter implements RateLimiter {
    private requests: Map<string, number[]> = new Map()
    private cleanupInterval: NodeJS.Timeout | null = null

    constructor(
        private maxRequests: number,
        private windowMs: number
    ) {
        // Periodically clean up old entries to prevent memory leaks
        this.cleanupInterval = setInterval(() => this.cleanup(), this.windowMs)
    }

    async check(identifier: string): Promise<RateLimitResult> {
        const now = Date.now()
        const windowStart = now - this.windowMs

        // Get existing timestamps for this identifier
        const timestamps = this.requests.get(identifier) || []

        // Filter out timestamps outside the current window
        const validTimestamps = timestamps.filter((ts) => ts > windowStart)

        // Check if limit exceeded
        const allowed = validTimestamps.length < this.maxRequests

        if (allowed) {
            validTimestamps.push(now)
            this.requests.set(identifier, validTimestamps)
        }

        return {
            allowed,
            remaining: Math.max(0, this.maxRequests - validTimestamps.length),
            reset: windowStart + this.windowMs,
            limit: this.maxRequests,
        }
    }

    async reset(identifier: string): Promise<void> {
        this.requests.delete(identifier)
    }

    /**
     * Clean up old entries to prevent memory leaks
     */
    private cleanup(): void {
        const now = Date.now()

        for (const [key, timestamps] of this.requests.entries()) {
            const valid = timestamps.filter((ts) => ts > now - this.windowMs)
            if (valid.length === 0) {
                this.requests.delete(key)
            } else {
                this.requests.set(key, valid)
            }
        }
    }

    /**
     * Stop the cleanup interval (for testing)
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval)
            this.cleanupInterval = null
        }
    }
}

/**
 * Default rate limiter configurations
 */
export const RateLimitConfigs = {
    /** Standard API: 100 requests per minute */
    standard: { maxRequests: 100, windowMs: 60 * 1000 },
    /** Strict: 10 requests per minute (for sensitive endpoints) */
    strict: { maxRequests: 10, windowMs: 60 * 1000 },
    /** Relaxed: 1000 requests per minute */
    relaxed: { maxRequests: 1000, windowMs: 60 * 1000 },
    /** Authentication: 5 requests per 15 minutes */
    auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
}

/**
 * Factory function to create a rate limiter
 * Easily swap implementations for production
 *
 * @param config - Rate limit configuration
 * @returns RateLimiter instance
 */
export function createRateLimiter(
    config: { maxRequests: number; windowMs: number } = RateLimitConfigs.standard
): RateLimiter {
    // TODO: In production, use Redis-based implementation
    // return new RedisRateLimiter(config.maxRequests, config.windowMs)
    return new InMemoryRateLimiter(config.maxRequests, config.windowMs)
}

/**
 * Get client identifier for rate limiting
 *
 * Security Note: IP-based rate limiting can be bypassed with rotating IPs.
 * For authenticated endpoints, prefer user-based rate limiting.
 *
 * @param request - Request object
 * @returns Client identifier string
 */
export function getClientIdentifier(request: Request): string {
    // Try to get the real IP from standard headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')

    // Use forwarded IP, real IP, or fallback to 'unknown'
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }
    if (realIp) {
        return realIp
    }

    return 'unknown'
}

/**
 * Check rate limit and return response if exceeded
 *
 * @param request - Request object
 * @param limiter - Rate limiter instance
 * @returns null if allowed, Response if rate limited
 *
 * Usage:
 * ```
 * const rateLimitResponse = await checkRateLimit(request, limiter)
 * if (rateLimitResponse) return rateLimitResponse
 * ```
 */
export async function checkRateLimit(
    request: Request,
    limiter: RateLimiter
): Promise<Response | null> {
    const identifier = getClientIdentifier(request)
    const result = await limiter.check(identifier)

    if (!result.allowed) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)

        return new Response(
            JSON.stringify({
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many requests. Please try again later.',
                },
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(Math.max(1, retryAfter)),
                    'X-RateLimit-Limit': String(result.limit),
                    'X-RateLimit-Remaining': String(result.remaining),
                    'X-RateLimit-Reset': String(result.reset),
                },
            }
        )
    }

    return null
}

// Create a default rate limiter instance for the application
export const defaultRateLimiter = createRateLimiter()
