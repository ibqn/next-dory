"use client"

import { eventQueryOptions } from "@/api/event"
import { Redirect } from "@/components/redirect"
import { useSuspenseQuery } from "@tanstack/react-query"
import { notFound, useParams } from "next/navigation"

export default function EventPage() {
  const params = useParams<{
    eventId: string
    eventSlug: string
  }>()
  const { data: event } = useSuspenseQuery(eventQueryOptions({ id: params.eventId }))

  if (!event) {
    notFound()
  }

  if (event.slug !== params.eventSlug) {
    return <Redirect to={`/events/${event.id}/${event.slug}/polls`} />
  }

  return (
    <div className="flex grow flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Polls Page</h1>
      <p className="mt-4">This is the polls page. You can view event polls here.</p>
    </div>
  )
}
