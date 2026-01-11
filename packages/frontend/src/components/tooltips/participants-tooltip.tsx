import { cn } from "@/lib/class-names"
import { UsersIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ComponentProps } from "react"

type Props = ComponentProps<"div"> & { participantsCount: number }

export const ParticipantsTooltip = ({ participantsCount, className }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "inline-flex cursor-pointer items-center gap-x-2 rounded-lg p-2 text-xs hover:bg-slate-200 lg:text-sm",
              className
            )}
          >
            <UsersIcon className="size-5 lg:size-6" />

            <span className="lining-nums">{participantsCount}</span>
          </div>
        </TooltipTrigger>

        <TooltipContent className="rounded-lg bg-black text-sm text-white">
          <p>{participantsCount} people have joined this event!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
