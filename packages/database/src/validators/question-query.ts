import { z } from "zod"
import { questionOrderBySchema } from "./question"

export const questionQuerySchema = z.object({
  resolved: z.boolean().optional(),
  questionId: z.string().optional(),
  orderBy: questionOrderBySchema.optional(),
})

export type QuestionQuerySchema = z.infer<typeof questionQuerySchema>
