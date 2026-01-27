import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import type { Event } from "../drizzle/schema/event"
import { questionTable, type Question } from "../drizzle/schema/question"

export type CreateQuestionOptions = {
  userId: User["id"]
  eventId: Event["id"]
  body: Question["body"]
}

export const createQuestionItem = async (input: CreateQuestionOptions): Promise<Question> => {
  const [question] = await db.insert(questionTable).values(input).returning()

  return question satisfies Question
}
