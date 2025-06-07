import { z } from "zod/v4"
import { paginationSchema } from "./pagination"
import { createInsertSchema } from "drizzle-zod"
import { userTable } from "../drizzle/schema/auth"

export const createUserSchema = createInsertSchema(userTable, {
  username: z.string().nonempty(),
  email: z.email(),
}).omit({ id: true, createdAt: true, updatedAt: true, passwordHash: true })

export type CreateUserSchema = z.infer<typeof createUserSchema>

export const updateUserSchema = createInsertSchema(userTable, {
  username: z.string().nonempty(),
  email: z.email(),
  emailVerified: z.coerce.date().nullable().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true, passwordHash: true })

export type UpdateUserSchema = z.infer<typeof updateUserSchema>

export const userSearchSchema = paginationSchema
export type UserSearchSchema = z.infer<typeof userSearchSchema>
