import { primaryKey, text, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { relations, type InferSelectModel } from "drizzle-orm"
import { createdAtUpdatedAt } from "./utils"
import { userTable, type User } from "./auth"
import { pollTable, type Poll } from "./poll"
import { questionTable, type Question } from "./question"

export const eventTable = schema.table("event", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  ...createdAtUpdatedAt,
})

export const eventRelations = relations(eventTable, ({ one, many }) => ({
  user: one(userTable, { fields: [eventTable.userId], references: [userTable.id] }),
  participants: many(eventParticipantTable),
  polls: many(pollTable),
  questions: many(questionTable),
  bookmarkedBy: many(eventBookmarkTable),
}))

export type Event = InferSelectModel<typeof eventTable> & {
  user?: User | null
  participants?: EventParticipant[] | null
  polls?: Poll[] | null
  questions?: Question[] | null
}

export const eventParticipantTable = schema.table(
  "event_participant",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => eventTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),

    ...createdAtUpdatedAt,
  },
  (table) => {
    return [primaryKey({ columns: [table.eventId, table.userId] })]
  }
)

export type EventParticipant = InferSelectModel<typeof eventParticipantTable>

export const eventParticipantRelations = relations(eventParticipantTable, ({ one }) => ({
  event: one(eventTable, { fields: [eventParticipantTable.eventId], references: [eventTable.id] }),
  user: one(userTable, { fields: [eventParticipantTable.userId], references: [userTable.id] }),
}))

export const eventBookmarkTable = schema.table(
  "event_bookmark",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => eventTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),

    ...createdAtUpdatedAt,
  },
  (table) => {
    return [primaryKey({ columns: [table.eventId, table.userId] })]
  }
)

export type EventBookmark = InferSelectModel<typeof eventParticipantTable>

export const eventBookmarkRelations = relations(eventBookmarkTable, ({ one }) => ({
  event: one(eventTable, { fields: [eventBookmarkTable.eventId], references: [eventTable.id] }),
  user: one(userTable, { fields: [eventBookmarkTable.userId], references: [userTable.id] }),
}))
