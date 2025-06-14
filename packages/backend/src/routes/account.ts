import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import type { User } from "database/src/drizzle/schema/auth"
import { getAccountInfo, type AccountInfo } from "database/src/queries/account-info"
import type { ErrorResponse, SuccessResponse } from "database/src/types"

export const accountRoute = new Hono<Context>()

accountRoute.get("/info", signedIn, async (c) => {
  const user = c.get("user") as User

  const accountInfo = await getAccountInfo({ userId: user.id })

  if (!accountInfo) {
    return c.json<ErrorResponse>({ success: false, error: "Account info not found" }, 404)
  }

  return c.json<SuccessResponse<AccountInfo>>({
    success: true,
    data: accountInfo,
    message: "Account info retrieved",
  })
})
