export type SuccessResponse<T = void> = {
  success: true
  message: string
} & (T extends void ? {} : { data: T })

export type ErrorResponse = {
  success: false
  error: string
}

export type ApiResponse<T = void> = SuccessResponse<T> | ErrorResponse

export type PaginatedSuccessResponse<T> = SuccessResponse<T> & {
  pagination: {
    page: number
    totalPages: number
    totalItems: number
  }
}

export const Provider = {
  github: "github",
  google: "google",
} as const
export type Provider = (typeof Provider)[keyof typeof Provider]
