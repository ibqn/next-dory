import { validateRequest } from "@/auth"
import { Navbar } from "@/components/navbar"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

export const dynamic = "force-dynamic"

type Props = Readonly<{
  children: ReactNode
}>

export default async function Layout({ children }: Props) {
  const { user } = await validateRequest()

  console.log("validate", user)

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="flex flex-col">
      <Navbar />

      <main className="flex min-h-[calc(100vh-var(--navbar-height))]">{children}</main>
    </div>
  )
}
