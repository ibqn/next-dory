import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { ComponentProps } from "react"

type Props = ComponentProps<typeof Avatar> & {
  displayName: string
  color?: string
}

const getFullNameInitials = (name: string) => {
  const initials = name.match(/\b\w/g) ?? []
  return initials.slice(0, 2).join("").toUpperCase() || "U"
}

export const UserAvatar = ({ displayName, color, ...props }: Props) => {
  return (
    <Avatar {...props}>
      <AvatarFallback style={{ backgroundColor: color ?? "pink" }} className="text-xs font-semibold text-white">
        {getFullNameInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  )
}
