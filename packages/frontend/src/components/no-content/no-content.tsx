import { cn } from "@/lib/class-names"
import type { ComponentProps } from "react"
import { CreateIllustration } from "./create-illustration"

type Props = ComponentProps<"div"> & { svgProps?: ComponentProps<"svg"> }

export const NoContent = ({ children, className, svgProps, ...props }: Props) => (
  <div {...props} className={cn("flex flex-col items-center", className)}>
    <CreateIllustration {...svgProps} />
    {children}
  </div>
)
