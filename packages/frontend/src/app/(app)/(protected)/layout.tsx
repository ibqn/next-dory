import { validateRequest } from "@/auth"
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

  return children
}
