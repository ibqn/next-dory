"use client"

import { QuestionPageQueryParams } from "@/config/question-page-query-params"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { match } from "ts-pattern"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const QuestionOrderBy = {
  mostPopular: "most-popular",
  newest: "newest",
  oldest: "oldest",
} as const

type QuestionOrderBy = (typeof QuestionOrderBy)[keyof typeof QuestionOrderBy]

export const QuestionSortBySelect = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const sortBy = searchParams.get(QuestionPageQueryParams.sortBy) ?? QuestionOrderBy.newest

  const handleValueChange = (value: QuestionOrderBy) => {
    const newParams = new URLSearchParams(searchParams)

    const orderBy = match(value)
      .returnType<QuestionOrderBy | undefined>()
      .with("most-popular", () => "most-popular")
      .with("newest", () => "newest")
      .with("oldest", () => "oldest")
      .otherwise(() => undefined)

    if (orderBy) {
      newParams.set(QuestionPageQueryParams.sortBy, orderBy)
    } else {
      newParams.delete(QuestionPageQueryParams.sortBy)
    }

    router.replace(`${pathname}?${newParams.toString()}`)
  }

  return (
    <Select defaultValue={sortBy} onValueChange={handleValueChange}>
      <SelectTrigger className="bg-white text-xs lg:text-sm">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={QuestionOrderBy.mostPopular}>Most Popular</SelectItem>
        <SelectItem value={QuestionOrderBy.newest}>Newest</SelectItem>
        <SelectItem value={QuestionOrderBy.oldest}>Oldest</SelectItem>
      </SelectContent>
    </Select>
  )
}
