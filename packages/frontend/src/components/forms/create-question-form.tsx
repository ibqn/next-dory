"use client"

import { validateQueryOptions } from "@/api/auth"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import type { Event } from "database/src/drizzle/schema/event"
import type { Question } from "database/src/drizzle/schema/question"
import { createQuestionSchema, type CreateQuestionSchema } from "database/src/validators/question"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { Button, buttonVariants } from "@/components/ui/button"
import { MessageSquareIcon } from "lucide-react"
import { cn } from "@/lib/class-names"
import Link from "next/link"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { question } from "database/src/validators/constants"
import { toast } from "sonner"
import { createQuestionItem } from "@/api/question"
import { ComponentProps } from "react"

type Props = {
  eventId: Event["id"]
  onSuccess: (data: Question) => void
} & ComponentProps<"form">

export const CreateQuestionForm = ({ eventId, onSuccess: handleSuccess, className, ...props }: Props) => {
  const {
    data: { user },
  } = useSuspenseQuery(validateQueryOptions())

  const isAuthenticated = Boolean(user)

  const form = useForm<CreateQuestionSchema>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      body: "",
      eventId,
    },
  })

  const { mutate: createQuestion, isPending } = useMutation({
    mutationFn: createQuestionItem,
    onSuccess: (data) => {
      if (data) {
        handleSuccess(data)
      }

      toast("Your question has been posted! 🎉")
      form.reset()
    },
    onError: () => {
      toast("Something went wrong", { description: "Failed to post your question. Please retry." })
    },
    onSettled: () => {},
  })

  const isFieldDisabled = form.formState.isSubmitting || isPending

  const onSubmit = form.handleSubmit(async (values: CreateQuestionSchema) => {
    createQuestion(values)
  })

  return (
    <FormProvider {...form}>
      <form
        className={cn("border-primary/60 rounded-lg border border-dashed px-3 py-2", className)}
        onSubmit={onSubmit}
        {...props}
      >
        <FieldGroup>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-question-body">Your Question</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="form-question-body"
                    disabled={isFieldDisabled}
                    placeholder="What do you want to ask about?"
                    maxLength={question.maxLength}
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value?.length ?? 0}/{question.maxLength} characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="mt-3 flex justify-between gap-x-4">
          <FieldDescription>Be specific and clear to get the best answers from the community.</FieldDescription>
          <div className="flex justify-end">
            {isAuthenticated ? (
              <Button type="submit" size="lg" disabled={isFieldDisabled}>
                <MessageSquareIcon className="mr-2 size-4" />

                <span className="text-xs lg:text-sm">{isPending ? "Posting..." : "Ask"}</span>
              </Button>
            ) : (
              <Link href="/signin" className={cn(buttonVariants({ variant: "default", size: "lg" }))}>
                <MessageSquareIcon className="mr-2 size-4" />

                <span className="text-xs lg:text-sm">Ask</span>
              </Link>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
