"use client"

import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Route } from "@/routes"
import { ArrowLeftIcon } from "lucide-react"
import { useMemo, type PropsWithChildren } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { eventQueryOptions } from "@/api/event"
import { notFound, useParams } from "next/navigation"
import { UserAvatar } from "@/components/user-avatar"
import { ParticipantsTooltip } from "./tooltips/participants-tooltip"
import { CopyEventLinkButton } from "./buttons/copy-event-link-button"

type Props = PropsWithChildren

export const EventLayout = ({ children }: Props) => {
  const params = useParams<{ eventId: string }>()
  const { data: event } = useSuspenseQuery(eventQueryOptions({ id: params.eventId }))

  if (!event) {
    notFound()
  }

  const participantsCount = useMemo(() => event.participants?.length ?? 0, [event])

  return (
    <div className="flex grow flex-col items-start px-4 pt-8 lg:px-8">
      <Link href={Route.dashboard} className="text-xs underline underline-offset-2">
        <ArrowLeftIcon className="mr-1 inline-flex size-3" />
        <span>Back to events</span>
      </Link>

      <div className="mt-3 flex w-full flex-col lg:shrink-0 lg:flex-row lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold lg:text-3xl">{event?.name}</h2>

          {event?.description && event.description.length > 0 && (
            <p className="text-muted-foreground mt-1.5 line-clamp-1 text-sm">{event.description}</p>
          )}

          <div className="mt-2 inline-flex items-center gap-x-2">
            <span className="text-xs lg:text-sm">
              <span className="text-slate-600">Organized by </span>
              <span className="font-semibold">{event?.user?.username}</span>
            </span>

            <UserAvatar className="size-6" displayName={event?.user?.username ?? ""} color={undefined} />
          </div>
        </div>

        <div className="flex items-baseline justify-between lg:mr-8 lg:items-center lg:self-end">
          <ParticipantsTooltip className="mr-7" participantsCount={participantsCount} />

          <div className="mt-6 inline-flex items-center gap-x-2 lg:mt-0">
            <CopyEventLinkButton eventId={event.id} eventSlug={event.slug} />

            {/* <BookmarkEventButton event={event} />

            <EventAdminMenu event={event} /> */}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col gap-x-4 overflow-auto pt-6 lg:flex-row">
        <div className="flex grow overflow-auto pb-4">
          <ScrollArea className="relative flex grow rounded-lg bg-white px-2.5 py-4 lg:rounded-lg lg:p-6">
            {children}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
