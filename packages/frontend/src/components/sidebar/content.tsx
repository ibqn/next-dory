"use client"

import { usePathname, useRouter } from "next/navigation"
import { Item } from "./item"
import { sidebarItems } from "./item-data"
import { LogOutIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { getSignout } from "@/api/auth"

export const Content = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { mutate: signout } = useMutation({
    mutationFn: getSignout,
    onSettled: () => {
      router.refresh()
    },
  })

  return (
    <div className="flex h-full flex-col px-3 py-8">
      <nav className="flex flex-1 flex-col gap-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.route

          return (
            <button key={item.name} onClick={() => router.push(item.route)}>
              <Item item={item} isActive={isActive} />
            </button>
          )
        })}

        <div className="mt-auto w-full">
          <Button className="inline-flex w-full gap-x-2" variant="outline" onClick={() => signout()}>
            <LogOutIcon className="size-4" />
            <span>Sign out</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
