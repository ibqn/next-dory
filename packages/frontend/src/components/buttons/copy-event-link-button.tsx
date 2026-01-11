"use client"

import { getEventLink } from "@/lib/get-event-link"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { toast } from "sonner"
import type { Event } from "database/src/drizzle/schema/event"
import { useOrigin } from "@/hooks/use-origin"

type Props = {
  eventId: Event["id"]
  eventSlug: Event["slug"]
}

export const CopyEventLinkButton = ({ eventId, eventSlug }: Props) => {
  const origin = useOrigin()

  const handleCopy = () => {
    navigator.clipboard.writeText(getEventLink({ baseUrl: origin, eventId, eventSlug }))

    toast("Event link copied to clipboard!")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleCopy} variant={"outline"} className="rounded-full">
            <LinkIcon className="size-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent className="bg-black text-sm text-white">Copy link to clipboard</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
