import { Hono } from "hono"
import type { ExtEnv } from "../utils/extended-env"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import { paginationSchema } from "database/src/validators/pagination"
import {
  getEventItemsCount,
  getEventItems,
  getEventItem,
  getBookmarkedEventItemsCount,
  getBookmarkedEventItems,
} from "database/src/queries/event"
import type { User } from "database/src/drizzle/schema/auth"
import type { Event } from "database/src/drizzle/schema/event"
import type { ErrorResponse, PaginatedSuccessResponse, SuccessResponse } from "database/src/types"
import { paramUuidSchema } from "database/src/validators/param"

export const eventRoute = new Hono<ExtEnv>()

eventRoute
  .get("/", signedIn, zValidator("query", paginationSchema), async (c) => {
    const query = c.req.valid("query")
    const { page, limit } = query

    const eventCount = await getEventItemsCount()
    const eventItems = await getEventItems(query)

    return c.json<PaginatedSuccessResponse<Event[]>>({
      success: true,
      data: eventItems,
      message: "Event items retrieved",
      pagination: { page, totalPages: Math.ceil(eventCount / limit), totalItems: eventCount },
    })
  })
  .get("/bookmarked", signedIn, zValidator("query", paginationSchema), async (c) => {
    const query = c.req.valid("query")
    const { page, limit } = query
    const user = c.get("user") as User

    const eventCount = await getBookmarkedEventItemsCount({ userId: user.id })
    const eventItems = await getBookmarkedEventItems({ userId: user.id, ...query })

    return c.json<PaginatedSuccessResponse<Event[]>>({
      success: true,
      data: eventItems,
      message: "Bookmarked event items retrieved",
      pagination: { page, totalPages: Math.ceil(eventCount / limit), totalItems: eventCount },
    })
  })
  .get("/:uuid", signedIn, zValidator("param", paramUuidSchema), async (c) => {
    const { uuid: eventId } = c.req.valid("param")
    const user = c.get("user") as User

    const eventItem = await getEventItem({ eventId, userId: user.id })

    if (!eventItem) {
      return c.json<ErrorResponse>({ success: false, error: "Event not found" }, 404)
    }

    return c.json<SuccessResponse<Event>>({ success: true, data: eventItem, message: "Event retrieved" })
  })
