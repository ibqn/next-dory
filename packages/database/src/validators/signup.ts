import { z } from "zod/v4"

export const signupSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.email(),
  password: z.string().min(6),
})

export type SignupSchema = z.infer<typeof signupSchema>

export const signupFormSchema = signupSchema
  .extend({
    confirm: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords do not match",
  })

export type SignupFormSchema = z.infer<typeof signupFormSchema>
