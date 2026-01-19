"use client"

import { type EventRouteParams, RouteFunctions } from "@/routes"
import { cn } from "@/lib/class-names"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"

const tabList = [
  {
    name: "Q&A",
    route: (routeParams: EventRouteParams) => RouteFunctions.event(routeParams),
  },
  {
    name: "Polls",
    route: (routeParams: EventRouteParams) => RouteFunctions.eventPolls(routeParams),
  },
]

type Props = ComponentProps<"div">

export const EventTabsNavigation = ({ className }: Props) => {
  const { eventId, eventSlug } = useParams<EventRouteParams>()

  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className={cn("flex rounded-t-md", className)}>
      {tabList.map(({ name, route }) => (
        <Button
          key={name}
          variant={"outline"}
          className={cn("basis-1/2 rounded-t-lg rounded-b-none bg-gray-100", {
            "bg-white": route({ eventId, eventSlug }) === pathname,
          })}
          onClick={() => router.replace(route({ eventId, eventSlug }))}
        >
          {name}
        </Button>
      ))}
    </div>
  )
}
