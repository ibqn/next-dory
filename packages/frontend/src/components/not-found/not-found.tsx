import { cn } from "@/lib/class-names"
import type { ComponentProps } from "react"
import { EmptyIllustration } from "./empty-illustration"

type Props = ComponentProps<"div"> & { svgProps?: ComponentProps<"svg"> }

export const NotFound = ({ children, className, svgProps, ...props }: Props) => (
  <div {...props} className={cn("flex flex-col items-center", className)}>
    <EmptyIllustration {...svgProps} />
    {children}
  </div>
)
