import type { Provider } from "../types"
import { db } from "../drizzle/db"
import { accountTable } from "../drizzle/schema/auth"

export const createAccount = async (userId: string, provider: Provider, providerAccountId: string) => {
  const [account] = await db
    .insert(accountTable)
    .values({ userId, provider, providerAccountId })
    .returning()
    .onConflictDoNothing()

  return account
}
