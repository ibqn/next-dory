import { countDistinct, eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import { userTable, type User } from "../drizzle/schema/auth"
import { eventBookmarkTable, eventParticipantTable, eventTable } from "../drizzle/schema/event"
import { questionTable } from "../drizzle/schema/question"
import unset from "lodash.unset"

type GetAccountInfoOptions = {
  userId: User["id"]
}

export type AccountInfo = {
  bookmarksCount: number
  participationsCount: number
  questionsCount: number
  eventsCount: number
  user: User
}

export const getAccountInfo = async ({ userId }: GetAccountInfoOptions): Promise<AccountInfo | null> => {
  const [accountInfo] = await db
    .select({
      bookmarksCount: countDistinct(eventBookmarkTable.eventId),
      participationsCount: countDistinct(eventParticipantTable.eventId),
      questionsCount: countDistinct(questionTable.id),
      eventsCount: countDistinct(eventTable.id),
    })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .leftJoin(eventBookmarkTable, eq(eventBookmarkTable.userId, userTable.id))
    .leftJoin(eventParticipantTable, eq(eventParticipantTable.userId, userTable.id))
    .leftJoin(questionTable, eq(questionTable.userId, userTable.id))
    .leftJoin(eventTable, eq(eventTable.userId, userTable.id))

  if (!accountInfo) {
    return null
  }

  const [user] = await db.select().from(userTable).where(eq(userTable.id, userId))

  if (!user) {
    return null
  }
  unset(user, "passwordHash")

  return { ...accountInfo, user } satisfies AccountInfo
}
