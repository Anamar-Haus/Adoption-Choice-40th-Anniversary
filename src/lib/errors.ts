import { generateRequestId } from './logger'

/**
 * Standard error response structure
 * All API errors should follow this format for consistency
 */
export interface ErrorResponse {
    error: {
        code: string
        message: string
        requestId: string
        details?: unknown
    }
}

/**
 * Common error codes
 */
export const ErrorCodes = {
    // Client errors (4xx)
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_JSON: 'INVALID_JSON',
    INVALID_PARAMS: 'INVALID_PARAMS',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    CSRF_VALIDATION_FAILED: 'CSRF_VALIDATION_FAILED',

    // Server errors (5xx)
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    SSRF_VIOLATION: 'SSRF_VIOLATION',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

/**
 * Create a standardized error response
 *
 * Security Note: In production, we never expose stack traces or
 * detailed error information that could help attackers
 *
 * @param code - Error code for categorization
 * @param message - User-facing error message or detailed error info
 * @param status - HTTP status code (default: 500)
 * @param requestId - Optional request ID for tracing
 */
export function createErrorResponse(
    code: string,
    message: string | unknown,
    status: number = 500,
    requestId?: string
): Response {
    const id = requestId || generateRequestId()
    const isProduction = process.env.NODE_ENV === 'production'

    const body: ErrorResponse = {
        error: {
            code,
            message: typeof message === 'string' ? message : 'An error occurred',
            requestId: id,
        },
    }

    // Include details only in development (never in production)
    if (!isProduction && typeof message !== 'string') {
        body.error.details = message
    }

    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': id,
        },
    })
}

/**
 * Create a success response with data
 *
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @param requestId - Optional request ID for tracing
 */
export function createSuccessResponse<T>(
    data: T,
    status: number = 200,
    requestId?: string
): Response {
    const id = requestId || generateRequestId()

    return new Response(JSON.stringify({ data }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': id,
        },
    })
}

/**
 * Application error class
 * Extends Error with additional properties for HTTP responses
 */
export class AppError extends Error {
    constructor(
        public code: string,
        message: string,
        public statusCode: number = 500
    ) {
        super(message)
        this.name = 'AppError'
    }

    /**
     * Convert to HTTP response
     */
    toResponse(requestId?: string): Response {
        return createErrorResponse(this.code, this.message, this.statusCode, requestId)
    }
}

/**
 * Create common error response shortcuts
 */
export const Errors = {
    validation: (details: unknown) =>
        createErrorResponse(ErrorCodes.VALIDATION_ERROR, details, 400),

    unauthorized: (message = 'Authentication required') =>
        createErrorResponse(ErrorCodes.UNAUTHORIZED, message, 401),

    forbidden: (message = 'Access denied') =>
        createErrorResponse(ErrorCodes.FORBIDDEN, message, 403),

    notFound: (message = 'Resource not found') =>
        createErrorResponse(ErrorCodes.NOT_FOUND, message, 404),

    rateLimit: (retryAfter: number) =>
        new Response(
            JSON.stringify({
                error: {
                    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
                    message: 'Too many requests',
                },
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(retryAfter),
                },
            }
        ),

    internal: (requestId?: string) =>
        createErrorResponse(ErrorCodes.INTERNAL_ERROR, 'An unexpected error occurred', 500, requestId),
}
