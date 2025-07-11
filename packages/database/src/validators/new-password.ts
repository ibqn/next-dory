import { z } from "zod"

export const newPasswordSchema = z.object({
  password: z.string().trim().min(6, { error: "Minimum 6 characters required" }),
})

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>
