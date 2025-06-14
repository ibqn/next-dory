import { ApiResponse } from "database/src/types"
import type { UserInfo } from "database/src/queries/user"
import { axios } from "./axios"
import { queryOptions } from "@tanstack/react-query"

export const getUserInfo = async () => {
  const { data: response } = await axios.get<ApiResponse<UserInfo>>("/user/info")
  if (!response.success) {
    return null
  }
  const userInfo = response.data
  return userInfo
}

export const userInfoQueryOptions = () => queryOptions({ queryKey: ["user-info"] as const, queryFn: getUserInfo })
