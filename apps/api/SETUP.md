# Setup Guide

## Quick Start

1. **Install dependencies** (from monorepo root):
   ```bash
   pnpm install
   ```

2. **Create `.env` file** in `apps/api/`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/riseup_africa?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   PORT=4000
   NODE_ENV=development
   ```

3. **Generate Prisma client**:
   ```bash
   cd apps/api
   pnpm prisma:generate
   ```

4. **Run database migrations**:
   ```bash
   pnpm prisma:migrate
   ```

5. **Seed database** (optional):
   ```bash
   pnpm prisma:seed
   ```

6. **Start development server**:
   ```bash
   pnpm dev
   ```

## Important Notes

- **Prisma Client**: The Prisma client must be generated before the TypeScript compiler can resolve types. Run `pnpm prisma:generate` first.

- **Database**: Make sure PostgreSQL is running and the `DATABASE_URL` is correct.

- **TypeScript Errors**: Some TypeScript errors may appear until `pnpm prisma:generate` is run. This is normal.

## Testing the API

After setup, test with:

```bash
# Health check
curl http://localhost:4000/health

# Register a user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "YOUTH"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Monorepo Integration

This API is fully integrated into the PNPM + Turbo monorepo:

- Works with `turbo dev` from root
- Works with `turbo build` from root
- Uses workspace dependencies
- Follows monorepo conventions

