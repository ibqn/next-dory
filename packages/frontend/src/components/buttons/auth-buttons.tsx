"use client"

import { validateQueryOptions } from "@/api/auth"
import { Route } from "@/routes"
import { useSuspenseQuery } from "@tanstack/react-query"
import { BellIcon } from "lucide-react"
import Link from "next/link"
import { UserAvatar } from "@/components/user-avatar"
import { /* use, */ type ComponentProps } from "react"
import { cn } from "@/lib/class-names"
import { buttonVariants } from "../ui/button"

type Props = ComponentProps<"div">

export const AuthButtons = ({ className, ...props }: Props) => {
  const {
    data: { user },
  } = useSuspenseQuery(validateQueryOptions())

  // use(new Promise((resolve) => setTimeout(resolve, 1000)))

  return user ? (
    <div {...props} className={cn("inline-flex items-center gap-x-7", className)}>
      <BellIcon className="size-5" />
      <Link href={Route.dashboard} prefetch={false}>
        <UserAvatar displayName={user.username} color="#232323" className="ring-2 ring-white" />
      </Link>
    </div>
  ) : (
    <div {...props} className={cn("inline-flex items-center gap-x-3", className)}>
      <Link href={Route.signIn} className={cn(buttonVariants({ variant: "secondary" }))}>
        Sign In
      </Link>
      <Link href={Route.signUp} className={cn(buttonVariants(), "ring-1 ring-white")}>
        Sign Un
      </Link>
    </div>
  )
}
