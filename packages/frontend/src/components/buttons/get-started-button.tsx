import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/class-names"

export const GetStartedButton = () => {
  return (
    <Link href={"#"} className={cn(buttonVariants(), "rounded-sm p-6 text-sm lg:p-8 lg:text-xl")}>
      Get Started 👉
    </Link>
  )
}
