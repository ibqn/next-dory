"use client"

import { eventQueryOptions } from "@/api/event"
import { useSuspenseQuery } from "@tanstack/react-query"
import { notFound, redirect, useParams } from "next/navigation"

export default function EventRedirect() {
  const params = useParams<{ eventId: string }>()
  const { data: event } = useSuspenseQuery(eventQueryOptions({ id: params.eventId }))

  if (!event) {
    notFound()
  }

  redirect(`/events/${event.id}/${event.slug}`)
}
