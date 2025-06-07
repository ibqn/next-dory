import { validateRequest } from "@/auth"
import { Navbar } from "@/components/navbar"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const validationResult = await validateRequest()

  console.log("validate", validationResult)

  if (!validationResult.user) {
    redirect("/sign-in")
  }

  return (
    <div className="flex flex-col">
      <Navbar />

      <main className="flex min-h-[calc(100vh-var(--navbar-height))]">{children}</main>
    </div>
  )
}
