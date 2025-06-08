import { boolean, text, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { createdAtUpdatedAt } from "./utils"
import { eventTable } from "./event"
import { relations } from "drizzle-orm"
import { userTable } from "./auth"
import { questionUpvoteTable } from "./upvote"

export const questionTable = schema.table("question", {
  id: uuid("id").primaryKey().defaultRandom(),
  body: text("body").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isResolved: boolean("is_resolved").default(false),

  eventId: uuid("event_id")
    .notNull()
    .references(() => eventTable.id, { onDelete: "cascade" }),

  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "set null" }),

  ...createdAtUpdatedAt,
})

export const questionRelations = relations(questionTable, ({ one, many }) => ({
  event: one(eventTable, { fields: [questionTable.eventId], references: [eventTable.id] }),
  user: one(userTable, { fields: [questionTable.userId], references: [userTable.id] }),
  upvotes: many(questionUpvoteTable),
}))
