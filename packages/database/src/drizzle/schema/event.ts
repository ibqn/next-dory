import { primaryKey, text, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { relations, type InferSelectModel } from "drizzle-orm"
import { createdAtUpdatedAt } from "./utils"
import { userTable } from "./auth"

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

export const eventRelations = relations(eventTable, ({ one }) => ({
  user: one(userTable, { fields: [eventTable.userId], references: [userTable.id] }),
}))

export type Event = InferSelectModel<typeof eventTable>

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
    return [primaryKey({ name: "pk", columns: [table.eventId, table.userId] })]
  }
)

export const eventParticipantRelations = relations(eventParticipantTable, ({ one }) => ({
  event: one(eventTable, { fields: [eventParticipantTable.eventId], references: [eventTable.id] }),
  user: one(userTable, { fields: [eventParticipantTable.userId], references: [userTable.id] }),
}))
