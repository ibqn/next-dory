import { Suspense, type PropsWithChildren } from "react"
import { eventQueryOptions } from "@/api/event"
import { getQueryClient } from "@/lib/query-client"
import { EventLayout } from "@/components/layout/event-layout"
import { validateQueryOptions } from "@/api/auth"

type Props = PropsWithChildren<{
  params: Promise<{
    eventId: string
  }>
}>

export default async function EventLayoutServer({ children, params }: Props) {
  const { eventId } = await params

  const queryClient = getQueryClient()
  await Promise.allSettled([
    queryClient.prefetchQuery(eventQueryOptions({ id: eventId })),
    queryClient.prefetchQuery(validateQueryOptions()),
  ])

  return (
    <Suspense>
      <EventLayout>{children}</EventLayout>
    </Suspense>
  )
}
