import { eventBookmarkTable, eventTable, type Event } from "../drizzle/schema/event"
import { db } from "../drizzle/db"
import type { PaginationSchema, SortedBySchema } from "../validators/pagination"
import type { User } from "../drizzle/schema/auth"
import { and, asc, countDistinct, desc, eq, sql } from "drizzle-orm"
import { havePermission } from "./permission"
import { Permission } from "../permission"

export const getEventItemsCount = async () => {
  const [{ count }] = await db.select({ count: countDistinct(eventTable.id) }).from(eventTable)

  return count
}

type GetBookmarkedEventItemsCountOptions = {
  userId: User["id"]
}

export const getBookmarkedEventItemsCount = async ({ userId }: GetBookmarkedEventItemsCountOptions) => {
  const [{ count }] = await db
    .select({
      count: sql`COUNT(DISTINCT(${eventBookmarkTable.userId}, ${eventBookmarkTable.eventId}))`.mapWith(Number),
    })
    .from(eventBookmarkTable)
    .where(eq(eventBookmarkTable.userId, userId))

  return count
}

type GetEventItemOptions = {
  eventId: Event["id"]
}

export const getEventItem = async ({ eventId }: GetEventItemOptions) => {
  const event = await db.query.event.findFirst({
    where: (event, { eq }) => eq(event.id, eventId),
    with: { user: { columns: { passwordHash: false } }, polls: true, questions: true, participants: true },
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

type GetBookmarkedEventItemsOptions = PaginationSchema & { userId: User["id"] }

export const getBookmarkedEventItems = async ({
  userId,
  page,
  limit,
  sortedBy,
  order,
}: GetBookmarkedEventItemsOptions) => {
  const offset = (page - 1) * limit

  const sortedByColumn = getSortedByColumn(sortedBy)
  const orderBy = order === "desc" ? desc(sortedByColumn) : asc(sortedByColumn)

  const eventBookmarkItems = await db.query.eventBookmark.findMany({
    where: eq(eventBookmarkTable.userId, userId),
    offset,
    limit,
    orderBy: [orderBy, asc(eventBookmarkTable.eventId)],
    with: { event: true },
  })

  const bookmarkedEventItems = eventBookmarkItems.map(({ event }) => event)

  return bookmarkedEventItems satisfies Event[] as Event[]
}

type DeleteEventOptions = {
  eventId: Event["id"]
  userId: User["id"]
}

export const deleteEvent = async ({ eventId, userId }: DeleteEventOptions): Promise<Event | null> => {
  const canDeleteEvent = await havePermission(userId, Permission.eventDelete)

  const isOwner = await db.query.event.findFirst({
    where: and(eq(eventTable.id, eventId), eq(eventTable.userId, userId)),
    columns: { id: true },
  })

  if (!canDeleteEvent && !isOwner) {
    return null
  }

  const [event] = await db.delete(eventTable).where(eq(eventTable.id, eventId)).returning()

  if (!event) {
    return null
  }

  return event satisfies Event
}
