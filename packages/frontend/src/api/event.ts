import { axios } from "./axios"
import type { ApiResponse, PaginatedSuccessResponse } from "database/src/types"
import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import type { Event } from "database/src/drizzle/schema/event"
import type { ParamIdSchema } from "database/src/validators/param"
import { type PaginationSchema, paginationSchema } from "database/src/validators/pagination"

export const getEventItem = async ({ id }: ParamIdSchema) => {
  try {
    const { data: response } = await axios.get<ApiResponse<Event>>(`/event/${id}`)
    if (!response.success) {
      return null
    }
    return response.data
  } catch (error) {
    console.log("Error fetching event item:", error)
    return null
  }
}

export const eventQueryOptions = (paramUuid?: ParamIdSchema) => {
  return queryOptions({
    queryKey: ["event", paramUuid?.id ?? ""] as const,
    queryFn: () => (paramUuid?.id ? getEventItem({ id: paramUuid?.id }) : null),
    enabled: !!paramUuid?.id,
  })
}

export const getEventItems = async (params?: PaginationSchema) => {
  const { data: response } = await axios.get<PaginatedSuccessResponse<Event[]>>("/event", { params })
  const { data: eventItems, pagination } = response
  return { eventItems, pagination }
}
export type GetEventItems = Awaited<ReturnType<typeof getEventItems>>

export const eventListQueryOptions = (paramsInput: Partial<PaginationSchema> = {}) => {
  const params = paginationSchema.parse(paramsInput)

  return queryOptions({
    queryKey: ["event-list", params] as const,
    queryFn: () => getEventItems(params),
    placeholderData: keepPreviousData,
  })
}

export const getBookmarkedEventItems = async (params?: PaginationSchema) => {
  const { data: response } = await axios.get<PaginatedSuccessResponse<Event[]>>("/event/bookmarked", { params })
  const { data: eventItems, pagination } = response
  return { eventItems, pagination }
}
export type GetBookmarkedEventItems = Awaited<ReturnType<typeof getBookmarkedEventItems>>

export const bookmarkedEventListQueryOptions = (paramsInput: Partial<PaginationSchema> = {}) => {
  const params = paginationSchema.parse(paramsInput)

  return queryOptions({
    queryKey: ["bookmarked-event-list", params] as const,
    queryFn: () => getBookmarkedEventItems(params),
    placeholderData: keepPreviousData,
  })
}
