"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, fail, type ActionResult } from "@/lib/admin";
import { artTypeSchema, type ArtTypeInput } from "@/lib/validators";
import { ensureUniqueSlug } from "@/lib/slug";

function revalidate() {
  revalidatePath("/admin/art-types");
  revalidatePath("/collections");
}

export async function createArtType(input: ArtTypeInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = artTypeSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const { name } = parsed.data;

  if (await prisma.artType.findUnique({ where: { name } })) {
    return fail("An art type with this name already exists.");
  }
  const slug = await ensureUniqueSlug(
    name,
    async (s) => !!(await prisma.artType.findUnique({ where: { slug: s } }))
  );
  await prisma.artType.create({ data: { name, slug } });
  revalidate();
  return ok();
}

export async function updateArtType(
  id: string,
  input: ArtTypeInput
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = artTypeSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid data");
  const { name } = parsed.data;

  const dup = await prisma.artType.findFirst({ where: { name, NOT: { id } } });
  if (dup) return fail("An art type with this name already exists.");

  await prisma.artType.update({ where: { id }, data: { name } });
  revalidate();
  return ok();
}

export async function deleteArtType(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.artType.delete({ where: { id } });
  revalidate();
  return ok();
}
