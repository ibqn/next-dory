"use client"

import { type PropsWithChildren, useState } from "react"
import { CreateUpdateEventForm } from "@/components/forms/create-update-event-form"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Props = PropsWithChildren

export const NewEventDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogTitle>New Event</DialogTitle>

        <CreateUpdateEventForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
