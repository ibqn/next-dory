import type { ParamIdSchema } from "database/src/validators/param"
import { axios } from "./axios"
import type { ApiResponse } from "database/src/types"
import type { EventBookmark } from "database/src/drizzle/schema/event"

export const toggleEventBookmark = async ({ id }: ParamIdSchema) => {
  try {
    const { data: response } = await axios.post<ApiResponse<EventBookmark>>(`/bookmark/event/${id}`)

    if (!response.success) {
      return null
    }

    return response.data
  } catch (error) {
    console.log("Error toggling event bookmark", error)
    return null
  }
}
