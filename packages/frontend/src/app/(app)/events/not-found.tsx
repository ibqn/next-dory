import { NotFound } from "@/components/not-found"

const NotFoundPage = () => {
  return (
    <div className="grid grow place-items-center">
      <NotFound>
        <span className="p-8 text-xl font-semibold">We didn&apos;t find what you were looking for.</span>
      </NotFound>
    </div>
  )
}

export default NotFoundPage
