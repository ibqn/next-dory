import type { SigninSchema } from "database/src/validators/signin"
import { axios } from "./axios"
import type { ApiResponse } from "database/src/types"
import { queryOptions } from "@tanstack/react-query"
import type { User } from "database/src/drizzle/schema/auth"
import type { ResetPasswordSchema } from "database/src/validators/reset-password"
import type { ParamTokenSchema } from "database/src/validators/param"
import type { NewPasswordSchema } from "database/src/validators/new-password"

export const postSignup = async (formData: SigninSchema) => {
  const response = await axios.post<ApiResponse<User>>("/auth/signup", formData)
  return response.data
}

export const postSignin = async (formData: SigninSchema) => {
  const response = await axios.post<ApiResponse<User>>("/auth/signin", formData)
  return response.data
}

export const getSignout = async () => {
  return axios.get("/auth/signout")
}

export const getUser = async () => {
  const { data: response } = await axios.get<ApiResponse<User>>("/auth/user")
  if (!response.success) {
    return null
  }
  const user = response.data
  return user
}

export const userQueryOptions = () => queryOptions({ queryKey: ["user"] as const, queryFn: getUser })

export const postResetPassword = async (formData: ResetPasswordSchema) => {
  const { data: response } = await axios.post<ApiResponse>("/auth/reset-password", formData)

  return response
}

export const postUpdatePassword = async ({ token, password }: NewPasswordSchema & ParamTokenSchema) => {
  const { data: response } = await axios.post<ApiResponse>(`/auth/reset-password/${token}`, { password })
  return response
}
