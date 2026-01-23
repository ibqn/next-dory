import { cn } from "@/lib/class-names"
import type { PropsWithChildren } from "react"
import type { LucideIcon } from "lucide-react"

type Props = PropsWithChildren<{
  isActive: boolean
  text: string
  icon: LucideIcon
}>

export const SidebarItem = ({ isActive, text, icon: Icon, children }: Props) => {
  return (
    <div
      role="item"
      className={cn(
        "flex items-center gap-x-2 rounded-lg p-4 text-sm text-gray-500 transition-colors duration-150 select-none",
        isActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-primary/10"
      )}
    >
      <Icon className="size-4" />
      <span>{text}</span>
      {children}
    </div>
  )
}
