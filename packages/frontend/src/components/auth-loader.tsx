import type { ComponentProps } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/class-names"

type Props = ComponentProps<typeof Skeleton>

export const AuthLoader = ({ className, ...props }: Props) => (
  <Skeleton {...props} className={cn("h-8 w-32 bg-gray-100/50", className)} />
)
