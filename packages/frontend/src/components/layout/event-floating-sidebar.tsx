"use client"

import { RouteFunctions } from "@/routes"
import { useIsEventOwner, useIsParticipantView } from "@/hooks/use-is-participant-view"
import { BarChartIcon, MessageCircleMoreIcon } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { EventViewModeSelect } from "@/components/selects/event-view-mode-select"
import { SidebarItem } from "@/components/layout/sidebar-item"
import { EventRouteParams } from "@/routes"

const sidebarList = [
  {
    name: "Q&A",
    route: (eventParams: EventRouteParams) => RouteFunctions.event(eventParams),
    icon: MessageCircleMoreIcon,
  },
  {
    name: "Polls",
    route: (eventParams: EventRouteParams) => RouteFunctions.eventPolls(eventParams),
    icon: BarChartIcon,
  },
]

type Props = {
  ownerId: string
  questionsCount: number
  pollsCount: number
}

export const EventFloatingSidebar = ({ ownerId, questionsCount, pollsCount }: Props) => {
  const { eventId, eventSlug } = useParams<EventRouteParams>()

  const pathname = usePathname()
  const router = useRouter()

  const isParticipantView = useIsParticipantView()
  const isEventOwner = useIsEventOwner()

  const countMap: Record<string, number> = {
    ["Q&A"]: questionsCount,
    ["Polls"]: pollsCount,
  }

  return (
    <div className="h-full w-[220px] rounded-lg border bg-white drop-shadow-xs">
      <div className="flex h-full flex-col px-3 pt-8 pb-3">
        <nav className="flex h-full flex-col gap-3">
          {sidebarList.map(({ name, route, icon }) => {
            const activeRoute = route({ eventId, eventSlug })

            return (
              <button onClick={() => router.replace(activeRoute)} key={name}>
                <SidebarItem isActive={pathname === activeRoute} text={name} icon={icon}>
                  <span className="ml-auto">{countMap[name]}</span>
                </SidebarItem>
              </button>
            )
          })}
        </nav>

        {isEventOwner && (
          <div className="mt-auto w-full space-y-4">
            <EventViewModeSelect />
          </div>
        )}
      </div>
    </div>
  )
}
