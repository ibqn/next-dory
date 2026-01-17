import { eventQueryKey } from "@/api/event"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ParamIdSchema } from "database/src/validators/param"
import { produce, nothing } from "immer"
import type { Event } from "database/src/drizzle/schema/event"
import { toggleEventBookmark } from "@/api/bookmark"

export const useBookmarkEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleEventBookmark,
    onMutate: async ({ id }: ParamIdSchema) => {
      await queryClient.cancelQueries({ queryKey: eventQueryKey({ id }) })

      const previousEventItemData = queryClient.getQueryData<Event>(eventQueryKey({ id }))

      console.log("previousEventItemData", previousEventItemData)

      queryClient.setQueryData<Event>(
        eventQueryKey({ id }),
        produce((draft) => {
          if (!draft) {
            return nothing
          }

          draft.isBookmarked = !draft.isBookmarked
        })
      )

      return { previousEventItemData }
    },
    onSettled: async (_data, _error, { id }) => {
      await queryClient.invalidateQueries({ queryKey: eventQueryKey({ id }) })
    },
    onError: (error, { id }, context) => {
      console.warn(error)

      toast("Failed to toggle bookmark state", {
        description: "Could not change bookmark state of event. Please try again.",
      })

      if (context?.previousEventItemData) {
        queryClient.setQueryData(eventQueryKey({ id }), context.previousEventItemData)
      }
    },
    onSuccess: (_data, _input, context) => {
      const message = context.previousEventItemData?.isBookmarked
        ? "Event removed from bookmarks"
        : "Event added to bookmarks"
      toast(`${message} successfully`)
    },
  })
}
