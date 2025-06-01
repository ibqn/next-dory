import { GetStartedButton } from "@/components/buttons/get-started-button"
import { Headline } from "@/components/headline"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ValuePropositions } from "@/components/value-propositions"
import Image from "next/image"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#e8f0ff] to-[#bad0ee] px-4 pb-20">
      <div className="relative mx-auto mt-10 flex w-full flex-col items-center gap-y-8 lg:mt-16">
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
