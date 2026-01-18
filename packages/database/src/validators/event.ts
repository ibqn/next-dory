import { z } from "zod"
import { event } from "./constants"
import { slugify } from "../utils/slugify"

export const eventIdSchema = z.uuid()

export const eventNameSchema = z
  .string()
  .min(event.name.minLength, {
    message: `Event name must have at least ${event.name.minLength} characters.`,
  })
  .max(event.name.maxLength, {
    message: `Event name must not exceed ${event.name.maxLength} characters.`,
  })

export const eventSlugSchema = z
  .string()
  .min(event.slug.minLength, {
    message: `Event slug must have at least ${event.slug.minLength} characters.`,
  })
  .max(event.slug.maxLength, {
    message: `Event slug must not exceed ${event.slug.maxLength} characters.`,
  })
  .refine(
    (str) => {
      return str === slugify(str)
    },
    {
      message:
        "Event slug must contain only lowercase letters, numbers, and hyphens. No spaces or special characters allowed.",
    }
  )

export const descriptionSchema = z
  .string()
  .min(event.description.minLength, {
    message: `Event description must have at least ${event.description.minLength} characters.`,
  })
  .max(event.description.maxLength, {
    message: `Event description must not exceed ${event.description.maxLength} characters.`,
  })

export const createEventSchema = z.object({
  name: eventNameSchema,
  slug: eventSlugSchema,
  description: descriptionSchema,
})

export const updateEventSchema = z.object({
  eventId: eventIdSchema,
  name: eventNameSchema.optional(),
  slug: eventSlugSchema.optional(),
  description: descriptionSchema.optional(),
})

export const deleteEventSchema = z.object({
  eventId: eventIdSchema,
})

export const eventPublicIdSchema = z.object({
  eventId: eventIdSchema,
  eventSlug: eventSlugSchema,
})

export type CreateEventSchema = z.infer<typeof createEventSchema>
export type UpdateEventSchema = z.infer<typeof updateEventSchema>
export type DeleteEventSchema = z.infer<typeof deleteEventSchema>
