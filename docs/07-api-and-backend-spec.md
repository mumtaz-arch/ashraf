# API and Backend Specification

## Architecture Style
- Use Next.js App Router
- Use Route Handlers for API endpoints
- Use Prisma for database access
- Use Supabase PostgreSQL as database provider
- Keep API logic modular in `src/services` where useful

## MVP API Surface (Planned)

### Public Endpoints
- `GET /api/services`
- `GET /api/availability?date=YYYY-MM-DD`
- `POST /api/bookings`

### Admin Endpoints
- `GET /api/admin/bookings`
- `GET /api/admin/bookings/:id`
- `PATCH /api/admin/bookings/:id`
- `GET /api/admin/availability`
- `POST /api/admin/availability`
- `PATCH /api/admin/availability/:id`
- `DELETE /api/admin/availability/:id`
- `GET /api/admin/services`
- `POST /api/admin/services`
- `PATCH /api/admin/services/:id`
- `DELETE /api/admin/services/:id`

## Backend Rules
1. Validate input using Zod.
2. Do not place business logic directly in page components if avoidable.
3. Prefer service/helper modules for reusable logic.
4. All write operations must validate business constraints.
5. Booking creation must validate slot availability.
6. Booking confirmation must revalidate slot availability.
7. Return structured JSON responses.

## Standard API Response Shape
### Success
```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
{
  "success": false,
  "message": "Human readable error",
  "errors": {}
}