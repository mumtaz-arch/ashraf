# Product Requirements Document (PRD)

## 1. Product Summary
This product is a booking appointment system for a photographer. It enables users to browse photography services, select a date and time, submit booking requests, and track appointment status. The photographer/admin can manage availability, confirm bookings, and prevent schedule conflicts.

## 2. Problem Statement
Many photographers handle bookings manually through chat applications. This causes:
- delayed responses
- scheduling confusion
- missed inquiries
- double-booking risk
- poor client experience
- scattered customer data

## 3. Proposed Solution
Provide a dedicated booking platform where:
- customers can see available services
- customers can choose appointment date/time
- booking requests are submitted through a structured flow
- admin can confirm, reject, reschedule, or complete bookings
- availability is managed centrally

## 4. Primary Goals
- simplify appointment booking
- reduce manual admin work
- improve customer trust and professionalism
- prevent booking conflicts
- prepare a scalable foundation for future payment and notification features

## 5. MVP Scope
### Included
- responsive landing page
- service/package listing
- booking form
- date picker
- time slot picker
- appointment request submission
- booking status model (pending, confirmed, completed, cancelled, rejected, rescheduled)
- admin dashboard basic booking management
- availability slot management (basic)
- booking detail view

### Excluded from MVP
- payment gateway
- invoice automation
- WhatsApp API integration
- email automation
- public user profile system
- photographer portfolio CMS advanced version
- discount engine
- coupon system
- calendar sync with Google Calendar

## 6. Core Features
1. Public landing page
2. Service/package catalog
3. Booking request form
4. Availability and slot selection
5. Booking validation
6. Admin booking management
7. Booking status tracking
8. Basic availability management
9. Contact information display

## 7. Key Constraints
- stack must remain:
  - Next.js App Router
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Prisma
  - Supabase PostgreSQL
  - Docker
- no CDN
- no unnecessary packages
- future AI agents must follow existing project structure

## 8. Success Metrics (MVP)
- successful booking submission rate > 90%
- no confirmed double-booking
- admin can update booking status in under 30 seconds
- mobile usability is acceptable
- all core pages load and function without runtime errors