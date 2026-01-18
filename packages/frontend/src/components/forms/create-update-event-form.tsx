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
import { createEventItem, eventListQueryOptions, eventQueryKey, updateEventItem } from "@/api/event"
import { slugify } from "database/src/utils/slugify"
import { useEffect, useMemo } from "react"
import type { Event } from "database/src/drizzle/schema/event"

type Props = {
  event?: Event
  onSuccess?: () => void
}

export const CreateUpdateEventForm = ({ event, onSuccess: handleSuccess }: Props) => {
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: event?.name ?? "",
      slug: event?.slug ?? "",
      description: event?.description ?? "",
    },
  })

  const name = form.watch("name")

  useEffect(() => {
    if (name) {
      form.setValue("slug", slugify(name))
    }
  }, [name, form])

  const queryClient = useQueryClient()

  const { mutate: createUpdateEvent, isPending } = useMutation({
    mutationFn: event ? (values: CreateEventSchema) => updateEventItem({ id: event.id, ...values }) : createEventItem,
    onError: () => {
      toast("Something went wrong", {
        description: `Failed to ${event ? "update" : "create"} the event!`,
      })
    },
    onSuccess: () => {
      handleSuccess?.()

      toast(`Your event has been ${event ? "updated" : "created"} 🎉`)
    },
    onSettled: async () => {
      form.reset()
      await queryClient.invalidateQueries({ queryKey: eventListQueryOptions().queryKey })

      if (event) {
        await queryClient.invalidateQueries({
          queryKey: eventQueryKey({ id: event.id }),
        })
      }
    },
  })

  const isFieldDisabled = form.formState.isSubmitting || isPending

  const onSubmit = form.handleSubmit(async (values: CreateEventSchema) => {
    createUpdateEvent(values)
  })

  const pendingButtonText = useMemo(() => (event ? "Updating event..." : "Creating event..."), [event])
  const actionButtonText = useMemo(() => (event ? "Update Event" : "Create Event"), [event])

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
          {isPending ? pendingButtonText : actionButtonText}
        </Button>
      </form>
    </FormProvider>
  )
}
