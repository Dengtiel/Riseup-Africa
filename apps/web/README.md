# RiseUp Africa Frontend

Next.js 14 frontend for the RiseUp Africa platform.

## Features

- **Authentication**: Login and registration with role-based access
- **Youth Dashboard**: Profile management, document upload, verification tracking, opportunity browsing, and application management
- **Donor Dashboard**: Post and manage opportunities, search for verified youth, view applicants
- **Admin Dashboard**: Review and approve verifications, assign field agents
- **Field Agent Dashboard**: Manage field visit assignments and complete verifications

## Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Run development server**:
   ```bash
   pnpm dev
   ```

   Or from the monorepo root:
   ```bash
   turbo dev
   ```

## Project Structure

```
apps/web/
├── app/                    # Next.js app router pages
│   ├── dashboard/          # Dashboard pages (protected)
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── dashboard-layout.tsx
│   ├── role-sidebar.tsx
│   └── ...
├── hooks/                  # React hooks
│   └── use-auth.tsx        # Authentication hook
├── lib/                    # Utilities
│   ├── api.ts              # API client
│   └── types.ts            # TypeScript types
└── middleware.ts           # Route protection
```

## Pages

### Public Pages
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Youth Dashboard
- `/dashboard` - Overview
- `/dashboard/profile` - Profile management
- `/dashboard/documents` - Upload documents
- `/dashboard/verification` - Verification status
- `/dashboard/opportunities` - Browse opportunities
- `/dashboard/applications` - My applications

### Donor Dashboard
- `/dashboard` - Overview
- `/dashboard/opportunities` - Manage opportunities
- `/dashboard/opportunities/new` - Post new opportunity
- `/dashboard/opportunities/[id]` - Opportunity details
- `/dashboard/opportunities/[id]/applications` - View applicants
- `/dashboard/search` - Search verified youth

### Admin Dashboard
- `/dashboard` - Overview
- `/dashboard/verifications` - Review verifications

### Field Agent Dashboard
- `/dashboard` - Overview
- `/dashboard/assignments` - Manage assignments
- `/dashboard/visits` - Field visits

## Tech Stack

- **Next.js 14** - React framework with app router
- **TypeScript** - Type safety
- **ShadCN UI** - Component library
- **Tailwind CSS** - Styling
- **React Hooks** - State management
- **Sonner** - Toast notifications

## Authentication

Authentication is handled client-side using JWT tokens stored in localStorage. The `useAuth` hook provides:
- `user` - Current user object
- `login()` - Login function
- `register()` - Registration function
- `logout()` - Logout function
- `refreshUser()` - Refresh user data

## API Integration

All API calls are made through the `api` client in `lib/api.ts`. The client automatically:
- Adds JWT tokens to requests
- Handles errors
- Manages authentication state

## Development

The frontend is fully integrated into the PNPM + Turbo monorepo:
- Works with `turbo dev` from root
- Shares UI components from `packages/ui`
- Uses shared TypeScript config

