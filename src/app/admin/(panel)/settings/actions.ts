"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, fail, type ActionResult } from "@/lib/admin";
import { settingsSchema, type SettingsInput } from "@/lib/validators";

export async function updateSettings(
  input: SettingsInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;

  const data = {
    galleryName: d.galleryName,
    tagline: d.tagline ?? null,
    whatsappNumber: d.whatsappNumber,
    whatsappTemplate: d.whatsappTemplate,
    contactEmail: d.contactEmail ?? null,
    contactPhone: d.contactPhone ?? null,
    address: d.address ?? null,
    instagramUrl: d.instagramUrl ?? null,
    facebookUrl: d.facebookUrl ?? null,
    aboutText: d.aboutText ?? null,
  };

  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  // Settings affect the whole site (footer, WhatsApp links, etc.)
  revalidatePath("/", "layout");
  return ok();
}
