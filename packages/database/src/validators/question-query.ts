import { z } from "zod"

export const questionQuerySchema = z.object({
  resolved: z.boolean().optional(),
  questionId: z.string().optional(),
})

export type QuestionQuerySchema = z.infer<typeof questionQuerySchema>
