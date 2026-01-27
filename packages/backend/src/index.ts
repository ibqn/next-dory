import { serve } from "@hono/node-server"
import { Hono } from "hono"
import type { ExtEnv } from "./utils/extended-env"
import { prettyJSON } from "hono/pretty-json"
import { error as errorResponse, response, type ErrorResponse, type SuccessResponse } from "shared/src/response"
import { HTTPException } from "hono/http-exception"
import { getErrorMessage } from "./utils/error"
import { cors } from "hono/cors"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { validateSessionToken } from "database/src/lucia"
import { authRoute } from "./routes/auth"
import { getSessionCookieOptions, sessionCookieName } from "database/src/cookie"
import { pinoLogger } from "./middleware/pino-logger"
import { env } from "./env"
import { userRoute } from "./routes/user"
import { socialAuthRoute } from "./routes/social-auth"
import { eventRoute } from "./routes/event"
import { accountRoute } from "./routes/account"
import { bookmarkRoute } from "./routes/bookmark"
import { questionRoute } from "./routes/question"

const app = new Hono<ExtEnv>()

app.use(pinoLogger())
app.use(prettyJSON())

app.notFound((c) => c.json<ErrorResponse<string>>(errorResponse("Not Found"), 404))

app.get("/", (c) => c.json<SuccessResponse>(response("Hello Hono!"), 201))

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    const response = error.res ?? c.json<ErrorResponse>(errorResponse(error.message), error.status)
    return response
  }

  return c.json<ErrorResponse>({ success: false, error: getErrorMessage(error) }, 500)
})

app.use(
  "*",
  cors({
    origin: (origin) => {
      // console.log("origin", origin)
      if (origin.includes("localhost") || origin.includes(env.FRONTEND_URL)) {
        return origin
      }
    },
    credentials: true,
  }),
  async (c, next) => {
    const token = getCookie(c, sessionCookieName)
    if (!token) {
      c.set("user", null)
      c.set("session", null)
      return await next()
    }

    const { session, user } = await validateSessionToken(token)
    if (session) {
      setCookie(c, sessionCookieName, token, getSessionCookieOptions())
    } else {
      deleteCookie(c, sessionCookieName)
    }
    c.set("session", session)
    c.set("user", user)

    await next()
  }
)

export const routes = app
  .route("/auth", socialAuthRoute)
  .basePath("/api")
  .route("/auth", authRoute)
  .route("/user", userRoute)
  .route("/event", eventRoute)
  .route("/question", questionRoute)
  .route("/account", accountRoute)
  .route("/bookmark", bookmarkRoute)

const port = env.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
