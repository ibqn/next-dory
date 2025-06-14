"use client"

import { userQueryOptions } from "@/api/auth"
import { userInfoQueryOptions } from "@/api/user"
import { UserAvatar } from "@/components/user-avatar"
import { useSuspenseQuery } from "@tanstack/react-query"
import { format } from "date-fns"

export const Account = () => {
  const { data: user } = useSuspenseQuery(userQueryOptions())
  const { data: userInfo } = useSuspenseQuery(userInfoQueryOptions())

  return (
    user && (
      <div className="mt-32 flex h-full w-full flex-col items-center">
        <UserAvatar className="h-14 w-14 ring ring-white" displayName={user.username} color="pink" />

        <h1 className="mt-3 text-2xl font-bold">{user.username}</h1>

        <time className="text-xs text-gray-500" suppressHydrationWarning>
          Member since {format(user.createdAt, "dd MMMM yyyy")}
        </time>

        {userInfo && (
          <ul className="text-muted-foreground mt-6 space-y-1 text-sm">
            <li>Events: {userInfo.eventsCount}</li>
            <li>Questions Asked: {userInfo.questionsCount}</li>
            <li>Participating: {userInfo.participationsCount}</li>
            <li>Bookmarked Events: {userInfo.bookmarksCount}</li>
          </ul>
        )}
      </div>
    )
  )
}
