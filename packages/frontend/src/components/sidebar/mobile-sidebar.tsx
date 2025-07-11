"use client"

import { MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/class-names"
import { buttonVariants } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Content } from "./content"
import { VisuallyHidden } from "@/components/visually-hidden"

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="pt-4 pl-4 lg:hidden">
        <div className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex flex-row")}>
          <MenuIcon className="size-5" />
          <span>Menu</span>
        </div>
      </SheetTrigger>
      <SheetContent className="w-[250px] p-0 pt-2" side="left">
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
        </VisuallyHidden>

        <Content />
      </SheetContent>
    </Sheet>
  )
}
