import { and, eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import { eventBookmarkTable, type EventBookmark } from "../drizzle/schema/event"

type ToggleEventBookmarkOptions = {
  eventId: EventBookmark["eventId"]
  userId: EventBookmark["userId"]
}

export const toggleEventBookmark = async ({ eventId, userId }: ToggleEventBookmarkOptions): Promise<EventBookmark> => {
  const existingBookmark = await db.query.eventBookmark.findFirst({
    where: (eb, { and, eq }) => and(eq(eb.eventId, eventId), eq(eb.userId, userId)),
  })

  if (existingBookmark) {
    const [deletedBookmark] = await db
      .delete(eventBookmarkTable)
      .where(and(eq(eventBookmarkTable.eventId, eventId), eq(eventBookmarkTable.userId, userId)))
      .returning()

    return deletedBookmark
  } else {
    const [newBookmark] = await db.insert(eventBookmarkTable).values({ eventId, userId }).returning()

    return newBookmark
  }
}
