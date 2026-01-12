import { validateQueryOptions } from "@/api/auth"
import { getQueryClient } from "@/lib/query-client"
import type { ReactNode } from "react"

type Props = Readonly<{
  children: ReactNode
}>

export default async function Layout({ children }: Props) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(validateQueryOptions())

  return children
}
