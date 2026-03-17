import { z } from "zod"

export const serviceCreateSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().max(1000).optional(),
  price: z.number().positive("Price must be positive"),
  durationMinutes: z.number().int().positive("Duration must be positive"),
  isActive: z.boolean().optional(),
})

export const serviceUpdateSchema = serviceCreateSchema.partial()

export type ServiceCreateValues = z.infer<typeof serviceCreateSchema>
export type ServiceUpdateValues = z.infer<typeof serviceUpdateSchema>
