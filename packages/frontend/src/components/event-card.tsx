import type { Event } from "database/src/drizzle/schema/event"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UsersIcon } from "lucide-react"
import { cn } from "@/lib/class-names"
import type { ComponentProps } from "react"
import { RouteFunctions } from "@/routes"

type Props = {
  event: Event
} & ComponentProps<typeof Card>

export const EventCard = ({ event, className, ...props }: Props) => {
  const questionCount = event.questions?.length ?? 0
  const pollCount = event.polls?.length ?? 0
  const participantCount = event.participants?.length ?? 0

  return (
    <Link href={RouteFunctions.event({ eventId: event.id, eventSlug: event.slug })} prefetch={false} className="flex-1">
      <Card
        {...props}
        className={cn("rounded-none border-t-0 border-r-0 border-b-0 border-l-4 border-gray-400/80", className)}
      >
        <CardHeader>
          <div className="flex justify-between">
            <h4 className="line-clamp-2 text-base font-semibold">{event.name}</h4>
          </div>

          <div className="flex justify-between text-xs font-medium text-gray-400">
            <span className="inline-flex items-center gap-x-1">
              <span>
                Q&A: <span className="font-semibold">{questionCount}</span>
              </span>
              <span>&bull;</span>
              <span>
                Polls: <span className="font-semibold">{pollCount}</span>
              </span>
            </span>

            <span className="inline-flex items-center gap-x-1 font-bold">
              <UsersIcon className="size-3" />
              <span>{participantCount} participants</span>
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <p className="line-clamp-2 text-xs text-gray-400">{event.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
