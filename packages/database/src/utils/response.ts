import type { ErrorResponse, SuccessResponse } from "../types"

export const errorResponse = (error: string) =>
  ({
    success: false,
    error,
  } satisfies ErrorResponse as ErrorResponse)

export const successResponse = <T = void>(
  message: string,
  data?: T
): SuccessResponse<T> =>
  ({
    success: true,
    message,
    ...(data ? { data } : {}),
  } as SuccessResponse<T>)
