/**
 * SSRF (Server-Side Request Forgery) Protection Module
 *
 * Protects against SSRF attacks by:
 * - Blocking requests to private IP ranges
 * - Blocking requests to localhost
 * - Restricting allowed protocols
 * - Limiting redirects
 * - Enforcing timeouts and size limits
 *
 * Security Note: Always use safeFetch() instead of native fetch() for
 * any requests where the URL comes from user input.
 */

/**
 * Private IP address ranges (RFC 1918 and others)
 * These should never be accessible from user-provided URLs
 */
const PRIVATE_IP_RANGES = [
    // IPv4
    /^127\./, // Loopback (127.0.0.0/8)
    /^10\./, // Private Class A (10.0.0.0/8)
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private Class B (172.16.0.0/12)
    /^192\.168\./, // Private Class C (192.168.0.0/16)
    /^169\.254\./, // Link-local (169.254.0.0/16)
    /^0\./, // Current network (0.0.0.0/8)

    // IPv6
    /^::1$/, // Loopback
    /^fe80:/i, // Link-local
    /^fc00:/i, // Unique local (fc00::/7)
    /^fd[0-9a-f]{2}:/i, // Unique local
    /^::$/, // Unspecified address
]

/**
 * Allowed protocols for outbound requests
 */
const ALLOWED_PROTOCOLS = ['http:', 'https:']

/**
 * SSRF error class for distinguishing SSRF-related errors
 */
export class SSRFError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'SSRFError'
    }
}

/**
 * Options for safe fetch operations
 */
export interface SafeFetchOptions {
    /** Request timeout in milliseconds (default: 5000) */
    timeout?: number
    /** Maximum response size in bytes (default: 10MB) */
    maxSize?: number
    /** Maximum number of redirects to follow (default: 5) */
    maxRedirects?: number
    /** Additional fetch options */
    fetchOptions?: RequestInit
}

const DEFAULT_OPTIONS: Required<SafeFetchOptions> = {
    timeout: 5000,
    maxSize: 10 * 1024 * 1024, // 10MB
    maxRedirects: 5,
    fetchOptions: {},
}

/**
 * Validate a URL for SSRF safety
 *
 * @param urlString - URL string to validate
 * @returns Validated URL object
 * @throws SSRFError if the URL is unsafe
 */
export function validateUrl(urlString: string): URL {
    let url: URL

    // Parse the URL
    try {
        url = new URL(urlString)
    } catch {
        throw new SSRFError('Invalid URL format')
    }

    // Check protocol
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
        throw new SSRFError(`Protocol '${url.protocol}' is not allowed. Use HTTP or HTTPS.`)
    }

    // Check hostname
    const hostname = url.hostname.toLowerCase()

    // Block localhost variants
    if (hostname === 'localhost' || hostname === '0.0.0.0') {
        throw new SSRFError('Localhost access is not allowed')
    }

    // Block private IP ranges
    for (const range of PRIVATE_IP_RANGES) {
        if (range.test(hostname)) {
            throw new SSRFError('Private IP range access is not allowed')
        }
    }

    // Block IPv6 localhost
    if (hostname === '[::1]' || hostname === '::1') {
        throw new SSRFError('IPv6 localhost access is not allowed')
    }

    return url
}

/**
 * Safely fetch a URL with SSRF protections
 *
 * @param urlString - URL to fetch
 * @param options - Fetch options
 * @returns Fetch Response
 * @throws SSRFError if the request violates security rules
 *
 * Usage:
 * ```
 * const response = await safeFetch('https://example.com/api/data')
 * const data = await response.json()
 * ```
 */
export async function safeFetch(
    urlString: string,
    options: SafeFetchOptions = {}
): Promise<Response> {
    const { timeout, maxSize, maxRedirects, fetchOptions } = {
        ...DEFAULT_OPTIONS,
        ...options,
    }

    // Validate URL before fetching
    const url = validateUrl(urlString)

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
        const response = await fetch(url.toString(), {
            ...fetchOptions,
            signal: controller.signal,
            redirect: 'manual', // Handle redirects manually for security
        })

        // Handle redirects
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location')

            if (!location) {
                throw new SSRFError('Redirect without location header')
            }

            if (maxRedirects <= 0) {
                throw new SSRFError('Too many redirects')
            }

            // Resolve redirect URL and validate it
            const redirectUrl = new URL(location, url)

            // Recursively fetch with decremented redirect count
            return safeFetch(redirectUrl.toString(), {
                ...options,
                maxRedirects: maxRedirects - 1,
            })
        }

        // Check response size from Content-Length header
        const contentLength = response.headers.get('content-length')
        if (contentLength) {
            const size = parseInt(contentLength, 10)
            if (size > maxSize) {
                throw new SSRFError(`Response too large: ${size} bytes (max: ${maxSize} bytes)`)
            }
        }

        return response
    } catch (error) {
        // Re-throw SSRFError as-is
        if (error instanceof SSRFError) {
            throw error
        }

        // Handle abort/timeout
        if (error instanceof Error && error.name === 'AbortError') {
            throw new SSRFError(`Request timeout after ${timeout}ms`)
        }

        // Handle other fetch errors
        throw new SSRFError(`Fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
        clearTimeout(timeoutId)
    }
}

/**
 * Safely fetch JSON data with SSRF protections
 *
 * @param urlString - URL to fetch
 * @param options - Fetch options
 * @returns Parsed JSON data
 */
export async function safeFetchJson<T = unknown>(
    urlString: string,
    options: SafeFetchOptions = {}
): Promise<T> {
    const response = await safeFetch(urlString, {
        ...options,
        fetchOptions: {
            ...options.fetchOptions,
            headers: {
                Accept: 'application/json',
                ...options.fetchOptions?.headers,
            },
        },
    })

    if (!response.ok) {
        throw new SSRFError(`HTTP error: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
}

/**
 * Check if a URL is safe without making a request
 *
 * @param urlString - URL to check
 * @returns true if safe, false otherwise
 */
export function isUrlSafe(urlString: string): boolean {
    try {
        validateUrl(urlString)
        return true
    } catch {
        return false
    }
}
