"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, fail, type ActionResult } from "@/lib/admin";
import { exhibitionSchema, type ExhibitionInput } from "@/lib/validators";
import { ensureUniqueSlug } from "@/lib/slug";

function revalidate(slug?: string) {
  revalidatePath("/admin/exhibitions");
  revalidatePath("/exhibitions");
  revalidatePath("/whats-on");
  revalidatePath("/");
  if (slug) revalidatePath(`/exhibitions/${slug}`);
}

function toDate(v?: string) {
  return v ? new Date(v) : null;
}

function baseData(d: ExhibitionInput) {
  return {
    title: d.title,
    status: d.status,
    summary: d.summary ?? null,
    description: d.description ?? null,
    heroImageUrl: d.heroImageUrl ?? null,
    location: d.location ?? null,
    startDate: toDate(d.startDate),
    endDate: toDate(d.endDate),
    featured: d.featured,
    published: d.published,
  };
}

export async function createExhibition(
  input: ExhibitionInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = exhibitionSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;

  const slug = await ensureUniqueSlug(
    d.title,
    async (s) => !!(await prisma.exhibition.findUnique({ where: { slug: s } }))
  );

  await prisma.exhibition.create({
    data: {
      ...baseData(d),
      slug,
      images: {
        create: d.galleryImages.map((url, i) => ({ url, sortOrder: i })),
      },
      artworks: {
        create: d.artworkIds.map((artworkId, i) => ({
          artworkId,
          sortOrder: i,
        })),
      },
    },
  });
  revalidate(slug);
  return ok();
}

export async function updateExhibition(
  id: string,
  input: ExhibitionInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = exhibitionSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;

  const existing = await prisma.exhibition.findUnique({ where: { id } });
  if (!existing) return fail("Exhibition not found");

  await prisma.$transaction([
    prisma.exhibitionImage.deleteMany({ where: { exhibitionId: id } }),
    prisma.exhibitionArtwork.deleteMany({ where: { exhibitionId: id } }),
    prisma.exhibition.update({
      where: { id },
      data: {
        ...baseData(d),
        images: {
          create: d.galleryImages.map((url, i) => ({ url, sortOrder: i })),
        },
        artworks: {
          create: d.artworkIds.map((artworkId, i) => ({
            artworkId,
            sortOrder: i,
          })),
        },
      },
    }),
  ]);
  revalidate(existing.slug);
  return ok();
}

export async function deleteExhibition(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.exhibition.delete({ where: { id } });
  revalidate();
  return ok();
}
