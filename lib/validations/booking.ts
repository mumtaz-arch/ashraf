import { z } from "zod"

export const bookingFormSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  customerPhone: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be at most 20 characters"),
  customerEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  serviceId: z.string().uuid("Invalid service selection"),
  slotId: z.string().uuid("Invalid time slot selection"),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  customerNote: z.string().max(500, "Note must be at most 500 characters").optional(),
})

export type BookingFormValues = z.infer<typeof bookingFormSchema>
