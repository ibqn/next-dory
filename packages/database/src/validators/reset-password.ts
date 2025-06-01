import { z } from "zod/v4"

export const resetPasswordSchema = z.object({
  email: z.email(),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
