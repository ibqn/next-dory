import { RouteFunctions } from "@/routes"
import type { Event } from "database/src/drizzle/schema/event"

type Params = {
  eventId: Event["id"]
  eventSlug: Event["slug"]
  baseUrl: string
}

export const getEventLink = ({ baseUrl, eventId, eventSlug }: Params) => {
  return `${baseUrl}${RouteFunctions.event({
    eventId,
    eventSlug,
  })}`
}
