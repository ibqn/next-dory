"use client"

import { eventQueryOptions } from "@/api/event"
import { RefreshButton } from "@/components/buttons/refresh-button"
import { QuestionTabNavigation } from "@/components/layout/question-tab-navigation"
import { Redirect } from "@/components/redirect"
import { QuestionSortBySelect } from "@/components/selects/question-sortby-select"
import { useSuspenseQuery } from "@tanstack/react-query"
import { notFound, useParams } from "next/navigation"

export default function EventQuestionPage() {
  const params = useParams<{
    eventId: string
    eventSlug: string
  }>()

  const { data: event } = useSuspenseQuery(eventQueryOptions({ id: params.eventId }))

  if (!event) {
    notFound()
  }

  if (event.slug !== params.eventSlug) {
    return <Redirect to={`/events/${event.id}/${event.slug}`} />
  }

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
      <h1 className="text-2xl font-bold">Event Page</h1>
      <p className="mt-4">This is the event page. You can view event details here.</p>
    </div>
  )
}
