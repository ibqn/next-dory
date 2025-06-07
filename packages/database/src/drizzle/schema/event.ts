import { text, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { relations, type InferSelectModel } from "drizzle-orm"
import { createdAtUpdatedAt } from "./utils"

export const eventTable = schema.table("event", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),

  ...createdAtUpdatedAt,
})

export const eventRelations = relations(eventTable, ({ many }) => ({}))

export type Event = InferSelectModel<typeof eventTable>
