import { axios } from "./axios"
import type { ApiResponse, PaginatedSuccessResponse } from "database/src/types"
import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import type { Event } from "database/src/drizzle/schema/event"
import type { ParamUuidSchema } from "database/src/validators/param"
import { type PaginationSchema, paginationSchema } from "database/src/validators/pagination"

export const getEventItem = async ({ uuid }: ParamUuidSchema) => {
  const { data: response } = await axios.get<ApiResponse<Event>>(`/event/${uuid}`)
  if (!response.success) {
    return null
  }

  return response.data
}

export const eventQueryOptions = (paramUuid?: ParamUuidSchema) => {
  return queryOptions({
    queryKey: ["event", paramUuid?.uuid ?? ""] as const,
    queryFn: () => (paramUuid?.uuid ? getEventItem({ uuid: paramUuid?.uuid }) : null),
    enabled: !!paramUuid?.uuid,
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
