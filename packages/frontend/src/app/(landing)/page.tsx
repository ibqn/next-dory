import { Headline } from "@/components/headline"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#e8f0ff] to-[#bad0ee] px-4 pb-20">
      <div className="relative mx-auto mt-10 flex w-full flex-col items-center gap-y-8 lg:mt-16">
        <Headline />
        {/* <GetStartedButton /> */}
      </div>
    </main>
  )
}
