import { and, asc, countDistinct, desc, eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import type { Event } from "../drizzle/schema/event"
import { questionTable, type Question } from "../drizzle/schema/question"
import type { QuestionPaginationSchema } from "../validators/question-pagination"
import type { QuestionQuerySchema } from "../validators/question-query"
import { QuestionOrderBy } from "../validators/question"

export type CreateQuestionOptions = {
  userId: User["id"]
  eventId: Event["id"]
  body: Question["body"]
}

export const createQuestionItem = async (input: CreateQuestionOptions): Promise<Question> => {
  const [question] = await db.insert(questionTable).values(input).returning()

  return question satisfies Question
}

type GetQuestionItemsCountOptions = {
  eventId: Event["id"]
} & QuestionQuerySchema

export const getQuestionItemsCount = async (input: GetQuestionItemsCountOptions) => {
  const filterClauses = [eq(questionTable.eventId, input.eventId)]
  if (input.resolved !== undefined) {
    filterClauses.push(eq(questionTable.isResolved, input.resolved))
  }

  if (input.questionId) {
    filterClauses.push(eq(questionTable.id, input.questionId))
  }

  const [{ count }] = await db
    .select({ count: countDistinct(questionTable.id) })
    .from(questionTable)
    .where(and(...filterClauses))

  return count
}

type GetQuestionItemsOptions = {
  eventId: Event["id"]
} & QuestionPaginationSchema &
  QuestionQuerySchema

export const getQuestionItems = async ({
  eventId,
  page,
  limit,
  orderBy,
  resolved,
  questionId,
}: GetQuestionItemsOptions): Promise<Question[]> => {
  const offset = (page - 1) * limit

  let orderClause = desc(questionTable.createdAt)
  switch (orderBy) {
    case QuestionOrderBy.newest: {
      orderClause = desc(questionTable.createdAt)
      break
    }
    case QuestionOrderBy.oldest: {
      orderClause = asc(questionTable.createdAt)
      break
    }
    case QuestionOrderBy.mostPopular: {
      orderClause = desc(questionTable.upvoteCount)
      break
    }
  }

  const filterClauses = [eq(questionTable.eventId, eventId)]
  if (resolved !== undefined) {
    filterClauses.push(eq(questionTable.isResolved, resolved))
  }

  if (questionId) {
    filterClauses.push(eq(questionTable.id, questionId))
  }

  const questionItems = await db.query.question.findMany({
    offset,
    limit,
    orderBy: [orderClause, asc(questionTable.id)],
    with: {
      user: { columns: { passwordHash: false } },
    },
    where: and(...filterClauses),
  })

  return questionItems satisfies Question[]
}
