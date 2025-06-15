import { Route } from "@/routes"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Suspense } from "react"
import { AuthLoader } from "./auth-loader"
import { AuthButtons } from "./buttons/auth-buttons"
import { ThemeToggle } from "./theme-toggle"

export const Navbar = () => {
  return (
    <header className="text-primary-foreground px4 flex h-16 shrink-0 grow-0 items-center bg-blue-600 px-8 dark:bg-blue-300">
      <Link href={Route.home} className="flex flex-row items-center-safe gap-1">
        <Logo />
        <span className="text-base font-bold tracking-wide">Pulse</span>
      </Link>

      <nav className="ml-auto inline-flex items-center gap-4">
        <ThemeToggle />
        <Suspense fallback={<AuthLoader />}>
          <AuthButtons />
        </Suspense>
      </nav>
    </header>
  )
}
