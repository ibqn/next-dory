import { cn } from "@/lib/class-names"
import type { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  isActive: boolean
  onClick: () => void
}>

export const NavTabButton = ({ isActive, onClick, children }: Props) => {
  return (
    <button
      className={cn("rounded-full px-4 py-2 text-sm transition-colors duration-150 lg:text-base", {
        "bg-primary text-white": isActive,
        "text-gray-500 hover:bg-gray-100": !isActive,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
