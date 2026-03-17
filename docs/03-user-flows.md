# User Flows

## 1. Public Booking Flow
1. User opens landing page
2. User views services/packages
3. User selects a service/package
4. User clicks "Book Now"
5. User opens booking form
6. User fills personal details
7. User selects preferred date
8. System shows available time slots
9. User selects preferred time slot
10. User submits booking request
11. System validates request
12. System creates booking with `pending` status
13. User sees confirmation message and booking reference

## 2. Admin Booking Review Flow
1. Admin logs into dashboard
2. Admin sees booking list
3. Admin opens booking detail
4. Admin reviews customer info, package, date, time
5. Admin confirms slot availability
6. Admin chooses action:
   - confirm
   - reject
   - request reschedule
   - cancel
7. System updates booking status
8. System locks or frees slot as needed

## 3. Availability Management Flow
1. Admin opens availability management
2. Admin selects date
3. Admin adds or edits available time slots
4. Admin blocks unavailable slots if needed
5. System saves slot rules
6. Booking form only shows available slots

## 4. Booking Conflict Prevention Flow
1. User chooses date + time
2. System checks slot availability
3. If slot unavailable:
   - show validation error
   - prevent submission
4. If slot available:
   - allow submission
5. Before confirm:
   - admin re-checks availability
6. If conflict occurs due to race condition:
   - latest invalid action must fail gracefully