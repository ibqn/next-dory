import { z } from "zod"
import { questionOrderBySchema } from "./question"

export const questionPaginationSchema = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
  orderBy: questionOrderBySchema.default("newest"),
})

export type QuestionPaginationSchema = z.infer<typeof questionPaginationSchema>
