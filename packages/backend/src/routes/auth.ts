import type { Context } from "../utils/context"
import { Hono } from "hono"
import { signinSchema } from "database/src/validators/signin"
import { signupSchema } from "database/src/validators/signup"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import type { ApiResponse, ErrorResponse, SuccessResponse } from "database/src/types"
import { HTTPException } from "hono/http-exception"
import { signedIn } from "../middleware/signed-in"
import { getPasswordResetToken, resetPassword, signIn, signUp } from "database/src/queries/auth"
import type { User, Session } from "database/src/drizzle/schema/auth"
import { invalidateSessionToken, type SessionValidationResult } from "database/src/lucia"
import { getSessionCookieOptions, sessionCookieName } from "database/src/cookie"
import { resetPasswordSchema } from "database/src/validators/reset-password"
import { sendPasswordResetEmail } from "../lib/email"
import { newPasswordSchema } from "database/src/validators/new-password"
import { paramTokenSchema } from "database/src/validators/param"
import { zValidator } from "../utils/z-validator"

const authRoute = new Hono<Context>()
  .post("/signup", zValidator("json", signupSchema), async (c) => {
    const inputData = c.req.valid("json")

    const { token } = await signUp(inputData)

    if (!token) {
      throw new HTTPException(409, { message: "Username already exists" })
    }

    setCookie(c, sessionCookieName, token, getSessionCookieOptions())
    return c.json<SuccessResponse>({ success: true, message: "User created" }, 201)
  })
  .post("/signin", zValidator("json", signinSchema), async (c) => {
    const inputData = c.req.valid("json")

    const { token } = await signIn(inputData)

    if (!token) {
      throw new HTTPException(401, { message: "Invalid username or password" })
    }

    setCookie(c, sessionCookieName, token, getSessionCookieOptions())
    return c.json<SuccessResponse>({ success: true, message: "Signed in" }, 201)
  })
  .get("/signout", signedIn, async (c) => {
    const token = getCookie(c, sessionCookieName)
    if (token) {
      await invalidateSessionToken(token)
      deleteCookie(c, sessionCookieName)
      return c.json<SuccessResponse>({ success: true, message: "Signed out" })
    }
    throw new HTTPException(401, { message: "You must be signed in to sign out" })
  })
  .get("/user", signedIn, async (c) => {
    const user = c.get("user") as User
    return c.json<SuccessResponse<User>>({ success: true, data: user, message: "User data" })
  })
  .get("/validate", async (c) => {
    const user = c.get("user") as User
    const session = c.get("session") as Session

    // console.log("user", user, "session", session)
    return c.json<SuccessResponse<SessionValidationResult>>({
      success: true,
      message: "Session validation result",
      data: { user, session },
    })
  })
  .post("/reset-password", zValidator("json", resetPasswordSchema), async (c) => {
    const { email } = c.req.valid("json")

    const response = await getPasswordResetToken({ email })
    if (!response.success) {
      return c.json<ErrorResponse>(response, 404)
    }

    const { data: token } = response

    await sendPasswordResetEmail(email, token)
    return c.json<SuccessResponse>({ success: true, message: "Email with password reset token sent" })
  })
  .post(
    "/reset-password/:token",
    zValidator("param", paramTokenSchema),
    zValidator("json", newPasswordSchema),
    async (c) => {
      const { token } = c.req.valid("param")
      const { password } = c.req.valid("json")

      const response = await resetPassword({ token, password })
      const responseCode = response.success ? 200 : 400

      return c.json<ApiResponse>(response, responseCode)
    }
  )

export { authRoute }
