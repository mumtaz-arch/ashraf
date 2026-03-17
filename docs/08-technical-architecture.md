
# Technical Architecture

## Mandatory Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- Supabase PostgreSQL
- Docker
- No CDN

## Frontend Principles
- responsive first
- reusable UI components
- use shadcn/ui before creating custom complex components
- keep forms clean and validated
- prefer server-safe patterns where possible

## Backend Principles
- route handlers for APIs
- Prisma for DB access
- Zod validation
- keep services modular
- avoid fat page files

## Recommended Folder Structure
```text
src/
├── app/
│   ├── (public)/
│   ├── admin/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── shared/
│   ├── booking/
│   ├── services/
│   └── admin/
├── lib/
│   ├── prisma.ts
│   ├── supabase.ts
│   ├── utils.ts
│   └── validations/
├── hooks/
├── services/
├── types/
└── constants/
Data Access Rules

Prisma is the primary DB access layer

Supabase JS may be used for:

auth (future)

storage (future)

special platform utilities if needed

Do not mix raw SQL unless necessary

Use transactions for conflict-sensitive operations

DevOps Rules

must run locally with npm run dev

must run in Docker with docker compose up --build

environment variables must be documented in .env.example