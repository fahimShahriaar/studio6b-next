"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, fail, type ActionResult } from "@/lib/admin";
import { eventSchema, type EventInput } from "@/lib/validators";
import { ensureUniqueSlug } from "@/lib/slug";

function revalidate() {
  revalidatePath("/admin/events");
  revalidatePath("/whats-on");
}

function toDate(v?: string) {
  return v ? new Date(v) : null;
}

export async function createEvent(input: EventInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;

  const slug = await ensureUniqueSlug(
    d.title,
    async (s) => !!(await prisma.event.findUnique({ where: { slug: s } }))
  );
  await prisma.event.create({
    data: {
      slug,
      title: d.title,
      body: d.body ?? null,
      imageUrl: d.imageUrl ?? null,
      location: d.location ?? null,
      startDate: toDate(d.startDate),
      endDate: toDate(d.endDate),
      published: d.published,
    },
  });
  revalidate();
  return ok();
}

export async function updateEvent(
  id: string,
  input: EventInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;

  await prisma.event.update({
    where: { id },
    data: {
      title: d.title,
      body: d.body ?? null,
      imageUrl: d.imageUrl ?? null,
      location: d.location ?? null,
      startDate: toDate(d.startDate),
      endDate: toDate(d.endDate),
      published: d.published,
    },
  });
  revalidate();
  return ok();
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidate();
  return ok();
}
