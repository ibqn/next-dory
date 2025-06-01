import type { ValidationTargets } from "hono"
import type { ZodSchema } from "zod/v3"
import { zValidator as zv } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"

export const zValidator = <T extends ZodSchema, Target extends keyof ValidationTargets>(target: Target, schema: T) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      throw new HTTPException(400, { message: result.error.errors.map(({ message }) => message).join(", ") })
    }
  })
