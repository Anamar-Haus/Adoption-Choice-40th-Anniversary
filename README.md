# Next.js SEO Toolkit

A production-ready Next.js foundation with comprehensive security patterns, UI infrastructure, and development workflows for building SEO tools.

## Features

- 🔒 **Security First** - OWASP-compliant security headers, CSRF protection, SSRF guards, and rate limiting
- 📝 **Type-Safe** - TypeScript strict mode with Zod validation for runtime type safety
- 🎨 **Modern UI** - Beautiful, accessible components powered by shadcn/ui and Radix UI
- 🗄️ **Database Ready** - Docker-based PostgreSQL with connection pooling and health checks
- ⚡ **Developer Experience** - ESLint, Prettier, Vitest, and property-based testing
- ✅ **Production Tested** - CI/CD pipeline with security audits and comprehensive testing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later
- **Bun** (recommended) or npm
- **Docker Desktop** - Required for local database

### Install Bun (Recommended)

```bash
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd nextjs-seo-toolkit

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
```

### 2. Start the Database

```bash
# Start PostgreSQL with Docker
bun run docker:up

# Verify database connection
bun run db:ping
```

### 3. Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Verify Setup

Visit [http://localhost:3000/api/health](http://localhost:3000/api/health) to verify:
- Database connectivity
- Application health status

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": {
    "connected": true,
    "latency": 5
  }
}
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public marketing pages
│   ├── (app)/              # Authenticated app pages
│   ├── api/                # API routes
│   └── middleware.ts       # Security headers, request ID
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── layout/             # Layout components
├── lib/
│   ├── security/           # Security utilities
│   │   ├── auth.ts         # Authentication helpers
│   │   ├── csrf.ts         # CSRF protection
│   │   ├── headers.ts      # Security headers
│   │   ├── rate-limit.ts   # Rate limiting
│   │   ├── ssrf.ts         # SSRF protection
│   │   └── validation.ts   # Input validation
│   ├── db/                 # Database client
│   ├── env.ts              # Environment validation
│   ├── errors.ts           # Error handling
│   └── logger.ts           # Logging with redaction
└── styles/                 # Global styles
tests/
├── unit/                   # Unit and property tests
└── setup.ts                # Test configuration
```

## Available Scripts

### Development

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
```

### Code Quality

```bash
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint issues
bun run typecheck    # Run TypeScript compiler
bun run format       # Format code with Prettier
bun run format:check # Check code formatting
```

### Testing

```bash
bun run test         # Run tests once
bun run test:watch   # Run tests in watch mode
bun run test:coverage # Run tests with coverage
```

### Database

```bash
bun run docker:up    # Start PostgreSQL
bun run docker:down  # Stop PostgreSQL
bun run docker:reset # Reset database (removes data)
bun run docker:tools # Start with pgAdmin
bun run db:ping      # Check database connectivity
bun run db:migrate   # Run migrations (TODO)
bun run db:seed      # Seed database (TODO)
```

### Security

```bash
bun run audit        # Run security audit
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | Environment (development/production/test) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | No | Public application URL |
| `CSRF_SECRET` | Prod | CSRF token secret (32+ chars) |
| `SESSION_SECRET` | Prod | Session secret (32+ chars) |

## Security Features

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

### Highlights

- **Security Headers** - CSP, HSTS, X-Frame-Options, and more
- **Input Validation** - Zod schemas for all user input
- **SSRF Protection** - Blocks requests to private IPs
- **Rate Limiting** - Configurable per-endpoint limits
- **Secret Redaction** - Automatic redaction in logs

## Updating Dependencies

1. **Check for updates:**
   ```bash
   bun outdated
   ```

2. **Update dependencies:**
   ```bash
   bun update
   ```

3. **Run security audit:**
   ```bash
   bun run audit
   ```

4. **Run full test suite:**
   ```bash
   bun run test
   bun run typecheck
   bun run lint
   ```

5. **Commit lockfile:**
   ```bash
   git add bun.lock
   git commit -m "chore: update dependencies"
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
