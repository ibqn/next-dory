import { primaryKey, text, uuid } from "drizzle-orm/pg-core"
import { userTable, type User } from "./auth"
import { schema } from "./schema"
import { relations, type InferSelectModel } from "drizzle-orm"
import { createdAtUpdatedAt } from "./utils"

export const roleTable = schema.table("role", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),

  ...createdAtUpdatedAt,
})

export const roleRelations = relations(roleTable, ({ many }) => ({
  userRoles: many(userRoleTable),
  rolePermissions: many(rolePermissionTable),
}))

export type Role = InferSelectModel<typeof roleTable>

export const userRoleTable = schema.table(
  "user_role",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roleTable.id),

    ...createdAtUpdatedAt,
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })]
)

export const userRoleRelations = relations(userRoleTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userRoleTable.userId],
    references: [userTable.id],
  }),
  role: one(roleTable, {
    fields: [userRoleTable.roleId],
    references: [roleTable.id],
  }),
}))

export type UserRole = InferSelectModel<typeof userRoleTable> & {
  user?: User | null
  role?: Role | null
}

export const permissionTable = schema.table("permission", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),

  ...createdAtUpdatedAt,
})

export const permissionRelations = relations(permissionTable, ({ many }) => ({
  rolePermissions: many(rolePermissionTable),
}))

export const rolePermissionTable = schema.table(
  "role_permission",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roleTable.id),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissionTable.id),

    ...createdAtUpdatedAt,
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionId] })]
)

export const rolePermissionRelations = relations(rolePermissionTable, ({ one }) => ({
  role: one(roleTable, {
    fields: [rolePermissionTable.roleId],
    references: [roleTable.id],
  }),
  permission: one(permissionTable, {
    fields: [rolePermissionTable.permissionId],
    references: [permissionTable.id],
  }),
}))
