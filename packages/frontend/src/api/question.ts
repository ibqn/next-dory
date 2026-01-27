import { axios } from "./axios"
import type { ApiResponse } from "database/src/types"
import type { CreateQuestionSchema } from "database/src/validators/question"
import type { Question } from "database/src/drizzle/schema/question"

export const createQuestionItem = async (input: CreateQuestionSchema) => {
  try {
    const { data: response } = await axios.post<ApiResponse<Question>>("/question", input)
    if (!response.success) {
      return null
    }
    return response.data
  } catch (error) {
    console.log("Error creating question item:", error)
    return null
  }
}
