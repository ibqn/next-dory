import { z } from "zod/v4"

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3333),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
  DATABASE_URL: z.url(),
  FRONTEND_URL: z.url(),
})

export type env = z.infer<typeof EnvSchema>

const result = EnvSchema.safeParse(process.env)

if (result.error) {
  console.error("❌ Invalid env:")
  console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export const env = result.data
