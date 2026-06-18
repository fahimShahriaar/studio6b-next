"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  TextField,
  TextareaField,
  ImageField,
  SwitchField,
} from "@/components/admin/form-fields";
import { eventSchema, type EventInput } from "@/lib/validators";
import { createEvent, updateEvent } from "./actions";

export function EventForm({
  initial,
}: {
  initial?: { id: string } & EventInput;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.input<typeof eventSchema>, unknown, EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initial?.title ?? "",
      body: initial?.body ?? "",
      imageUrl: initial?.imageUrl ?? "",
      location: initial?.location ?? "",
      startDate: initial?.startDate ?? "",
      endDate: initial?.endDate ?? "",
      published: initial?.published ?? true,
    },
  });

  function onSubmit(values: EventInput) {
    startTransition(async () => {
      const res = initial
        ? await updateEvent(initial.id, values)
        : await createEvent(values);
      if (res.ok) {
        toast.success("Saved");
        router.push("/admin/events");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-4"
      >
        <TextField name="title" label="Title" />
        <ImageField name="imageUrl" label="Image" />
        <TextareaField name="body" label="Description" rows={5} />
        <TextField name="location" label="Location" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="startDate" label="Start date" type="date" />
          <TextField name="endDate" label="End date" type="date" />
        </div>
        <SwitchField
          name="published"
          label="Published"
          description="Show this event on the What's On page."
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/events")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
