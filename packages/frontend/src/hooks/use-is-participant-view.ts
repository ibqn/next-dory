import { useViewMode } from "@/contexts/view-mode-context"

export function useIsParticipantView() {
  const { isParticipant } = useViewMode()
  return isParticipant
}

export function useIsAdminView() {
  const { isAdmin } = useViewMode()
  return isAdmin
}

export function useIsEventOwner() {
  const { isEventOwner } = useViewMode()
  return isEventOwner
}
