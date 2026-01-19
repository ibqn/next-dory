"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

type RedirectProps = {
  to: string
  replace?: boolean
}

export function Redirect({ to, replace = true }: RedirectProps) {
  const router = useRouter()

  useEffect(() => {
    if (replace) {
      router.replace(to)
    } else {
      router.push(to)
    }
  }, [to, replace, router])

  return null
}
