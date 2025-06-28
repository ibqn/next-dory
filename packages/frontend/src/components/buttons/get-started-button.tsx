"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/class-names"
import { useQuery } from "@tanstack/react-query"
import { userQueryOptions } from "@/api/auth"
import { useEffect, useState } from "react"
import { Route } from "@/routes"

export const GetStartedButton = () => {
  const { data: user } = useQuery(userQueryOptions())
  const [href, setHref] = useState<string>(Route.signIn)

  useEffect(() => {
    if (user) {
      setHref(Route.dashboard)
    } else {
      setHref(Route.signIn)
    }
  }, [user])

  return (
    <Link href={href} className={cn(buttonVariants(), "rounded-sm p-6 text-sm lg:p-8 lg:text-xl")}>
      Get Started 👉
    </Link>
  )
}
