# Acceptance Checklist

## Global Acceptance Criteria
- [ ] Stack remains unchanged
- [ ] No CDN usage
- [ ] Project runs locally
- [ ] Project runs in Docker
- [ ] Prisma remains the primary DB access layer
- [ ] Supabase PostgreSQL remains the DB provider
- [ ] UI is responsive
- [ ] Forms are validated
- [ ] API responses are structured consistently

## MVP Booking Acceptance
- [ ] User can view services
- [ ] User can open booking form
- [ ] User can select date
- [ ] User can see available slots
- [ ] User can submit booking request
- [ ] Booking is created with pending status
- [ ] Booking reference is generated
- [ ] User sees booking success state

## Admin Acceptance
- [ ] Admin can view booking list
- [ ] Admin can open booking detail
- [ ] Admin can confirm booking
- [ ] Admin can reject booking
- [ ] Admin can cancel booking
- [ ] Admin can mark booking completed
- [ ] Admin can manage availability
- [ ] Admin can manage services

## Data Integrity Acceptance
- [ ] Confirmed bookings cannot double-book the same slot
- [ ] Blocked slots are not selectable
- [ ] Inactive services are not publicly bookable
- [ ] Invalid input is rejected safely