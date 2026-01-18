import argon2 from "argon2"
import { db } from "../drizzle/db"
import { passwordResetTable, userTable } from "../drizzle/schema/auth"
import { createSession, generateSessionToken } from "../lucia"
import postgres from "postgres"
import type { SignupSchema } from "../validators/signup"
import type { SigninSchema } from "../validators/signin"
import type { ResetPasswordSchema } from "../validators/reset-password"
import { errorResponse, successResponse } from "../utils/response"
import { encodeHexLowerCase } from "@oslojs/encoding"
import { sha256 } from "@oslojs/crypto/sha2"
import type { ApiResponse } from "../types"
import { eq } from "drizzle-orm"
import { type NewPasswordSchema } from "../validators/new-password"
import type { ParamTokenSchema } from "../validators/param"
import { isBefore } from "date-fns"

export const signUp = async (inputData: SignupSchema) => {
  const { password, ...userInput } = inputData
  const passwordHash = await argon2.hash(password)

  try {
    const [user] = await db
      .insert(userTable)
      .values({
        ...userInput,
        passwordHash,
      })
      .returning({ id: userTable.id })

    const token = generateSessionToken()
    await createSession(token, user.id)

    return { token }
  } catch (error) {
    if (error instanceof postgres.PostgresError && error.code === "23505") {
      return { token: null }
    }
    throw error
  }
}

export const signIn = async (inputData: SigninSchema) => {
  const { email, password } = inputData
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  })

  if (!user) {
    return { token: null, session: null }
  }

  if (!user.passwordHash) {
    return { token: null, session: null }
  }

  const validPassword = await argon2.verify(user.passwordHash, password)

  if (!validPassword) {
    return { token: null, session: null }
  }

  const token = generateSessionToken()
  const session = await createSession(token, user.id)

  return { token, session }
}

export const getPasswordResetToken = async (inputData: ResetPasswordSchema): Promise<ApiResponse<string>> => {
  const { email } = inputData
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  })

  if (!user) {
    return errorResponse("Unknown email address")
  }

  const token = generateSessionToken()
  const encodedToken = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  await db.insert(passwordResetTable).values({
    userId: user.id,
    token: encodedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 10),
  })

  return successResponse("Password reset token generated", token)
}

export const resetPassword = async (inputData: NewPasswordSchema & ParamTokenSchema) => {
  const { token, password } = inputData
  const encodedToken = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const response = await db.transaction(async (tx) => {
    const reset = await tx.query.passwordReset.findFirst({
      where: ({ token, used }, { eq, and, isNull }) => and(eq(token, encodedToken), isNull(used)),
    })

    if (!reset) {
      return errorResponse("Missing or invalid token provided")
    }

    if (isBefore(reset.expiresAt, new Date())) {
      return errorResponse("Token has already expired")
    }

    const passwordHash = await argon2.hash(password)
    await tx.update(userTable).set({ passwordHash }).where(eq(userTable.id, reset.userId))
    await tx.update(passwordResetTable).set({ used: new Date() }).where(eq(passwordResetTable.id, reset.id))

    return successResponse("Password updated")
  })

  return response
}
