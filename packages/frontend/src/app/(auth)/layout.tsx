import { validateRequest } from "@/auth"
import { Route } from "@/routes"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

type Props = Readonly<{
  children: ReactNode
}>

export default async function AuthLayout({ children }: Props) {
  const { user } = await validateRequest()

  if (user) {
    redirect(Route.dashboard)
  }

  return <div className="flex min-h-screen items-center justify-center">{children}</div>
}
