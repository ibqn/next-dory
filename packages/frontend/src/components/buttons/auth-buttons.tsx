"use client"

import { userQueryOptions } from "@/api/auth"
import { Route } from "@/routes"
import { useSuspenseQuery } from "@tanstack/react-query"
import { BellIcon } from "lucide-react"
import Link from "next/link"
import { UserAvatar } from "@/components/user-avatar"
import { ComponentProps } from "react"
import { cn } from "@/lib/class-names"

type Props = ComponentProps<"div">

export const AuthButtons = ({ className, ...props }: Props) => {
  const { data: user } = useSuspenseQuery(userQueryOptions())

  return (
    user && (
      <div {...props} className={cn("inline-flex items-center gap-x-7", className)}>
        <BellIcon className="size-5" />
        <Link href={Route.dashboard} prefetch={false}>
          <UserAvatar displayName={user.username} color="#232323" className="ring-2 ring-white" />
        </Link>
      </div>
    )
  )
}
