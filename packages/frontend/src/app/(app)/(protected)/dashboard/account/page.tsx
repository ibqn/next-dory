import { Account } from "@/components/account"
import { Suspense } from "react"
import { Loader } from "@/components/loader"

export default function AccountPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Account />
    </Suspense>
  )
}
