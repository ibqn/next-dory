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
    <div>
      <Navbar />

      <main className="min-h-[calc(100vh-variable(--navbar-height))]">{children}</main>
    </div>
  )
}
