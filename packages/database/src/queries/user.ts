import { asc, countDistinct, desc, eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import { userTable, type User } from "../drizzle/schema/auth"
import type { PaginationSchema, SortedBySchema } from "../validators/pagination"
import unset from "lodash.unset"
import type { CreateUserSchema, UpdateUserSchema } from "../validators/user"
import type { ParamUuidSchema } from "../validators/param"

export const createUserItem = async (input: CreateUserSchema) => {
  await db.insert(userTable).values(input).onConflictDoNothing()

  const [user] = await db.select().from(userTable).where(eq(userTable.username, input.username))

  return user satisfies User as User
}

export const updateUserItem = async (input: ParamUuidSchema & UpdateUserSchema) => {
  const [user] = await db.update(userTable).set(input).where(eq(userTable.id, input.uuid)).returning()

  return user satisfies User as User | null
}

export const deleteUserItem = async ({ uuid }: ParamUuidSchema) => {
  const [user] = await db.delete(userTable).where(eq(userTable.id, uuid)).returning({ id: userTable.id })

  return { id: user?.id ?? null }
}

export const getUserItemsCount = async () => {
  const [{ count }] = await db.select({ count: countDistinct(userTable.id) }).from(userTable)

  return count
}

type GetUserItemOptions = {
  userId: string
}

export const getUserItem = async ({ userId }: GetUserItemOptions) => {
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    with: {
      userRoles: { with: { role: true } },
    },
  })

  if (!user) {
    return null
  }

  unset(user, "passwordHash")

  return user satisfies User as User
}

type GetUserItemsOptions = PaginationSchema

const getSortedByColumn = (sortedBy: SortedBySchema) => {
  switch (sortedBy) {
    case "name":
      return userTable.username
    case "recent":
      return userTable.createdAt
    default:
      throw new Error("Invalid sortedBy value")
  }
}

export const getUserItems = async ({ page, limit, sortedBy, order }: GetUserItemsOptions) => {
  const offset = (page - 1) * limit

  const sortedByColumn = getSortedByColumn(sortedBy)
  const orderBy = order === "desc" ? desc(sortedByColumn) : asc(sortedByColumn)

  const userItems = await db.query.user.findMany({
    offset,
    limit,
    orderBy: [orderBy, asc(userTable.id)],
  })

  userItems.map((user) => {
    unset(user, "passwordHash")
    return user
  })

  return userItems
}
