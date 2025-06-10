"use client"

import { eventListQueryOptions } from "@/api/event"
import { useSuspenseQuery } from "@tanstack/react-query"
import { EventCard } from "@/components/event-card"

export const EventList = () => {
  const { data } = useSuspenseQuery(eventListQueryOptions())

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {/* <div>{JSON.stringify(data)}</div> */}

      {data.eventItems.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
