"use client"

import { QuestionPageQueryParams } from "@/config/question-page-query-params"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { NavTabButton } from "@/components/buttons/nav-tab-button"
import { useMemo } from "react"

const QuestionTab = {
  open: "open",
  resolved: "resolved",
} as const

type QuestionTabs = (typeof QuestionTab)[keyof typeof QuestionTab]

export const QuestionTabNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const showResolved = searchParams.get(QuestionPageQueryParams.resolved) === "true"

  const activeTab: QuestionTabs = useMemo(
    () => (!showResolved ? QuestionTab.open : QuestionTab.resolved),
    [showResolved]
  )

  const handleTabChange = (tab: QuestionTabs) => {
    const newParams = new URLSearchParams(searchParams)

    newParams.set(QuestionPageQueryParams.resolved, String(tab === QuestionTab.resolved))
    router.replace(`${pathname}?${newParams.toString()}`)
  }

  return (
    <nav className="inline-flex gap-0.5">
      <NavTabButton isActive={activeTab === QuestionTab.open} onClick={() => handleTabChange(QuestionTab.open)}>
        Open
      </NavTabButton>

      <NavTabButton isActive={activeTab === QuestionTab.resolved} onClick={() => handleTabChange(QuestionTab.resolved)}>
        Resolved
      </NavTabButton>
    </nav>
  )
}
