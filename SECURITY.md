# Security Documentation

This document describes the security patterns and best practices implemented in the Next.js SEO Toolkit.

## Table of Contents

- [Security Headers](#security-headers)
- [Input Validation](#input-validation)
- [SSRF Protection](#ssrf-protection)
- [Rate Limiting](#rate-limiting)
- [CSRF Protection](#csrf-protection)
- [Authentication](#authentication)
- [Cookie Security](#cookie-security)
- [Logging & Secret Redaction](#logging--secret-redaction)
- [Database Security](#database-security)
- [OWASP Top 10 Mitigations](#owasp-top-10-mitigations)
- [Production Deployment](#production-deployment)

## Security Headers

All responses include OWASP-recommended security headers via middleware:

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | `default-src 'self'; ...` | Prevents XSS and data injection |
| Strict-Transport-Security | `max-age=31536000` (prod) | Forces HTTPS |
| X-Frame-Options | `DENY` | Prevents clickjacking |
| X-Content-Type-Options | `nosniff` | Prevents MIME sniffing |
| Referrer-Policy | `strict-origin-when-cross-origin` | Controls referrer leakage |
| Permissions-Policy | `camera=(); microphone=(); ...` | Restricts browser features |

### Configuration

Headers are configured in `src/lib/security/headers.ts`. The CSP can be customized based on your application's needs.

```typescript
import { applySecurityHeaders } from '@/lib/security/headers'
```

## Input Validation

All user input is validated using Zod schemas before processing:

### Usage

```typescript
import { validateBody, validateQuery } from '@/lib/security/validation'
import { z } from 'zod'

// Validate request body
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
})

const result = await validateBody(request, schema)
if (!result.success) {
  return result.response // Returns 400 with validation errors
}

const { email, name } = result.data // Type-safe validated data
```

### Best Practices

1. **Always validate** - Never trust client-side validation alone
2. **Be specific** - Use precise schemas (min/max lengths, patterns)
3. **Fail early** - Validate before any processing
4. **Return helpful errors** - Include field-specific error messages

## SSRF Protection

The SSRF guard prevents server-side requests to internal resources:

### Protected Against

- Localhost (`127.0.0.1`, `localhost`, `::1`)
- Private IP ranges (`10.x.x.x`, `172.16-31.x.x`, `192.168.x.x`)
- Link-local addresses (`169.254.x.x`)
- Non-HTTP protocols (`file://`, `ftp://`, `gopher://`)

### Usage

```typescript
import { safeFetch, isUrlSafe } from '@/lib/security/ssrf'

// Safe fetch with automatic validation
const response = await safeFetch(userProvidedUrl, {
  timeout: 5000,      // 5 second timeout
  maxSize: 10485760,  // 10MB max response
  maxRedirects: 5,    // Limit redirect chains
})

// Check URL safety without fetching
if (isUrlSafe(url)) {
  // URL is safe to use
}
```

### Important

**Never use native `fetch()` with user-provided URLs.** Always use `safeFetch()` or validate with `validateUrl()` first.

## Rate Limiting

Protect endpoints from abuse with configurable rate limiting:

### Configuration

```typescript
import { createRateLimiter, checkRateLimit, RateLimitConfigs } from '@/lib/security/rate-limit'

// Create a rate limiter
const limiter = createRateLimiter(RateLimitConfigs.standard) // 100 req/min

// In your route handler
const rateLimitResponse = await checkRateLimit(request, limiter)
if (rateLimitResponse) {
  return rateLimitResponse // Returns 429 with retry headers
}
```

### Available Configurations

| Config | Limit | Window | Use Case |
|--------|-------|--------|----------|
| `standard` | 100 req | 1 min | General API endpoints |
| `strict` | 10 req | 1 min | Sensitive operations |
| `relaxed` | 1000 req | 1 min | High-traffic endpoints |
| `auth` | 5 req | 15 min | Login/registration |

### Production Note

The in-memory rate limiter is suitable for single-instance deployments. For production with multiple instances, implement a Redis-based rate limiter.

## CSRF Protection

CSRF token utilities are provided for state-changing operations:

### Current Implementation (Stub)

```typescript
import { generateCsrfToken, validateCsrfToken } from '@/lib/security/csrf'

// Generate token
const token = generateCsrfToken()

// Validate token (timing-safe comparison)
const isValid = validateCsrfToken(submittedToken, expectedToken)
```

### Production Implementation

For production, implement full CSRF middleware:

1. Generate token on page load
2. Store in HttpOnly cookie
3. Include in form/header on submission
4. Validate on state-changing requests

## Authentication

Authentication placeholders are provided for development:

### Development Mode

```typescript
import { requireUser } from '@/lib/security/auth'

// Returns mock user in development
const user = await requireUser()
```

### Production Implementation

Replace the placeholder with a real authentication solution:

- **NextAuth.js** - Flexible authentication for Next.js
- **Clerk** - Drop-in authentication UI
- **Auth0** - Enterprise identity platform
- **Custom** - Roll your own with JWTs

### Protected Routes

```typescript
// src/app/(app)/layout.tsx
import { requireUser, AuthError } from '@/lib/security/auth'
import { AccessDenied } from '@/components/layout/access-denied'

export default async function AppLayout({ children }) {
  try {
    const user = await requireUser()
    return <AppShell user={user}>{children}</AppShell>
  } catch (error) {
    if (error instanceof AuthError) {
      return <AccessDenied />
    }
    throw error
  }
}
```

## Cookie Security

All cookies must be set with proper security attributes:

```typescript
import { createStrictCookie, createSessionCookie } from '@/lib/security/cookies'

// Strict security (for CSRF tokens, etc.)
const strictCookie = createStrictCookie(value, maxAge)
// HttpOnly: true, Secure: true (prod), SameSite: strict

// Session cookie (expires when browser closes)
const sessionCookie = createSessionCookie(value)
// HttpOnly: true, Secure: true (prod), SameSite: lax
```

### Required Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `HttpOnly` | `true` | Prevents XSS access |
| `Secure` | `true` (prod) | HTTPS only |
| `SameSite` | `strict` or `lax` | CSRF protection |

## Logging & Secret Redaction

The logger automatically redacts sensitive information:

### Redacted Patterns

- `password=...`
- `token=...`
- `api_key=...`
- `secret=...`
- `Authorization: Bearer ...`
- Database connection strings

### Usage

```typescript
import { createLogger } from '@/lib/logger'

const logger = createLogger({ requestId: 'abc-123' })

// Secrets are automatically redacted
logger.info('User login', { password: 'secret123' })
// Output: {"message":"User login","password":"[REDACTED]"...}
```

### Best Practices

1. **Log request IDs** - Include request ID in all log entries
2. **Avoid logging PII** - Even with redaction, minimize sensitive data
3. **Use structured logging** - JSON format for parsing
4. **Different levels** - Use appropriate log levels

## Database Security

### Parameterized Queries

**Never interpolate user input into SQL strings.** Use parameterized queries:

```typescript
// ✅ SAFE - Parameterized query
const result = await query('SELECT * FROM users WHERE id = $1', [userId])

// ❌ DANGEROUS - SQL injection vulnerable
const result = await query(`SELECT * FROM users WHERE id = ${userId}`)
```

### Connection Security

- Use SSL/TLS for database connections in production
- Rotate database passwords regularly
- Use least-privilege database users
- Enable connection pooling with timeouts

## OWASP Top 10 Mitigations

| # | Vulnerability | Mitigation |
|---|---------------|------------|
| A01 | Broken Access Control | Auth gates, role checks |
| A02 | Cryptographic Failures | HTTPS, secure cookies |
| A03 | Injection | Parameterized queries, Zod validation |
| A04 | Insecure Design | Security headers, CSP |
| A05 | Security Misconfiguration | Environment validation |
| A06 | Vulnerable Components | Dependency audits, lockfiles |
| A07 | Auth Failures | Rate limiting, secure sessions |
| A08 | Data Integrity Failures | CSRF protection, input validation |
| A09 | Logging Failures | Structured logging, secret redaction |
| A10 | SSRF | SSRF guard module |

## Production Deployment

### Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure strong CSRF_SECRET and SESSION_SECRET
- [ ] Enable HTTPS with valid certificates
- [ ] Configure proper CSP for your domain
- [ ] Set up Redis for rate limiting (multi-instance)
- [ ] Configure production logging (e.g., Datadog, Sentry)
- [ ] Enable database SSL
- [ ] Review and tighten security headers
- [ ] Run security audit before deploy
- [ ] Set up monitoring and alerting

### Environment Variables

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NEXT_PUBLIC_APP_URL=https://yourdomain.com
CSRF_SECRET=<32+ character random string>
SESSION_SECRET=<32+ character random string>
```

### Generate Secrets

```bash
# Generate secure secrets
openssl rand -hex 32
```

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create a public GitHub issue
2. Email security@yourdomain.com with details
3. Include steps to reproduce
4. Allow time for a fix before disclosure

## Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
