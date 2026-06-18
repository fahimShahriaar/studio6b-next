"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TextField,
  TextareaField,
  SelectField,
  SwitchField,
  ImageField,
  MultiImageField,
  type Option,
} from "@/components/admin/form-fields";
import {
  ArtworkPicker,
  type PickerArtwork,
} from "@/components/admin/artwork-picker";
import {
  exhibitionSchema,
  type ExhibitionInput,
  EXHIBITION_STATUS,
} from "@/lib/validators";
import { createExhibition, updateExhibition } from "./actions";

const statusOptions: Option[] = EXHIBITION_STATUS.map((v) => ({
  value: v,
  label: v.charAt(0) + v.slice(1).toLowerCase(),
}));

export function ExhibitionForm({
  initial,
  artworks,
}: {
  initial?: { id: string } & ExhibitionInput;
  artworks: PickerArtwork[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.input<typeof exhibitionSchema>, unknown, ExhibitionInput>({
    resolver: zodResolver(exhibitionSchema),
    defaultValues: {
      title: initial?.title ?? "",
      status: initial?.status ?? "UPCOMING",
      summary: initial?.summary ?? "",
      description: initial?.description ?? "",
      heroImageUrl: initial?.heroImageUrl ?? "",
      location: initial?.location ?? "",
      startDate: initial?.startDate ?? "",
      endDate: initial?.endDate ?? "",
      featured: initial?.featured ?? false,
      published: initial?.published ?? true,
      galleryImages: initial?.galleryImages ?? [],
      artworkIds: initial?.artworkIds ?? [],
    },
  });

  function onSubmit(values: ExhibitionInput) {
    startTransition(async () => {
      const res = initial
        ? await updateExhibition(initial.id, values)
        : await createExhibition(values);
      if (res.ok) {
        toast.success("Saved");
        router.push("/admin/exhibitions");
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
        className="max-w-3xl space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextField name="title" label="Title" />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField name="status" label="Status" options={statusOptions} />
              <TextField name="location" label="Location" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="startDate" label="Start date" type="date" />
              <TextField name="endDate" label="End date" type="date" />
            </div>
            <TextField name="summary" label="Summary" />
            <TextareaField name="description" label="Description" rows={5} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageField name="heroImageUrl" label="Hero image" />
            <MultiImageField name="galleryImages" label="Gallery images" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Artworks</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              name="artworkIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Artworks</FormLabel>
                  <ArtworkPicker
                    artworks={artworks}
                    value={field.value ?? []}
                    onChange={(ids) => field.onChange(ids)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SwitchField name="featured" label="Featured" />
            <SwitchField
              name="published"
              label="Published"
              description="Unpublished exhibitions are hidden from the public site."
            />
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/exhibitions")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
