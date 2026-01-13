"use client"

import { cn } from "@/lib/class-names"
import { type ChangeEvent, type ComponentProps, useState } from "react"
import { Textarea } from "@/components/ui/textarea"

type Props = ComponentProps<typeof Textarea>

export const TextAreaWithCounter = ({
  className,
  defaultValue = "",
  maxLength = 10_000,
  onChange,
  autoComplete = "off",
  autoFocus = false,
  ...props
}: Props) => {
  const [content, setContent] = useState<string>(defaultValue as string)

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)

    onChange?.(event)
  }

  return (
    <div>
      <Textarea
        className={cn(
          "max-h-32 min-h-10 ring-1 ring-slate-400/20 focus-visible:ring-1 focus-visible:ring-slate-500",
          className
        )}
        value={content}
        onChange={handleContentChange}
        {...props}
      />

      <span className="ml-2 text-xs font-light">
        {content.length} / {maxLength}
      </span>
    </div>
  )
}
