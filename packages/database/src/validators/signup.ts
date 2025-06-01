import { z } from "zod/v3"

export const signupSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6),
})

export type SignupSchema = z.infer<typeof signupSchema>

export const signupFormSchema = signupSchema
  .extend({
    confirm: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

export type SignupFormSchema = z.infer<typeof signupFormSchema>
