import { Suspense, type PropsWithChildren } from "react"
import { eventQueryOptions } from "@/api/event"
import { getQueryClient } from "@/lib/query-client"
import { EventLayout } from "@/components/layout/event-layout"

type Props = PropsWithChildren<{
  params: Promise<{
    eventId: string
  }>
}>

export default async function EventLayoutServer({ children, params }: Props) {
  const { eventId } = await params

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(eventQueryOptions({ id: eventId }))

  return (
    <Suspense>
      <EventLayout>{children}</EventLayout>
    </Suspense>
  )
}
