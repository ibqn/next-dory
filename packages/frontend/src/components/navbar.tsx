import { Route } from "@/routes"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Suspense } from "react"
import { AuthLoader } from "./auth-loader"
import { AuthButtons } from "./buttons/auth-buttons"

export const Navbar = () => {
  return (
    <header className="text-primary-foreground px4 flex h-16 shrink-0 grow-0 items-center bg-blue-600 px-8">
      <Link href={Route.home} className="flex flex-row items-center-safe gap-1">
        <Logo />
        <span className="text-base font-bold tracking-wide">Pulse</span>
      </Link>

      <nav className="ml-auto">
        <Suspense fallback={<AuthLoader />}>
          <AuthButtons />
        </Suspense>
      </nav>
    </header>
  )
}
