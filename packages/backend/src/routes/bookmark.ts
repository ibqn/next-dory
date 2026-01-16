import { Hono } from "hono"
import type { ExtEnv } from "../utils/extended-env"
import { signedIn } from "../middleware/signed-in"
import type { User } from "database/src/drizzle/schema/auth"
import type { SuccessResponse } from "database/src/types"
import { zValidator } from "../utils/z-validator"
import { paramIdSchema } from "database/src/validators/param"
import { toggleEventBookmark } from "database/src/queries/event-bookmark"
import type { EventBookmark } from "database/src/drizzle/schema/event"

export const bookmarkRoute = new Hono<ExtEnv>()

bookmarkRoute.get("/event/:id", signedIn, zValidator("param", paramIdSchema), async (c) => {
  const user = c.get("user") as User

  const { id: eventId } = c.req.valid("param")

  const eventBookmark = await toggleEventBookmark({ eventId, userId: user.id })

  return c.json<SuccessResponse<EventBookmark>>({
    success: true,
    data: eventBookmark,
    message: "Event bookmark toggled",
  })
})
