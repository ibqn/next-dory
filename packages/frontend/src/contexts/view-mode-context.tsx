"use client"

import { createContext, useContext, useState, type PropsWithChildren } from "react"

export const ViewMode = {
  admin: "admin",
  participant: "participant",
} as const

export type ViewMode = (typeof ViewMode)[keyof typeof ViewMode]

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  isEventOwner: boolean
  isAdmin: boolean
  isParticipant: boolean
}

const ViewModeContext = createContext<ViewModeContextType | null>(null)

interface ViewModeProviderProps extends PropsWithChildren {
  defaultViewMode?: ViewMode
  isEventOwner?: boolean
}

export function ViewModeProvider({
  children,
  defaultViewMode = ViewMode.participant,
  isEventOwner = false,
}: ViewModeProviderProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode)

  const contextValue: ViewModeContextType = {
    viewMode,
    setViewMode: (mode: ViewMode) => {
      if (mode === ViewMode.admin && !isEventOwner) {
        return
      }
      setViewMode(mode)
    },
    isEventOwner,
    isAdmin: viewMode === ViewMode.admin,
    isParticipant: viewMode === ViewMode.participant,
  }

  return <ViewModeContext value={contextValue}>{children}</ViewModeContext>
}

export function useViewMode() {
  const context = useContext(ViewModeContext)

  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider")
  }

  return context
}
