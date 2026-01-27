import { z } from "zod"
import { question } from "./constants"
import { eventIdSchema } from "./event"

export const questionIdSchema = z.uuid()

export const questionBodySchema = z
  .string()
  .min(question.minLength, {
    message: `Question body must have at least ${question.minLength} characters.`,
  })
  .max(question.maxLength, {
    message: `Question body must not exceed ${question.maxLength} characters.`,
  })

export const QuestionOrderBy = {
  mostPopular: "most-popular",
  newest: "newest",
  oldest: "oldest",
} as const

export type QuestionOrderBy = (typeof QuestionOrderBy)[keyof typeof QuestionOrderBy]

export const questionOrderBySchema = z.enum(Object.values(QuestionOrderBy))

export const createQuestionSchema = z.object({
  body: questionBodySchema,
  eventId: eventIdSchema,
})

export const updateQuestionSchema = z.object({
  questionId: questionIdSchema,
  body: questionBodySchema.optional(),
  isResolved: z.boolean().optional(),
  isPinned: z.boolean().optional(),
})

export const getQuestionSchema = z.object({
  questionId: questionIdSchema,
})

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>
export type UpdateQuestionSchema = z.infer<typeof updateQuestionSchema>
export type GetQuestionSchema = z.infer<typeof getQuestionSchema>
