export const QuestionPageQueryParams = {
  sortBy: "sortBy",
  resolved: "resolved",
  questionId: "questionId",
} as const

export type QuestionPageQueryParams = (typeof QuestionPageQueryParams)[keyof typeof QuestionPageQueryParams]
