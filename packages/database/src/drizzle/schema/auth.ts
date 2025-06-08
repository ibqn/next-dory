import { primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations, type InferSelectModel } from "drizzle-orm"
import { schema } from "./schema"
import { createdAtUpdatedAt } from "./utils"
import { userRoleTable, type UserRole } from "./role"
import { Provider } from "../../types"

export const userTable = schema.table("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  passwordHash: text("password_hash"),

  ...createdAtUpdatedAt,
})

export const userRelations = relations(userTable, ({ many }) => ({
  userRoles: many(userRoleTable),
}))

export const sessionTable = schema.table("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  ...createdAtUpdatedAt,
})

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, { fields: [sessionTable.userId], references: [userTable.id] }),
}))

export type User = Omit<InferSelectModel<typeof userTable>, "passwordHash"> & {
  userRoles?: UserRole[] | null
}

export type Session = InferSelectModel<typeof sessionTable>

export const passwordResetTable = schema.table("password_reset", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),
  token: text("token").notNull().unique(),
  used: timestamp("used", { withTimezone: true }),

  ...createdAtUpdatedAt,
})

export const accountTable = schema.table(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    provider: text("provider", { enum: Object.values(Provider) as [string, ...string[]] }).notNull(),
    providerAccountId: text("provider_account_id").notNull(),

    ...createdAtUpdatedAt,
  },
  (table) => {
    return [primaryKey({ columns: [table.provider, table.providerAccountId] })]
  }
)
