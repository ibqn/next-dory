"use client"

import { eventQueryOptions } from "@/api/event"
import { useSuspenseQuery } from "@tanstack/react-query"
import { notFound, useParams } from "next/navigation"
import { Redirect } from "@/components/redirect"

export default function EventRedirect() {
  const params = useParams<{ eventId: string }>()
  const { data: event } = useSuspenseQuery(eventQueryOptions({ id: params.eventId }))

  if (!event) {
    notFound()
  }

  return <Redirect to={`/events/${event.id}/${event.slug}`} />
}
