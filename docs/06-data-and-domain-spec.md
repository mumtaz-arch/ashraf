# Data and Domain Specification

## Important Note
This document describes domain concepts only.
It is NOT the final database schema.
The final Prisma schema should be designed later in a dedicated database design phase.

## Core Domain Entities (Conceptual)

### 1. Service
Represents a photography package or service offering.

Suggested fields (conceptual):
- name
- slug
- description
- price
- durationMinutes
- isActive

### 2. Booking
Represents a customer appointment request.

Suggested fields (conceptual):
- referenceCode
- customerName
- customerPhone
- customerEmail
- serviceId
- preferredDate
- preferredTime
- status
- customerNote
- adminNote
- createdAt
- updatedAt

### 3. AvailabilitySlot
Represents a date/time slot that may be bookable.

Suggested fields (conceptual):
- date
- startTime
- endTime
- isAvailable
- isBlocked
- note

### 4. AdminUser
Represents photographer/admin access.

Suggested fields (conceptual):
- name
- email
- passwordHash
- role
- isActive

## Booking Status Lifecycle
Allowed statuses:
- pending
- confirmed
- rejected
- cancelled
- completed
- rescheduled

## Business Rules (Conceptual)
1. A confirmed booking must not overlap another confirmed booking for the same slot.
2. Pending bookings may exist temporarily but should still be revalidated before confirmation.
3. Blocked slots must not be selectable.
4. Inactive services must not be publicly bookable.
5. Booking reference code should be unique.
6. Admin must be able to override with explicit action (future policy decision).