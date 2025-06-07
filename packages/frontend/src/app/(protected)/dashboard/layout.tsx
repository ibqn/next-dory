import { Sidebar } from "@/components/sidebar/sidebar"
import type { PropsWithChildren } from "react"

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-1 flex-row">
      <Sidebar />

      <div className="flex w-full grow flex-col items-start overflow-hidden">{children}</div>
    </div>
  )
}
