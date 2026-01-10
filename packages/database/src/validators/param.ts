import { z } from "zod"

export const paramSlugSchema = z.object({
  slug: z.string().min(3).max(32),
})

export type ParamSlugSchema = z.infer<typeof paramSlugSchema>

export const paramIdSchema = z.object({
  id: z.uuid(),
})

export type ParamIdSchema = z.infer<typeof paramIdSchema>

export const paramTokenSchema = z.object({
  token: z.string().min(20, { error: "Missing token. Token must be at least 20 characters" }),
})

export type ParamTokenSchema = z.infer<typeof paramTokenSchema>
