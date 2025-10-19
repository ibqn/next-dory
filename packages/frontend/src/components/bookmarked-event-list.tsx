"use client"

import { bookmarkedEventListQueryOptions } from "@/api/event"
import { useSuspenseQuery } from "@tanstack/react-query"
import { EventCard } from "@/components/event-card"
import { NoContent } from "@/components/no-content/no-content"

export const BookmarkedEventList = () => {
  const { data } = useSuspenseQuery(bookmarkedEventListQueryOptions())

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {data.eventItems.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      {data.eventItems.length === 0 && <NoContent>No bookmarked events found.</NoContent>}
    </div>
  )
}
