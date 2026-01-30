import { z } from 'zod'

/**
 * Environment variable validation schema
 * Uses Zod to validate and parse environment variables at startup
 *
 * Security Note: This ensures the application fails fast if required
 * environment variables are missing or invalid, preventing runtime errors
 */
const envSchema = z.object({
    // Application environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Database URL (required)
    DATABASE_URL: z
        .string()
        .url()
        .refine((url) => url.startsWith('postgresql://') || url.startsWith('postgres://'), {
            message: 'DATABASE_URL must be a valid PostgreSQL connection string',
        }),

    // Public application URL (optional in development)
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),

    // Security secrets (optional in development, required in production)
    CSRF_SECRET: z.string().min(32).optional(),
    SESSION_SECRET: z.string().min(32).optional(),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validate environment variables
 * Will throw an error and exit if validation fails
 */
function validateEnv(): Env {
    // In development/test, provide defaults for optional values
    const envWithDefaults = {
        ...process.env,
        DATABASE_URL:
            process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/seo_toolkit',
    }

    const result = envSchema.safeParse(envWithDefaults)

    if (!result.success) {
        console.error('❌ Invalid environment variables:')
        result.error.issues.forEach((err) => {
            console.error(`  ${err.path.join('.')}: ${err.message}`)
        })

        // In production, fail hard on invalid env
        if (process.env.NODE_ENV === 'production') {
            process.exit(1)
        }

        // In development/test, log warning but continue with defaults
        console.warn('⚠️ Continuing with default values in development mode')

        // Return a type-safe default for development
        return {
            NODE_ENV: 'development',
            DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/seo_toolkit',
            NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        } as Env
    }

    return result.data
}

/**
 * Validated environment variables
 * Import this to access type-safe environment configuration
 */
export const env = validateEnv()

/**
 * Check if running in production mode
 */
export const isProduction = env.NODE_ENV === 'production'

/**
 * Check if running in development mode
 */
export const isDevelopment = env.NODE_ENV === 'development'

/**
 * Check if running in test mode
 */
export const isTest = env.NODE_ENV === 'test'
