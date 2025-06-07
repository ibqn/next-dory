import { Route } from "@/routes"
import { ComponentIcon, BookMarkedIcon, UserIcon } from "lucide-react"

export type SidebarItem = {
  name: string
  route: Route
  icon: typeof ComponentIcon
}

export const sidebarItems: SidebarItem[] = [
  {
    name: "Your Events",
    route: Route.dashboard,
    icon: ComponentIcon,
  },
  {
    name: "Bookmarked",
    route: Route.bookmarked,
    icon: BookMarkedIcon,
  },
  {
    name: "Account",
    route: Route.account,
    icon: UserIcon,
  },
] as const
