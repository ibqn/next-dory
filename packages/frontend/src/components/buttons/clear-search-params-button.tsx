"use client"

import { XIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export const ClearSearchParamsButton = () => {
  const router = useRouter()
  const pathname = usePathname()

  const handleClear = () => {
    router.replace(`${pathname}`)
  }

  return (
    <Button variant={"outline"} size={"sm"} onClick={handleClear}>
      <XIcon className="mr-2 size-4" />
      <span>Clear</span>
    </Button>
  )
}
