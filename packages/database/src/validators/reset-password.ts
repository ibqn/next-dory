import { z } from "zod/v3"

export const resetPasswordSchema = z.object({
  email: z.string().email(),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
