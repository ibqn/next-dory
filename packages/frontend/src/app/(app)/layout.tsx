import { Navbar } from "@/components/navbar"
import type { ReactNode } from "react"

export const dynamic = "force-dynamic"

type Props = Readonly<{
  children: ReactNode
}>

export default async function Layout({ children }: Props) {
  return (
    <div className="flex flex-col">
      <Navbar />

      <main className="flex min-h-[calc(100vh-var(--navbar-height))]">{children}</main>
    </div>
  )
}
