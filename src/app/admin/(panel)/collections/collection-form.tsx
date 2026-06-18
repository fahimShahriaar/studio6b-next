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
  SwitchField,
  ImageField,
} from "@/components/admin/form-fields";
import {
  ArtworkPicker,
  type PickerArtwork,
} from "@/components/admin/artwork-picker";
import { collectionSchema, type CollectionInput } from "@/lib/validators";
import { createCollection, updateCollection } from "./actions";

export function CollectionForm({
  initial,
  artworks,
}: {
  initial?: { id: string } & CollectionInput;
  artworks: PickerArtwork[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.input<typeof collectionSchema>, unknown, CollectionInput>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      coverImageUrl: initial?.coverImageUrl ?? "",
      featured: initial?.featured ?? false,
      sortOrder: initial?.sortOrder ?? 0,
      artworkIds: initial?.artworkIds ?? [],
    },
  });

  function onSubmit(values: CollectionInput) {
    startTransition(async () => {
      const res = initial
        ? await updateCollection(initial.id, values)
        : await createCollection(values);
      if (res.ok) {
        toast.success("Saved");
        router.push("/admin/collections");
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
            <TextareaField name="description" label="Description" rows={3} />
            <ImageField name="coverImageUrl" label="Cover image" />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="sortOrder" label="Sort order" type="number" />
            </div>
            <SwitchField
              name="featured"
              label="Featured"
              description="Featured collections appear in the home page 'Explore Collections' section."
            />
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

        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/collections")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
