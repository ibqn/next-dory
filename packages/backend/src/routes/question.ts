import { Hono } from "hono"
import type { ExtEnv } from "../utils/extended-env"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import type { User } from "database/src/drizzle/schema/auth"
import type { SuccessResponse } from "database/src/types"
import { createQuestionSchema } from "database/src/validators/question"
import type { Question } from "database/src/drizzle/schema/question"
import { createQuestionItem } from "database/src/queries/question"

export const questionRoute = new Hono<ExtEnv>()

questionRoute.post("/", signedIn, zValidator("json", createQuestionSchema), async (c) => {
  const inputData = c.req.valid("json")
  const user = c.get("user") as User

  const questionItem = await createQuestionItem({ ...inputData, userId: user.id })
  return c.json<SuccessResponse<Question>>(
    {
      success: true,
      data: questionItem,
      message: "Question created",
    },
    201
  )
})
