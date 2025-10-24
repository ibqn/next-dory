import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { PropsWithChildren } from "react"
import { Route } from "@/routes"
import { getEventItem } from "@/api/event"
import { notFound } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

type Props = PropsWithChildren<{
  params: Promise<{
    eventId: string
    eventSlug: string
  }>
}>

export default async function EventLayout({ children, params }: Props) {
  const { eventId, eventSlug } = await params
  const event = await getEventItem({ uuid: eventId })
  if (!event) {
    notFound()
  }

  return (
    <div className="flex grow flex-col items-start px-4 pt-8 lg:px-8">
      <Link href={Route.dashboard} className="text-xs underline underline-offset-2">
        <ArrowLeft className="mr-1 inline-block h-3 w-3" />
        <span>Back to events</span>
      </Link>
      {JSON.stringify(await params)}
      <div className="flex-1 overflow-hidden pb-4">
        <ScrollArea className="relative rounded-lg bg-white px-2.5 py-4 lg:rounded-lg lg:p-6">{children}</ScrollArea>
      </div>
    </div>
  )
}
