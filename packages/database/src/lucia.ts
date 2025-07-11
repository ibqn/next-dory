import { sessionTable, type Session, type User } from "./drizzle/schema/auth"
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"
import { sha256 } from "@oslojs/crypto/sha2"
import { db } from "./drizzle/db"
import { eq } from "drizzle-orm"
import unset from "lodash.unset"

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

export async function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const [session] = await db
    .insert(sessionTable)
    .values({
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })
    .returning()

  return session
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const sessionData = await db.query.session.findFirst({
    where: ({ id }, { eq }) => eq(id, sessionId),
    with: { user: true },
  })

  if (!sessionData) {
    return { session: null, user: null }
  }

  const { user } = sessionData
  unset(user, "passwordHash")
  const session: Session = sessionData
  unset(session, "user")

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id))
    return { session: null, user: null }
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    await db.update(sessionTable).set({ expiresAt: session.expiresAt }).where(eq(sessionTable.id, session.id))
  }

  return { session, user }
}

export async function invalidateSessionToken(token: string): Promise<void> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}

export type SessionValidationResult =
  | {
      session: Session
      user: User
    }
  | {
      session: null
      user: null
    }
