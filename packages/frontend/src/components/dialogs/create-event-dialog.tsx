"use client"

import { type PropsWithChildren, useState } from "react"
import { CreateEventForm } from "@/components/forms/create-event-form"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Props = PropsWithChildren

export const NewEventDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogTitle>New Event</DialogTitle>

        <CreateEventForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
