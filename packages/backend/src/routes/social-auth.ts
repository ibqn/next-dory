import type { ExtEnv } from "../utils/extended-env"
import { Hono } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { createSession, generateSessionToken } from "database/src/lucia"
import { getSessionCookieOptions, sessionCookieName } from "database/src/cookie"
import { decodeIdToken, generateCodeVerifier, generateState, type OAuth2Tokens } from "arctic"
import { github, google } from "../lib/oauth"
import { createAccount } from "database/src/queries/account"
import { createUserItem } from "database/src/queries/user"
import { env } from "../env"
import axios from "axios"
import { z } from "zod"
import { Provider } from "database/src/types"

const socialAuthRoute = new Hono<ExtEnv>()
  .get("/sign-in/github", async (c) => {
    const state = generateState()
    const scopes = ["user:email"]

    const url = github.createAuthorizationURL(state, scopes)

    setCookie(c, "github_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    })

    return c.redirect(url.toString(), 302)
  })
  .get("/sign-in/github/callback", async (c) => {
    const { code, state } = c.req.query()

    console.log("code", code, "state", state)
    const storedState = getCookie(c, "github_oauth_state") ?? null
    if (code === null || state === null || storedState === null) {
      console.error("Missing code or state in query parameters or cookie")
      return c.body(null, { status: 400 })
    }
    if (state !== storedState) {
      console.error("State mismatch: expected", storedState, "but got", state)
      return c.body(null, { status: 400 })
    }

    let tokens: OAuth2Tokens
    try {
      tokens = await github.validateAuthorizationCode(code)
    } catch (error) {
      console.error(error)
      // Invalid code or client credentials
      return c.body(null, { status: 400 })
    }
    const config = { headers: { Authorization: `Bearer ${tokens.accessToken()}` } }
    const { data: githubUserData } = await axios.get("https://api.github.com/user", config)

    const githubUserResponse = z
      .object({
        id: z.number(),
        login: z.string(),
        avatar_url: z.url(),
      })
      .safeParse(githubUserData)

    if (!githubUserResponse.success) {
      console.error("Invalid GitHub user response", githubUserResponse.error)
      return c.body(null, { status: 400 })
    }

    const githubUser = githubUserResponse.data

    console.log("github user", githubUser)

    const { data: emailListData } = await axios.get("https://api.github.com/user/emails", config)

    const emailListResponse = z
      .array(
        z.object({
          email: z.email(),
          primary: z.boolean(),
          verified: z.boolean(),
        })
      )
      .safeParse(emailListData)

    if (!emailListResponse.success) {
      console.error("Invalid email list response", emailListResponse.error)
      return c.body(null, { status: 400 })
    }

    const emailListResult = emailListResponse.data

    console.log("email list", emailListResult)

    const emailItem = emailListResult.find((emailItem) => emailItem.primary && emailItem.verified)
    if (!emailItem) {
      console.error("No primary verified email found")
      return c.body(null, { status: 400 })
    }
    const username = githubUser.login
    const email = emailItem.email
    const avatarUrl = githubUser.avatar_url

    const user = await createUserItem({ username, email, avatarUrl })

    const providerAccountId = githubUser.id.toString()

    await createAccount(user.id, Provider.github, providerAccountId)

    const token = generateSessionToken()
    const session = await createSession(token, user.id)

    setCookie(c, sessionCookieName, token, getSessionCookieOptions(session.expiresAt))

    return c.redirect(env.FRONTEND_URL, 302)
  })
  .get("/sign-in/google", async (c) => {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const scopes = ["openid", "profile", "email"]

    const url = google.createAuthorizationURL(state, codeVerifier, scopes)

    setCookie(c, "google_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    })

    setCookie(c, "google_oauth_code_verifier", codeVerifier, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    })

    return c.redirect(url.toString(), 302)
  })
  .get("/sign-in/google/callback", async (c) => {
    const { code, state } = c.req.query()

    console.log("code", code, "state", state)
    const storedState = getCookie(c, "google_oauth_state") ?? null
    const storedCodeVerifier = getCookie(c, "google_oauth_code_verifier") ?? null
    if (code === null || state === null || storedState === null || storedCodeVerifier === null) {
      return c.body(null, { status: 400 })
    }
    if (state !== storedState) {
      return c.body(null, { status: 400 })
    }

    let tokens: OAuth2Tokens
    try {
      tokens = await google.validateAuthorizationCode(code, storedCodeVerifier)
    } catch (error) {
      console.error(error)
      // Invalid code or client credentials
      return c.body(null, { status: 400 })
    }

    const claims = decodeIdToken(tokens.idToken())

    const googleUserSchema = z.object({
      sub: z.string(),
      name: z.string(),
      picture: z.string(),
      email: z.email(),
    })

    const googleUserSchemaResult = googleUserSchema.safeParse(claims)
    if (!googleUserSchemaResult.success) {
      console.error("Invalid Google user data", googleUserSchemaResult.error)
      return c.body(null, { status: 400 })
    }
    const googleUser = googleUserSchemaResult.data

    console.log("google user", googleUser)

    const googleUserId = googleUser.sub
    const email = googleUser.email
    const username = googleUser.name
    const avatarUrl = googleUser.picture

    const user = await createUserItem({ username, email, avatarUrl })

    const providerAccountId = googleUserId

    await createAccount(user.id, Provider.google, providerAccountId)

    const token = generateSessionToken()
    const session = await createSession(token, user.id)

    setCookie(c, sessionCookieName, token, getSessionCookieOptions(session.expiresAt))

    return c.redirect(env.FRONTEND_URL, 302)
  })

export { socialAuthRoute }
