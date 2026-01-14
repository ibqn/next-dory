import { deleteEventItem, GetEventItems, eventListQueryOptions } from "@/api/event"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ParamIdSchema } from "database/src/validators/param"
import { produce, nothing } from "immer"
import { useRouter } from "next/navigation"

export const useDeleteEventItem = () => {
  const queryClient = useQueryClient()

  const router = useRouter()

  return useMutation({
    mutationFn: deleteEventItem,
    onMutate: async ({ id }: ParamIdSchema) => {
      await queryClient.cancelQueries({ queryKey: eventListQueryOptions().queryKey })

      const previousEventListData = queryClient.getQueriesData<GetEventItems>({
        queryKey: eventListQueryOptions().queryKey,
      })

      console.log("previousEventListData", previousEventListData)

      queryClient.setQueriesData<GetEventItems>(
        {
          queryKey: eventListQueryOptions().queryKey,
        },
        produce((draft) => {
          if (!draft) {
            return nothing
          }
          const index = draft.eventItems.findIndex((event) => event.id === id)
          if (index !== -1) {
            draft.eventItems.splice(index, 1)
          }
        })
      )

      return { previousEventListData }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: eventListQueryOptions().queryKey })

      router.push("/dashboard")
    },
    onError: (error, _input, context) => {
      console.error(error)

      toast("Error deleting event", {
        description: "Could not delete event. Please try again.",
      })

      if (context?.previousEventListData) {
        context.previousEventListData.forEach(([queryKey, data]) => {
          queryClient.setQueriesData({ queryKey }, data)
        })
      }
    },
    onSuccess: () => {
      toast("Event deleted", { description: `Event deleted successfully` })
    },
  })
}
