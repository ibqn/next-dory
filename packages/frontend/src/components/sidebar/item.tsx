import { cn } from "@/lib/class-names"
import type { SidebarItem } from "./item-data"

type Props = {
  item: SidebarItem
  isActive: boolean
}

export const Item = ({ item, isActive }: Props) => {
  const { icon: Icon } = item
  return (
    <div
      role="items"
      className={cn(
        "flex flex-row items-center gap-x-2 rounded-lg p-4 text-sm text-gray-500 transition-colors duration-150 select-none dark:text-white/60",
        isActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-primary/10"
      )}
    >
      <Icon className="size-4" />
      <span>{item.name}</span>
    </div>
  )
}
