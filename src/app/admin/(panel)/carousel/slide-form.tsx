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
import { carouselSchema, type CarouselInput } from "@/lib/validators";
import { createSlide, updateSlide } from "./actions";

export function SlideForm({
  initial,
}: {
  initial?: { id: string } & CarouselInput;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.input<typeof carouselSchema>, unknown, CarouselInput>({
    resolver: zodResolver(carouselSchema),
    defaultValues: {
      imageUrl: initial?.imageUrl ?? "",
      headline: initial?.headline ?? "",
      subtext: initial?.subtext ?? "",
      ctaLabel: initial?.ctaLabel ?? "",
      ctaHref: initial?.ctaHref ?? "",
      sortOrder: initial?.sortOrder ?? 0,
      active: initial?.active ?? true,
    },
  });

  function onSubmit(values: CarouselInput) {
    startTransition(async () => {
      const res = initial
        ? await updateSlide(initial.id, values)
        : await createSlide(values);
      if (res.ok) {
        toast.success("Saved");
        router.push("/admin/carousel");
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
        <ImageField name="imageUrl" label="Slide image" />
        <TextField name="headline" label="Headline" />
        <TextareaField name="subtext" label="Subtext" rows={2} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="ctaLabel" label="Button label" placeholder="View Exhibition" />
          <TextField name="ctaHref" label="Button link" placeholder="/exhibitions/..." />
        </div>
        <TextField name="sortOrder" label="Sort order" type="number" />
        <SwitchField
          name="active"
          label="Active"
          description="Only active slides appear in the carousel."
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/carousel")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
