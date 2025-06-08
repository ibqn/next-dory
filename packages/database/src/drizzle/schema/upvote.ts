import { uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { createdAtUpdatedAt } from "./utils"
import { relations } from "drizzle-orm"
import { questionTable } from "./question"
import { userTable } from "./auth"

export const questionUpvoteTable = schema.table("question_upvote", {
  id: uuid("id").primaryKey().defaultRandom(),

  questionId: uuid("question_id")
    .notNull()
    .references(() => questionTable.id, { onDelete: "cascade" }),

  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "set null" }),

  ...createdAtUpdatedAt,
})

export const questionUpvoteRelations = relations(questionUpvoteTable, ({ one }) => ({
  question: one(questionTable, { fields: [questionUpvoteTable.questionId], references: [questionTable.id] }),
  user: one(userTable, { fields: [questionUpvoteTable.userId], references: [userTable.id] }),
}))
