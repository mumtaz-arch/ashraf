# Pages and UI Specification

## Public Pages

### 1. Home (`/`)
Purpose:
- present brand
- explain services
- direct users to booking

Sections:
- navbar
- hero
- services preview
- why choose us
- process steps
- CTA banner
- contact/footer

### 2. Services (`/services`)
Purpose:
- display all photography packages

Elements:
- package cards
- price
- duration
- short description
- book now button

### 3. Booking (`/booking`)
Purpose:
- collect booking request data

Elements:
- booking form
- service selector
- date picker
- time slot selector
- note textarea
- submit button
- validation messages

### 4. Booking Success (`/booking/success`)
Purpose:
- show confirmation after booking

Elements:
- success state
- booking reference
- next step info
- back to home
- contact CTA

---

## Admin Pages

### 5. Admin Login (`/admin/login`)
Purpose:
- authenticate admin

### 6. Admin Dashboard (`/admin`)
Purpose:
- quick summary

Elements:
- booking counts
- pending bookings
- upcoming bookings
- recent activity

### 7. Admin Bookings (`/admin/bookings`)
Purpose:
- list and manage bookings

Elements:
- table
- filters
- search
- status badges
- action buttons

### 8. Admin Booking Detail (`/admin/bookings/[id]`)
Purpose:
- inspect and manage one booking

Elements:
- customer info
- service info
- schedule info
- status controls
- admin note

### 9. Admin Availability (`/admin/availability`)
Purpose:
- manage date/time slots

Elements:
- calendar/date selector
- slot list
- add slot button
- block/unblock actions

### 10. Admin Services (`/admin/services`)
Purpose:
- manage service packages

Elements:
- list of services
- create/edit/delete actions