"use client"

import { CreateUpdateEventForm } from "@/components/forms/create-update-event-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { Event } from "database/src/drizzle/schema/event"
import type { Dispatch, SetStateAction } from "react"

type Props = {
  event: Event
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export const UpdateEventDialog = ({ event, open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Update Event</DialogTitle>

        <CreateUpdateEventForm event={event} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
