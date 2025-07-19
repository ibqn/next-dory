"use client"

import { accountInfoQueryOptions } from "@/api/account"
import { UserAvatar } from "@/components/user-avatar"
import { useSuspenseQuery } from "@tanstack/react-query"
import { format } from "date-fns"

export const Account = () => {
  const { data: accountInfo } = useSuspenseQuery(accountInfoQueryOptions())

  return (
    accountInfo && (
      <div className="mt-32 flex h-full w-full flex-col items-center">
        <UserAvatar className="h-14 w-14 ring ring-white" displayName={accountInfo.user.username} color="pink" />
        <h1 className="mt-3 text-2xl font-bold">{accountInfo.user.username}</h1>
        <time className="text-xs text-gray-500" suppressHydrationWarning>
          Member since {format(accountInfo.user.createdAt, "dd MMMM yyyy")}
        </time>

        <ul className="text-muted-foreground mt-6 space-y-1 text-sm">
          <li>Events: {accountInfo.eventCount}</li>
          <li>Questions Asked: {accountInfo.questionCount}</li>
          <li>Participating: {accountInfo.participationCount}</li>
          <li>Bookmarked Events: {accountInfo.bookmarkCount}</li>
        </ul>
      </div>
    )
  )
}
