"use client"

import { QuestionPageQueryParams } from "@/config/question-page-query-params"
import { RouteFunctions } from "@/routes"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { NavTabButton } from "@/components/buttons/nav-tab-button"
import { useMemo } from "react"
import qs from "query-string"

const QuestionTab = {
  open: "open",
  resolved: "resolved",
} as const

type QuestionTabs = (typeof QuestionTab)[keyof typeof QuestionTab]

export const QuestionTabNavigation = () => {
  const { eventId, eventSlug } = useParams<{
    eventId: string
    eventSlug?: string
  }>()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const showResolved = searchParams.get(QuestionPageQueryParams.resolved) === "true"

  const eventQuestionRoute = RouteFunctions.event({
    eventSlug,
    eventId,
  })

  const activeTab: QuestionTabs = useMemo(
    () => (pathname === eventQuestionRoute && !showResolved ? QuestionTab.open : QuestionTab.resolved),
    [pathname, eventQuestionRoute, showResolved]
  )

  const handleTabChange = (tab: QuestionTabs) => {
    const url = qs.stringifyUrl(
      {
        url: eventQuestionRoute,
        query: {
          [QuestionPageQueryParams.resolved]: tab === QuestionTab.resolved,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )

    router.replace(url)
  }

  return (
    <nav className="inline-flex">
      <NavTabButton isActive={activeTab === QuestionTab.open} onClick={() => handleTabChange(QuestionTab.open)}>
        Open
      </NavTabButton>

      <NavTabButton isActive={activeTab === QuestionTab.resolved} onClick={() => handleTabChange(QuestionTab.resolved)}>
        Resolved
      </NavTabButton>
    </nav>
  )
}
