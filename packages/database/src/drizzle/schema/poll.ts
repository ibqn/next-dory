import { boolean, integer, text, unique, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { createdAtUpdatedAt } from "./utils"
import { eventTable } from "./event"
import { relations, type InferSelectModel } from "drizzle-orm"
import { userTable } from "./auth"

export const pollTable = schema.table("poll", {
  id: uuid("id").primaryKey().defaultRandom(),
  body: text("body").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLive: boolean("is_resolved").default(false),

  eventId: uuid("event_id")
    .notNull()
    .references(() => eventTable.id, { onDelete: "cascade" }),

  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "set null" }),

  ...createdAtUpdatedAt,
})

export const pollRelations = relations(pollTable, ({ one, many }) => ({
  event: one(eventTable, { fields: [pollTable.eventId], references: [eventTable.id] }),
  user: one(userTable, { fields: [pollTable.userId], references: [userTable.id] }),
  options: many(pollOptionTable),
}))

export type Poll = InferSelectModel<typeof pollTable>

export const pollOptionTable = schema.table(
  "poll_option",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    index: integer("index").notNull(),
    body: text("body").notNull(),

    pollId: uuid("poll_id")
      .notNull()
      .references(() => pollTable.id, { onDelete: "cascade" }),

    ...createdAtUpdatedAt,
  },
  (table) => [unique().on(table.pollId, table.index)]
)

export const pollOptionRelations = relations(pollOptionTable, ({ one, many }) => ({
  poll: one(pollTable, { fields: [pollOptionTable.pollId], references: [pollTable.id] }),
  votes: many(pollVoteTable),
}))

export type PollOption = InferSelectModel<typeof pollOptionTable>

export const pollVoteTable = schema.table(
  "poll_vote",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pollOptionId: uuid("poll_id")
      .notNull()
      .references(() => pollOptionTable.id, { onDelete: "cascade" }),

    pollId: uuid("poll_id")
      .notNull()
      .references(() => pollTable.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "set null" }),

    ...createdAtUpdatedAt,
  },
  (table) => [unique().on(table.pollOptionId, table.userId)]
)

export const pollVoteRelations = relations(pollVoteTable, ({ one }) => ({
  pollOption: one(pollOptionTable, { fields: [pollVoteTable.pollOptionId], references: [pollOptionTable.id] }),
  user: one(userTable, { fields: [pollVoteTable.userId], references: [userTable.id] }),
}))
