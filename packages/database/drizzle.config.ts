import type { Config } from "drizzle-kit"
import { processEnv } from "./src/env"

export default {
  schema: "src/drizzle/schema",
  dialect: "postgresql",
  out: "src/drizzle/migrations",
  dbCredentials: {
    url: processEnv.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config
