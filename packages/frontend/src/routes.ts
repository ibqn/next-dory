import type { Event } from "database/src/drizzle/schema/event"

type EventRouteParams = {
  eventId: Event["id"]
  eventSlug?: Event["slug"]
}

export const Route = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
  home: "/",
  events: "/events",
  bookmarked: "/dashboard/bookmarks",
  account: "/dashboard/account",
} as const

export type Route = (typeof Route)[keyof typeof Route]

export const RouteFunctions = {
  event: ({ eventId, eventSlug }: EventRouteParams) => `/events/${eventId}${eventSlug ? `/${eventSlug}` : ""}`,
  eventPolls: ({ eventId, eventSlug }: EventRouteParams) =>
    `/events/${eventId}${eventSlug ? `/${eventSlug}` : ""}/polls`,
} as const
