"use client"

import { eventQueryOptions } from "@/api/event"
import { ClearSearchParamsButton } from "@/components/buttons/clear-search-params-button"
import { RefreshButton } from "@/components/buttons/refresh-button"
import { CreateQuestionForm } from "@/components/forms/create-question-form"
import { QuestionTabNavigation } from "@/components/layout/question-tab-navigation"
import { Redirect } from "@/components/redirect"
import { QuestionSortBySelect } from "@/components/selects/question-sortby-select"
import { QuestionPageQueryParams } from "@/config/question-page-query-params"
import { useSuspenseQuery } from "@tanstack/react-query"
import { notFound, useParams, useSearchParams } from "next/navigation"
import { useMemo } from "react"

export default function EventQuestionPage() {
  const params = useParams<{
    eventId: string
    eventSlug: string
  }>()
  const searchParams = useSearchParams()

  const { data: event } = useSuspenseQuery(eventQueryOptions({ id: params.eventId }))

  if (!event) {
    notFound()
  }

  if (event.slug !== params.eventSlug) {
    return <Redirect to={`/events/${event.id}/${event.slug}`} />
  }
  const questionId = searchParams.get(QuestionPageQueryParams.questionId)

  const hasFilters = useMemo(() => !!questionId, [questionId])

  return (
    <div className="flex grow flex-col">
      <div className="flex justify-between">
        <QuestionTabNavigation />
        <div className="inline-flex items-center lg:gap-x-5">
          <RefreshButton />

          <div className="inline-flex items-center p-0.5 lg:gap-x-2">
            <span className="hidden text-sm text-nowrap text-gray-500 lg:inline-block">Sort By:</span>

            <QuestionSortBySelect />
          </div>
        </div>
      </div>

      {hasFilters && (
        <div className="mt-4 flex items-center gap-x-2">
          <p>You have active filters:</p>

          <ClearSearchParamsButton />
        </div>
      )}

      {!hasFilters && (
        <CreateQuestionForm
          className="mt-5"
          eventId={params.eventId}
          onSuccess={(newQuestion) => {
            console.log("Question created:", newQuestion)
          }}
        />
      )}
    </div>
  )
}
