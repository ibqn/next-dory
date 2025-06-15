import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import type { ReactNode } from "react"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/class-names"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Pulse | Real-time Q&A and Polls",
  description: "Connect with your audience with real-time Q&A and Polls with Pulse.",
}

type RootLayoutProps = Readonly<{
  children: ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistSans.variable, geistMono.variable, "bg-zinc-100 antialiased dark:bg-gray-700")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
