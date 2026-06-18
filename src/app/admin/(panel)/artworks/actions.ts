"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, fail, type ActionResult } from "@/lib/admin";
import { artworkSchema, type ArtworkInput } from "@/lib/validators";
import { ensureUniqueSlug } from "@/lib/slug";

function revalidate() {
  revalidatePath("/admin/artworks");
  revalidatePath("/collections");
  revalidatePath("/");
}

function baseData(d: ArtworkInput) {
  return {
    code: d.code,
    title: d.title,
    artistId: d.artistId,
    artTypeId: d.artTypeId ?? null,
    imageUrl: d.imageUrl,
    previewUrl: d.previewUrl ?? null,
    alt: d.alt ?? null,
    year: d.year ?? null,
    medium: d.medium ?? null,
    dimensions: d.dimensions ?? null,
    description: d.description ?? null,
    price: d.price ?? null,
    currency: d.currency,
    priceVisible: d.priceVisible,
    availability: d.availability,
    featured: d.featured,
  };
}

export async function createArtwork(input: ArtworkInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = artworkSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;

  if (await prisma.artwork.findUnique({ where: { code: d.code } })) {
    return fail(`Artwork code "${d.code}" is already in use.`);
  }
  const slug = await ensureUniqueSlug(
    d.title,
    async (s) => !!(await prisma.artwork.findUnique({ where: { slug: s } }))
  );

  await prisma.artwork.create({
    data: {
      ...baseData(d),
      slug,
      images: {
        create: d.galleryImages.map((url, i) => ({ url, sortOrder: i })),
      },
    },
  });
  revalidate();
  return ok();
}

export async function updateArtwork(
  id: string,
  input: ArtworkInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = artworkSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;

  const dup = await prisma.artwork.findFirst({
    where: { code: d.code, NOT: { id } },
  });
  if (dup) return fail(`Artwork code "${d.code}" is already in use.`);

  await prisma.$transaction([
    prisma.artworkImage.deleteMany({ where: { artworkId: id } }),
    prisma.artwork.update({
      where: { id },
      data: {
        ...baseData(d),
        images: {
          create: d.galleryImages.map((url, i) => ({ url, sortOrder: i })),
        },
      },
    }),
  ]);
  revalidate();
  return ok();
}

export async function deleteArtwork(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.artwork.delete({ where: { id } });
  revalidate();
  return ok();
}
