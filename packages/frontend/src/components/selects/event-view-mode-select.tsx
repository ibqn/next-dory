"use client"

import { useViewMode, type ViewMode } from "@/contexts/view-mode-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EyeIcon, LockIcon } from "lucide-react"
import type { ComponentProps } from "react"

type EventViewModeSelectProps = ComponentProps<"div">

export function EventViewModeSelect({ className, ...props }: EventViewModeSelectProps) {
  const { viewMode, setViewMode } = useViewMode()

  const handleValueChange = (value: ViewMode) => {
    setViewMode(value)
  }

  return (
    <div className={className} {...props}>
      <Select value={viewMode} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              {viewMode === "admin" ? (
                <>
                  <LockIcon className="size-4" />
                  <span>Admin View</span>
                </>
              ) : (
                <>
                  <EyeIcon className="size-4" />
                  <span>Participant View</span>
                </>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="participant">
            <div className="flex items-center gap-2">
              <EyeIcon className="size-4" />
              <span>Participant View</span>
            </div>
          </SelectItem>
          <SelectItem value="admin">
            <div className="flex items-center gap-2">
              <LockIcon className="size-4" />
              <span>Admin View</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
