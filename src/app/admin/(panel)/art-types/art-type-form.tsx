"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/admin/form-fields";
import { artTypeSchema, type ArtTypeInput } from "@/lib/validators";
import { createArtType, updateArtType } from "./actions";

export function ArtTypeForm({
  initial,
}: {
  initial?: { id: string; name: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<ArtTypeInput>({
    resolver: zodResolver(artTypeSchema),
    defaultValues: { name: initial?.name ?? "" },
  });

  function onSubmit(values: ArtTypeInput) {
    startTransition(async () => {
      const res = initial
        ? await updateArtType(initial.id, values)
        : await createArtType(values);
      if (res.ok) {
        toast.success("Saved");
        router.push("/admin/art-types");
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
        className="max-w-md space-y-4"
      >
        <TextField name="name" label="Name" placeholder="e.g. Painting" />
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/art-types")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
