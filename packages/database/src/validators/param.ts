import { z } from "zod/v4"

export const paramSlugSchema = z.object({
  slug: z.string().min(3).max(32),
})

export type ParamSlugSchema = z.infer<typeof paramSlugSchema>

export const paramIdSchema = z.object({
  id: z.coerce.number(),
})

export type ParamIdSchema = z.infer<typeof paramIdSchema>

export const paramUuidSchema = z.object({
  uuid: z.uuid(),
})

export type ParamUuidSchema = z.infer<typeof paramUuidSchema>

export const paramTokenSchema = z.object({
  token: z.string().min(20, { error: "Missing token. Token must be at least 20 characters" }),
})

export type ParamTokenSchema = z.infer<typeof paramTokenSchema>
