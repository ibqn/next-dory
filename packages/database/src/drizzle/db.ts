import { drizzle } from "drizzle-orm/postgres-js"
import { passwordResetTable, sessionRelations, sessionTable, userRelations, userTable } from "./schema/auth"
import { uploadRelations, uploadTable } from "./schema/upload"
import {
  permissionRelations,
  permissionTable,
  rolePermissionRelations,
  rolePermissionTable,
  roleRelations,
  roleTable,
  userRoleRelations,
  userRoleTable,
} from "./schema/role"
import { env } from "../env"
import { eventParticipantRelations, eventParticipantTable, eventRelations, eventTable } from "./schema/event"

export const db = drizzle(env.DATABASE_URL, {
  logger: true,
  schema: {
    user: userTable,
    session: sessionTable,
    passwordReset: passwordResetTable,
    userRelations,
    sessionRelations,
    upload: uploadTable,
    uploadRelations,
    role: roleTable,
    roleRelations,
    userRole: userRoleTable,
    userRoleRelations,
    permission: permissionTable,
    permissionRelations,
    rolePermission: rolePermissionTable,
    rolePermissionRelations,
    event: eventTable,
    eventRelations,
    eventParticipant: eventParticipantTable,
    eventParticipantRelations,
  },
})
