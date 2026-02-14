"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { getQueryClient } from "@/lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { PropsWithChildren } from "react"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: PropsWithChildren) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ReactQueryStreamedHydration>
          <TooltipProvider>{children}</TooltipProvider>
        </ReactQueryStreamedHydration>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
