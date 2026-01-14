import { cn } from "@/lib/class-names"
import type { Event } from "database/src/drizzle/schema/event"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import type { ComponentProps, MouseEvent } from "react"
import { useDeleteEventItem } from "@/hooks/use-delete-event"

type Props = ComponentProps<typeof AlertDialog> & {
  eventId: Event["id"]
  onSuccess?: () => void
}

export const DeleteEventDialog = ({ eventId, onSuccess: handleSuccess, ...dialogProps }: Props) => {
  const { mutate: deleteEvent, isPending } = useDeleteEventItem()

  const handleDelete = (event: MouseEvent) => {
    event.preventDefault()

    deleteEvent(
      { id: eventId },
      {
        onSuccess: () => {
          handleSuccess?.()
        },
      }
    )
  }

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your event&apos;s questions and polls and
            related data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className={cn(buttonVariants({ variant: "ghost" }))}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
