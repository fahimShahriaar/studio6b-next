"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, fail, type ActionResult } from "@/lib/admin";
import { carouselSchema, type CarouselInput } from "@/lib/validators";

function revalidate() {
  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

export async function createSlide(input: CarouselInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = carouselSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;
  await prisma.carouselSlide.create({
    data: {
      imageUrl: d.imageUrl,
      headline: d.headline ?? null,
      subtext: d.subtext ?? null,
      ctaLabel: d.ctaLabel ?? null,
      ctaHref: d.ctaHref ?? null,
      sortOrder: d.sortOrder,
      active: d.active,
    },
  });
  revalidate();
  return ok();
}

export async function updateSlide(
  id: string,
  input: CarouselInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = carouselSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;
  await prisma.carouselSlide.update({
    where: { id },
    data: {
      imageUrl: d.imageUrl,
      headline: d.headline ?? null,
      subtext: d.subtext ?? null,
      ctaLabel: d.ctaLabel ?? null,
      ctaHref: d.ctaHref ?? null,
      sortOrder: d.sortOrder,
      active: d.active,
    },
  });
  revalidate();
  return ok();
}

export async function deleteSlide(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.carouselSlide.delete({ where: { id } });
  revalidate();
  return ok();
}
