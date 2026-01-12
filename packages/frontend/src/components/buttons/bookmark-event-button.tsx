"use client"

import type { Event } from "database/src/drizzle/schema/event"
import { debounce } from "lodash-es"
import { BookmarkIcon, BookmarkCheckIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { validateQueryOptions } from "@/api/auth"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Route } from "@/routes"

type Props = {
  event: Event
}

export const BookmarkEventButton = ({ event }: Props) => {
  const { data: user } = useSuspenseQuery(validateQueryOptions())

  const router = useRouter()

  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleBookmark = () => {
    toggleClientBookmark()

    console.log("Bookmarking event...")
  }

  const toggleClientBookmark = () => {
    const wasBookmarked = isBookmarked

    setIsBookmarked((prev) => !prev)

    toast(wasBookmarked ? "Event removed from bookmarks!" : "Event added to bookmarks!")
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => {
          router.push(Route.signIn)
        }}
      >
        <BookmarkIcon className="size-4" />
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleBookmark} variant={"outline"} className="rounded-full">
            {isBookmarked ? <BookmarkCheckIcon className="size-4" /> : <BookmarkIcon className="size-4" />}
          </Button>
        </TooltipTrigger>

        <TooltipContent className="bg-black text-sm text-white">
          {isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
