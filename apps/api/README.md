# RiseUp Africa API

Backend API for the RiseUp Africa platform - empowering marginalized African youth with verified access to post-secondary opportunities.

## Tech Stack

- **Node.js** + **TypeScript**
- **Express** - REST API framework
- **Prisma** - ORM with PostgreSQL
- **Zod** - Input validation
- **JWT** + **bcrypt** - Authentication & password hashing

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env` file in `apps/api/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/riseup_africa?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=4000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed database (optional)
pnpm prisma:seed
```

### 4. Run Development Server

```bash
pnpm dev
```

The API will be available at `http://localhost:4000`

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:seed` - Seed database with test data
- `pnpm prisma:studio` - Open Prisma Studio

## API Endpoints

### Authentication (Public)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User (Authenticated)

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/documents` - Get user documents
- `GET /api/user/verification` - Get verification status

### Documents (Youth Only)

- `POST /api/verification/documents` - Upload document

### Verification (Admin)

- `GET /api/verification/pending` - Get pending verifications
- `PUT /api/verification/:verificationId/review` - Review verification
- `PUT /api/verification/:verificationId/assign` - Assign field agent

### Field Agent

- `GET /api/verification/field-agent` - Get assigned verifications
- `POST /api/verification/field-visit` - Create field visit
- `PUT /api/verification/:verificationId/complete` - Complete verification

### Search (Donor/Admin)

- `GET /api/verification/search` - Search youth by filters

### Opportunities

- `GET /api/opportunities` - List opportunities (public)
- `GET /api/opportunities/:opportunityId` - Get opportunity details (public)
- `POST /api/opportunities` - Create opportunity (Donor)
- `PUT /api/opportunities/:opportunityId` - Update opportunity (Donor)
- `DELETE /api/opportunities/:opportunityId` - Delete opportunity (Donor)

### Applications

- `POST /api/applications` - Apply to opportunity (Youth)
- `GET /api/applications/my-applications` - Get my applications (Youth)
- `GET /api/applications/opportunity/:opportunityId` - Get applications for opportunity (Donor)
- `PUT /api/applications/:applicationId/status` - Update application status (Donor)
- `GET /api/applications/:applicationId` - Get application details

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Roles

- **YOUTH** - Marginalized youth seeking opportunities
- **DONOR** - Organizations posting opportunities
- **ADMIN** - Platform administrators
- **FIELD_AGENT** - Field verification agents

## Database Models

- **User** - All platform users with role-based fields
- **Document** - Uploaded documents (ID, transcript, recommendation letter)
- **Verification** - Youth verification workflow
- **FieldVisit** - On-site verification visits
- **Opportunity** - Post-secondary opportunities posted by donors
- **Application** - Youth applications to opportunities

## Status Enums

### VerificationStatus
- `PENDING` - Awaiting review
- `UNDER_REVIEW` - Under field verification
- `VERIFIED` - Verified and approved
- `REJECTED` - Rejected

### ApplicationStatus
- `PENDING` - Application submitted
- `UNDER_REVIEW` - Under review
- `SELECTED` - Selected for opportunity
- `REJECTED` - Application rejected

### YouthCategory
- `REFUGEE` - Refugee
- `IDP` - Internally Displaced Person
- `VULNERABLE` - Vulnerable youth
- `PWD` - Person with Disability

## Test Credentials (from seed)

- **Admin**: `admin@riseupafrica.org` / `password123`
- **Field Agent**: `fieldagent@riseupafrica.org` / `password123`
- **Donor**: `donor@example.org` / `password123`
- **Youth**: `youth@example.com` / `password123`

## Development

This API is part of a PNPM + Turbo monorepo. To run with Turbo:

```bash
# From root
turbo dev    # Runs all dev servers
turbo build  # Builds all packages
```

## License

ISC

