"use client"

import { eventQueryOptions } from "@/api/event"
import { useSuspenseQuery } from "@tanstack/react-query"
import { notFound, redirect, useParams } from "next/navigation"

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
    redirect(`/events/${event.id}/${event.slug}`)
  }

  return (
    <div className="flex grow flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Event Page</h1>
      <p className="mt-4">This is the event page. You can view event details here.</p>
    </div>
  )
}
