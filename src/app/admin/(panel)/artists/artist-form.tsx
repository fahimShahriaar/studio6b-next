"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  TextField,
  TextareaField,
  ImageField,
} from "@/components/admin/form-fields";
import { artistSchema, type ArtistInput } from "@/lib/validators";
import { createArtist, updateArtist } from "./actions";

export function ArtistForm({
  initial,
}: {
  initial?: {
    id: string;
    name: string;
    bio: string | null;
    imageUrl: string | null;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<ArtistInput>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: initial?.name ?? "",
      bio: initial?.bio ?? "",
      imageUrl: initial?.imageUrl ?? "",
    },
  });

  function onSubmit(values: ArtistInput) {
    startTransition(async () => {
      const res = initial
        ? await updateArtist(initial.id, values)
        : await createArtist(values);
      if (res.ok) {
        toast.success("Saved");
        router.push("/admin/artists");
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
        <TextField name="name" label="Name" placeholder="Artist name" />
        <ImageField name="imageUrl" label="Portrait image" />
        <TextareaField
          name="bio"
          label="Biography"
          rows={6}
          placeholder="Artist biography…"
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/artists")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
