"use client"

import { RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export const RefreshButton = () => {
  const router = useRouter()

  return (
    <Button onClick={() => router.refresh()} variant={"ghost"}>
      <RefreshCcw className="size-4" />
      <span className="hidden lg:ml-2 lg:inline-block">Refresh</span>
    </Button>
  )
}
