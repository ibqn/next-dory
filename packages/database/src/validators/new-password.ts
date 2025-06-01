import { z } from "zod/v3"

export const newPasswordSchema = z.object({
  password: z.string().trim().min(6, { message: "Minimum 6 characters required" }),
})

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>
