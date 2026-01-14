"use client"

import { event as eventValidation } from "database/src/validators/constants"
import { createEventSchema, type CreateEventSchema } from "database/src/validators/event"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createEventItem, eventListQueryOptions } from "@/api/event"
import { slugify } from "database/src/utils/slugify"
import { useEffect } from "react"

type Props = {
  onSuccess?: () => void
}

export const CreateEventForm = ({ onSuccess: handleSuccess }: Props) => {
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  })

  const name = form.watch("name")

  useEffect(() => {
    if (name) {
      form.setValue("slug", slugify(name))
    }
  }, [name, form])

  const queryClient = useQueryClient()

  const { mutate: createEvent, isPending } = useMutation({
    mutationFn: createEventItem,
    onError: () => {
      toast("Something went wrong", {
        description: "Failed to create the event!",
      })
    },
    onSuccess: () => {
      handleSuccess?.()

      toast("Your event has been created 🎉")
    },
    onSettled: async () => {
      form.reset()
      await queryClient.invalidateQueries({ queryKey: eventListQueryOptions().queryKey })
    },
  })

  const isFieldDisabled = form.formState.isSubmitting || isPending

  const onSubmit = form.handleSubmit(async (values: CreateEventSchema) => {
    createEvent(values)
  })

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={onSubmit}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-event-name">Event Name</FieldLabel>
                <Input
                  disabled={isFieldDisabled}
                  type="text"
                  {...field}
                  id="form-event-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Engineering Meeting"
                  maxLength={eventValidation.name.maxLength}
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-event-slug">Event Slug</FieldLabel>
                <Input
                  disabled={isFieldDisabled}
                  type="text"
                  {...field}
                  id="form-event-slug"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. engineering-meeting"
                  maxLength={eventValidation.slug.maxLength}
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-event-description">Event Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="form-event-description"
                    disabled={isFieldDisabled}
                    placeholder="What is your event about?"
                    maxLength={eventValidation.description.maxLength}
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value?.length ?? 0}/{eventValidation.description.maxLength} characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Include steps to reproduce, expected behavior, and what actually happened.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" className="mt-10 w-full" disabled={isFieldDisabled}>
          {isPending ? "Creating event..." : "Create Event"}
        </Button>
      </form>
    </FormProvider>
  )
}
