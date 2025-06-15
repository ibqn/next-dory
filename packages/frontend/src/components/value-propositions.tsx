import { MessageCircleMore, Radio } from "lucide-react"

const valuePropositions = [
  {
    title: "Collect Q&A",
    icon: MessageCircleMore,
    description:
      "Allow your audience to ask questions during your presentation and let them upvote the most requested ones.",
  },
  {
    title: "Real-time Polls",
    icon: Radio,
    description: "Get instant feedback from your audience with live polls, making your sessions more interactive.",
  },
]

export const ValuePropositions = () => {
  return (
    <div className="mt-4 grid max-w-2xl grid-cols-1 gap-8 px-4 sm:grid-cols-2">
      {valuePropositions.map(({ title, icon: Icon, description }, index) => (
        <div key={index} className="flex flex-col items-start gap-y-2">
          <Icon className="size-6 stroke-blue-600" />
          <div className="item-center inline-flex gap-x-2">
            <h2 className="text-xl font-bold text-pretty">{title}</h2>
          </div>
          <p className="text-muted-foreground text-sm text-pretty">{description}</p>
        </div>
      ))}
    </div>
  )
}
