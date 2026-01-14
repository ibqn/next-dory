"use client"

import { eventListQueryOptions } from "@/api/event"
import { useSuspenseQuery } from "@tanstack/react-query"
import { EventCard } from "@/components/event-card"
import { PlusIcon } from "lucide-react"
import { NoContent } from "@/components/no-content/no-content"
import { NewEventDialog } from "@/components/dialogs/create-event-dialog"

export const EventList = () => {
  const { data } = useSuspenseQuery(eventListQueryOptions())

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      <NewEventDialog>
        <button
          className="group grid min-h-24 grow border-spacing-4 place-items-center border-[3px] border-dashed bg-white/50
            dark:border-white/50 dark:bg-black/50"
        >
          <span
            className="inline-flex flex-col items-center gap-x-1 font-medium transition-colors duration-150
              group-hover:text-blue-300 group-hover:dark:text-blue-600"
          >
            <PlusIcon className="size-5" />
            <span>New Event</span>
          </span>
        </button>
      </NewEventDialog>

      {data.eventItems.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      {data.eventItems.length === 0 && <NoContent>No events found.</NoContent>}
    </div>
  )
}
