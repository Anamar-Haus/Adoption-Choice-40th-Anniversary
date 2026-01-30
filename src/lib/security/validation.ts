import { z, ZodError, ZodType } from 'zod'
import type { NextRequest } from 'next/server'
import { createErrorResponse, ErrorCodes } from '@/lib/errors'

/**
 * Validation helpers using Zod
 *
 * These helpers provide consistent input validation across the application:
 * - Query parameters (URL search params)
 * - Route parameters (dynamic route segments)
 * - Request bodies (JSON payloads)
 *
 * Security Note: Always validate all user input before processing.
 * Never trust client-side validation alone.
 */

/**
 * Result type for validation operations
 * Either returns validated data or an error response
 */
export type ValidationResult<T> =
    | { success: true; data: T }
    | { success: false; response: Response }

/**
 * Format Zod errors into a user-friendly structure
 */
function formatZodErrors(error: ZodError): Record<string, string[]> {
    const formatted: Record<string, string[]> = {}

    for (const issue of error.issues) {
        const path = issue.path.join('.') || 'value'
        if (!formatted[path]) {
            formatted[path] = []
        }
        formatted[path].push(issue.message)
    }

    return formatted
}

/**
 * Validate request body against a Zod schema
 *
 * @param request - The NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 *
 * Usage:
 * ```
 * const result = await validateBody(request, z.object({ name: z.string() }))
 * if (!result.success) return result.response
 * const { name } = result.data
 * ```
 */
export async function validateBody<T extends ZodType>(
    request: NextRequest,
    schema: T
): Promise<ValidationResult<z.infer<T>>> {
    try {
        const body = await request.json()
        const validated = schema.parse(body)
        return { success: true, data: validated }
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                response: createErrorResponse(
                    ErrorCodes.VALIDATION_ERROR,
                    formatZodErrors(error),
                    400
                ),
            }
        }
        if (error instanceof SyntaxError) {
            return {
                success: false,
                response: createErrorResponse(
                    ErrorCodes.INVALID_JSON,
                    'Request body must be valid JSON',
                    400
                ),
            }
        }
        return {
            success: false,
            response: createErrorResponse(
                ErrorCodes.INVALID_JSON,
                'Failed to parse request body',
                400
            ),
        }
    }
}

/**
 * Validate query parameters against a Zod schema
 *
 * @param request - The NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 *
 * Usage:
 * ```
 * const result = validateQuery(request, z.object({ page: z.coerce.number() }))
 * if (!result.success) return result.response
 * const { page } = result.data
 * ```
 */
export function validateQuery<T extends ZodType>(
    request: NextRequest,
    schema: T
): ValidationResult<z.infer<T>> {
    try {
        const { searchParams } = new URL(request.url)
        const params = Object.fromEntries(searchParams.entries())
        const validated = schema.parse(params)
        return { success: true, data: validated }
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                response: createErrorResponse(
                    ErrorCodes.VALIDATION_ERROR,
                    formatZodErrors(error),
                    400
                ),
            }
        }
        return {
            success: false,
            response: createErrorResponse(
                ErrorCodes.INVALID_PARAMS,
                'Invalid query parameters',
                400
            ),
        }
    }
}

/**
 * Validate route parameters against a Zod schema
 *
 * @param params - Route parameters object from Next.js
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 *
 * Usage:
 * ```
 * const result = validateParams(params, z.object({ id: z.string().uuid() }))
 * if (!result.success) return result.response
 * const { id } = result.data
 * ```
 */
export function validateParams<T extends ZodType>(
    params: unknown,
    schema: T
): ValidationResult<z.infer<T>> {
    try {
        const validated = schema.parse(params)
        return { success: true, data: validated }
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                response: createErrorResponse(
                    ErrorCodes.VALIDATION_ERROR,
                    formatZodErrors(error),
                    400
                ),
            }
        }
        return {
            success: false,
            response: createErrorResponse(
                ErrorCodes.INVALID_PARAMS,
                'Invalid route parameters',
                400
            ),
        }
    }
}

/**
 * Common validation schemas for reuse
 */
export const CommonSchemas = {
    /** UUID string */
    uuid: z.string().uuid(),

    /** Email address */
    email: z.string().email(),

    /** Non-empty string */
    nonEmptyString: z.string().min(1),

    /** Positive integer */
    positiveInt: z.coerce.number().int().positive(),

    /** Pagination parameters */
    pagination: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
    }),

    /** Sort parameters */
    sort: z.object({
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc'),
    }),
}
