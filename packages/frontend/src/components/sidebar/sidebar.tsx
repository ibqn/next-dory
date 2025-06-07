import { cn } from "@/lib/class-names"
import { Content } from "./content"

export const Sidebar = () => {
  return (
    <aside
      className={cn("hidden h-full shrink-0 grow-0 border-r border-r-blue-500/30 bg-white lg:block lg:basis-[250px]")}
    >
      <Content />
    </aside>
  )
}
