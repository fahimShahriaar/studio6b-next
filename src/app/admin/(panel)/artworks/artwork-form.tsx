"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
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
import { artworkSchema, type ArtworkInput, AVAILABILITY } from "@/lib/validators";
import { createArtwork, updateArtwork } from "./actions";

const NONE = "__none__";

const availabilityOptions: Option[] = AVAILABILITY.map((v) => ({
  value: v,
  label: v.charAt(0) + v.slice(1).toLowerCase(),
}));

export type ArtworkInitial = {
  id: string;
} & ArtworkInput;

export function ArtworkForm({
  initial,
  artists,
  artTypes,
}: {
  initial?: ArtworkInitial;
  artists: Option[];
  artTypes: Option[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.input<typeof artworkSchema>, unknown, ArtworkInput>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      code: initial?.code ?? "",
      title: initial?.title ?? "",
      artistId: initial?.artistId ?? "",
      artTypeId: initial?.artTypeId ? initial.artTypeId : NONE,
      imageUrl: initial?.imageUrl ?? "",
      previewUrl: initial?.previewUrl ?? "",
      alt: initial?.alt ?? "",
      year: initial?.year ?? "",
      medium: initial?.medium ?? "",
      dimensions: initial?.dimensions ?? "",
      description: initial?.description ?? "",
      price: initial?.price ?? undefined,
      currency: initial?.currency ?? "BDT",
      priceVisible: initial?.priceVisible ?? true,
      availability: initial?.availability ?? "AVAILABLE",
      featured: initial?.featured ?? false,
      galleryImages: initial?.galleryImages ?? [],
    },
  });

  function onSubmit(values: ArtworkInput) {
    const payload: ArtworkInput = {
      ...values,
      artTypeId: values.artTypeId === NONE ? undefined : values.artTypeId,
    };
    startTransition(async () => {
      const res = initial
        ? await updateArtwork(initial.id, payload)
        : await createArtwork(payload);
      if (res.ok) {
        toast.success("Saved");
        router.push("/admin/artworks");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  const typeOptions: Option[] = [{ value: NONE, label: "— None —" }, ...artTypes];

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
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                name="code"
                label="Code"
                placeholder="e.g. M320"
                description="Unique code used in the WhatsApp inquiry."
              />
              <TextField name="title" label="Title" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField name="artistId" label="Artist" options={artists} />
              <SelectField name="artTypeId" label="Art type" options={typeOptions} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField name="year" label="Year" />
              <TextField name="medium" label="Medium" />
              <TextField name="dimensions" label="Dimensions" />
            </div>
            <TextareaField name="description" label="Description" rows={4} />
            <TextField name="alt" label="Image alt text" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing & availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField name="price" label="Price" type="number" />
              <TextField name="currency" label="Currency" />
              <SelectField
                name="availability"
                label="Availability"
                options={availabilityOptions}
              />
            </div>
            <SwitchField
              name="priceVisible"
              label="Show price publicly"
            />
            <SwitchField
              name="featured"
              label="Featured"
              description="Featured artworks can be highlighted on the home page."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageField name="imageUrl" label="Main image" />
              <ImageField name="previewUrl" label="Preview / thumbnail" />
            </div>
            <MultiImageField
              name="galleryImages"
              label="Gallery images"
              description="Additional detail shots shown on the artwork page."
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
            onClick={() => router.push("/admin/artworks")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
