"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, fail, type ActionResult } from "@/lib/admin";
import { collectionSchema, type CollectionInput } from "@/lib/validators";
import { ensureUniqueSlug } from "@/lib/slug";

function revalidate(slug?: string) {
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath("/");
  if (slug) revalidatePath(`/collections/${slug}`);
}

function baseData(d: CollectionInput) {
  return {
    title: d.title,
    description: d.description ?? null,
    coverImageUrl: d.coverImageUrl ?? null,
    featured: d.featured,
    sortOrder: d.sortOrder,
  };
}

export async function createCollection(
  input: CollectionInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;

  const slug = await ensureUniqueSlug(
    d.title,
    async (s) => !!(await prisma.collection.findUnique({ where: { slug: s } }))
  );

  await prisma.collection.create({
    data: {
      ...baseData(d),
      slug,
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

export async function updateCollection(
  id: string,
  input: CollectionInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const d = parsed.data;

  const existing = await prisma.collection.findUnique({ where: { id } });
  if (!existing) return fail("Collection not found");

  await prisma.$transaction([
    prisma.collectionArtwork.deleteMany({ where: { collectionId: id } }),
    prisma.collection.update({
      where: { id },
      data: {
        ...baseData(d),
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

export async function deleteCollection(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.collection.delete({ where: { id } });
  revalidate();
  return ok();
}
