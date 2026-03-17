import { z } from "zod"

export const availabilityCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  isBlocked: z.boolean().optional(),
  note: z.string().max(500).optional(),
})

export const availabilityUpdateSchema = availabilityCreateSchema.partial()

export type AvailabilityCreateValues = z.infer<typeof availabilityCreateSchema>
export type AvailabilityUpdateValues = z.infer<typeof availabilityUpdateSchema>
