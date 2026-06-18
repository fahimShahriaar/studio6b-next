"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TextField, TextareaField } from "@/components/admin/form-fields";
import { settingsSchema, type SettingsInput } from "@/lib/validators";
import { updateSettings } from "./actions";

export function SettingsForm({ initial }: { initial: SettingsInput }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initial,
  });

  function onSubmit(values: SettingsInput) {
    startTransition(async () => {
      const res = await updateSettings(values);
      if (res.ok) {
        toast.success("Settings saved");
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
        className="max-w-2xl space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextField name="galleryName" label="Gallery name" />
            <TextField name="tagline" label="Tagline" />
            <TextareaField name="aboutText" label="About text" rows={4} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">WhatsApp inquiry</CardTitle>
            <CardDescription>
              Used by the &quot;Chat via WhatsApp&quot; button on artwork pages.
              Placeholders: {"{code}"}, {"{title}"}, {"{medium}"}, {"{artist}"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextField
              name="whatsappNumber"
              label="WhatsApp number"
              description="Local (01XXXXXXXXX) or international format."
            />
            <TextareaField
              name="whatsappTemplate"
              label="Message template"
              rows={3}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact & social</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextField name="contactEmail" label="Contact email" />
            <TextField name="contactPhone" label="Contact phone" />
            <TextField name="address" label="Address" />
            <TextField name="instagramUrl" label="Instagram URL" />
            <TextField name="facebookUrl" label="Facebook URL" />
          </CardContent>
        </Card>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </Form>
  );
}
