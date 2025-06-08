import { boolean, text, uuid } from "drizzle-orm/pg-core"
import { createdAtUpdatedAt } from "./utils"
import { schema } from "./schema"
import { relations, type InferSelectModel } from "drizzle-orm"
import { userTable, type User } from "./auth"

export const uploadTable = schema.table("upload", {
  id: uuid("id").primaryKey().defaultRandom(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(false),
  filePath: text("file_path").notNull(),

  userId: uuid("user_id").references(() => userTable.id, {
    onDelete: "set null",
  }),

  ...createdAtUpdatedAt,
})

export const uploadRelations = relations(uploadTable, ({ one }) => ({
  user: one(userTable, { fields: [uploadTable.userId], references: [userTable.id] }),
}))

export type Upload = InferSelectModel<typeof uploadTable> & {
  user?: User | null
}
