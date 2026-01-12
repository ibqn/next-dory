import { BookmarkedEventList } from "@/components/bookmarked-event-list"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Suspense } from "react"

export default function BookmarksPage() {
  return (
    <ScrollArea className="w-full flex-1 px-4 py-2">
      <h2 className="mt-4 mb-2 ml-4 text-2xl font-bold">Bookmarked Events</h2>

      <div>
        <Suspense>
          <BookmarkedEventList />
        </Suspense>
      </div>
    </ScrollArea>
  )
}
