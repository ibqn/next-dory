export const QuestionPageQueryParams = {
  sortBy: "sort-by",
  resolved: "resolved",
  questionId: "question-id",
} as const

export type QuestionPageQueryParams = (typeof QuestionPageQueryParams)[keyof typeof QuestionPageQueryParams]
