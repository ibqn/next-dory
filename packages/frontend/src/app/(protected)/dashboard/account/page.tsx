import { Account } from "@/components/account"
import { Suspense } from "react"

export default function AccountPage() {
  return (
    <Suspense>
      <Account />
    </Suspense>
  )
}
