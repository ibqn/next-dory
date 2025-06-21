import type { PropsWithChildren } from "react"

export default function EventLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
