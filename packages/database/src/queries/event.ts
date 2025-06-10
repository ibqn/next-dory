import { eventTable, type Event } from "../drizzle/schema/event"
import { db } from "../drizzle/db"
import type { PaginationSchema, SortedBySchema } from "../validators/pagination"
import type { User } from "src/drizzle/schema/auth"
import { asc, countDistinct, desc } from "drizzle-orm"

export const getEventItemsCount = async () => {
  const [{ count }] = await db.select({ count: countDistinct(eventTable.id) }).from(eventTable)

  return count
}

type GetEventItemOptions = {
  eventId: Event["id"]
  userId: User["id"]
}

export const getEventItem = async ({ eventId, userId }: GetEventItemOptions) => {
  const event = await db.query.event.findFirst({
    where: (event, { eq, and }) => and(eq(event.id, eventId), eq(event.userId, userId)),
    with: {},
  })

  if (!event) {
    return null
  }

  return event satisfies Event as Event
}

type GetEventItemsOptions = PaginationSchema

const getSortedByColumn = (sortedBy: SortedBySchema) => {
  switch (sortedBy) {
    case "name":
      return eventTable.name
    case "recent":
      return eventTable.createdAt
    default:
      throw new Error("Invalid sortedBy value")
  }
}

export const getEventItems = async ({ page, limit, sortedBy, order }: GetEventItemsOptions) => {
  const offset = (page - 1) * limit

  const sortedByColumn = getSortedByColumn(sortedBy)
  const orderBy = order === "desc" ? desc(sortedByColumn) : asc(sortedByColumn)

  const eventItems = await db.query.event.findMany({
    offset,
    limit,
    orderBy: [orderBy, asc(eventTable.id)],
    with: {
      polls: true,
      questions: true,
      participants: true,
    },
  })

  return eventItems satisfies Event[] as Event[]
}
