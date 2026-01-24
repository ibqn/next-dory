"use client"

import { cn } from "@/lib/class-names"
import { EditIcon, SettingsIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { DeleteEventDialog } from "@/components/dialogs/delete-event-dialog"
import { UpdateEventDialog } from "@/components/dialogs/update-event-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Event } from "database/src/drizzle/schema/event"
import { useIsEventOwner, useIsParticipantView } from "@/hooks/use-is-participant-view"

type Props = {
  event: Event
  className?: string
}

export const EventAdminMenu = ({ event, className }: Props) => {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const isEventOwner = useIsEventOwner()
  const isParticipantView = useIsParticipantView()

  if (!isEventOwner || isParticipantView) {
    return null
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full text-black" variant={"outline"}>
            <SettingsIcon className={cn("size-4", className)} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="space-y-1 p-2">
          <DropdownMenuItem className="text-sm" onSelect={() => setOpenUpdateDialog(true)}>
            <EditIcon className="mr-2 size-4" />
            <span>Edit event</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="text-destructive text-sm" onSelect={() => setOpenDeleteDialog(true)}>
            <TrashIcon className="mr-2 size-4" />
            <span>Delete event</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateEventDialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog} event={event} />
      <DeleteEventDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog} eventId={event.id} />
    </>
  )
}
