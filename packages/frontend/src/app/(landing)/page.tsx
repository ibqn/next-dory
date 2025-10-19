import { AuthLoader } from "@/components/auth-loader"
import { AuthButtons } from "@/components/buttons/auth-buttons"
import { GetStartedButton } from "@/components/buttons/get-started-button"
import { Headline } from "@/components/headline"
import { ThemeToggle } from "@/components/theme-toggle"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ValuePropositions } from "@/components/value-propositions"
import Image from "next/image"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-linear-to-br from-[#e8f0ff] to-[#bad0ee] px-4 pb-20 dark:from-[#3B4A66] dark:to-[#283C55]">
      <nav className="mt-6 ml-auto inline-flex items-center gap-4">
        <ThemeToggle />
        <Suspense fallback={<AuthLoader />}>
          <AuthButtons />
        </Suspense>
      </nav>

      <div className="relative mx-auto mt-10 flex w-full flex-1 flex-col items-center justify-center gap-y-8 lg:mt-16">
        <Headline />
        <GetStartedButton />

        <div className="w-full overflow-hidden rounded-lg md:max-w-2xl">
          <AspectRatio ratio={16 / 9}>
            <Image
              style={{ imageRendering: "crisp-edges" }}
              src="/preview.webp"
              alt="Preview features"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center"
            />
          </AspectRatio>
        </div>

        <ValuePropositions />
      </div>
    </main>
  )
}
