"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, fail, type ActionResult } from "@/lib/admin";
import { artistSchema, type ArtistInput } from "@/lib/validators";
import { ensureUniqueSlug } from "@/lib/slug";

function revalidate() {
  revalidatePath("/admin/artists");
  revalidatePath("/");
  revalidatePath("/collections");
}

export async function createArtist(input: ArtistInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = artistSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const { name, bio, imageUrl } = parsed.data;

  const slug = await ensureUniqueSlug(
    name,
    async (s) => !!(await prisma.artist.findUnique({ where: { slug: s } }))
  );
  await prisma.artist.create({
    data: { name, slug, bio, imageUrl },
  });
  revalidate();
  return ok();
}

export async function updateArtist(
  id: string,
  input: ArtistInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = artistSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const { name, bio, imageUrl } = parsed.data;

  await prisma.artist.update({
    where: { id },
    data: { name, bio: bio ?? null, imageUrl: imageUrl ?? null },
  });
  revalidate();
  return ok();
}

export async function deleteArtist(id: string): Promise<ActionResult> {
  await requireAdmin();
  const count = await prisma.artwork.count({ where: { artistId: id } });
  if (count > 0) {
    return fail(
      `Cannot delete: artist has ${count} artwork(s). Reassign or delete them first.`
    );
  }
  await prisma.artist.delete({ where: { id } });
  revalidate();
  return ok();
}
