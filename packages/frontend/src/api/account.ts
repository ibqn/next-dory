import { ApiResponse } from "database/src/types"
import type { AccountInfo } from "database/src/queries/account-info"
import { axios } from "./axios"
import { queryOptions } from "@tanstack/react-query"

export const getAccountInfo = async () => {
  const { data: response } = await axios.get<ApiResponse<AccountInfo>>("/account/info")
  if (!response.success) {
    return null
  }
  const accountInfo = response.data
  return accountInfo
}

export const accountInfoQueryOptions = () =>
  queryOptions({ queryKey: ["account-info"] as const, queryFn: getAccountInfo })
