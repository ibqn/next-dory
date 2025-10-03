import { Hono } from "hono"
import type { ExtEnv } from "../utils/extended-env"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import { paginationSchema } from "database/src/validators/pagination"
import {
  getUserItemsCount,
  getUserItems,
  getUserItem,
  createUserItem,
  updateUserItem,
  deleteUserItem,
} from "database/src/queries/user"
import type { User } from "database/src/drizzle/schema/auth"
import type { ErrorResponse, PaginatedSuccessResponse, SuccessResponse } from "database/src/types"
import { havePermission } from "database/src/queries/permission"
import { paramUuidSchema } from "database/src/validators/param"
import { createUserSchema, updateUserSchema } from "database/src/validators/user"
import { Permission } from "database/src/permission"
import { HTTPException } from "hono/http-exception"

export const userRoute = new Hono<ExtEnv>()

userRoute
  .post("/", signedIn, zValidator("json", createUserSchema), async (c) => {
    const user = c.get("user") as User
    const input = c.req.valid("json")

    const permission = await havePermission(user.id, Permission.userCreate)
    if (!permission) {
      return c.json<ErrorResponse>({ success: false, error: "You do not have permission to view users" }, 403)
    }

    const userItem = await createUserItem({ ...input })
    return c.json<SuccessResponse<User>>({ success: true, data: userItem, message: "User created" })
  })
  .patch("/:uuid", signedIn, zValidator("param", paramUuidSchema), zValidator("json", updateUserSchema), async (c) => {
    const { uuid } = c.req.valid("param")
    const input = c.req.valid("json")
    const user = c.get("user") as User

    const permission = await havePermission(user.id, Permission.userUpdate)
    if (!permission) {
      return c.json<ErrorResponse>({ success: false, error: "You do not have permission to update users" }, 403)
    }
    const userItem = await updateUserItem({ ...input, uuid })
    if (!userItem) {
      throw new HTTPException(404, { message: "User not found" })
    }
    return c.json<SuccessResponse<User>>({ success: true, data: userItem, message: "User updated" })
  })
  .get("/", signedIn, zValidator("query", paginationSchema), async (c) => {
    const query = c.req.valid("query")
    const { page, limit } = query
    const user = c.get("user") as User

    const permission = await havePermission(user.id, Permission.userView)
    if (!permission) {
      return c.json<ErrorResponse>({ success: false, error: "You do not have permission to view users" }, 403)
    }

    const userCount = await getUserItemsCount()
    const userItems = await getUserItems(query)

    return c.json<PaginatedSuccessResponse<User[]>>({
      success: true,
      data: userItems,
      message: "User items retrieved",
      pagination: { page, totalPages: Math.ceil(userCount / limit), totalItems: userCount },
    })
  })
  .delete("/:uuid", signedIn, zValidator("param", paramUuidSchema), async (c) => {
    const { uuid } = c.req.valid("param")
    const user = c.get("user") as User

    const permission = await havePermission(user.id, Permission.userDelete)
    if (!permission) {
      return c.json<ErrorResponse>({ success: false, error: "You do not have permission to delete users" }, 403)
    }
    const { id: deletedId } = await deleteUserItem({ uuid })

    if (!deletedId) {
      throw new HTTPException(404, { message: "User not found" })
    }
    return c.json<SuccessResponse<{ id: string }>>({
      success: true,
      data: { id: deletedId },
      message: "User deleted",
    })
  })
  .get("/:uuid", signedIn, zValidator("param", paramUuidSchema), async (c) => {
    const { uuid: userId } = c.req.valid("param")
    const user = c.get("user") as User

    const permission = await havePermission(user.id, Permission.userView)
    console.log("permission", permission)
    if (!permission) {
      return c.json<ErrorResponse>({ success: false, error: "You do not have permission to view users" }, 403)
    }

    const userItem = await getUserItem({ userId })

    if (!userItem) {
      return c.json<ErrorResponse>({ success: false, error: "User not found" }, 404)
    }

    return c.json<SuccessResponse<User>>({ success: true, data: userItem, message: "User retrieved" })
  })
