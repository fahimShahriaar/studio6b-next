import { prisma } from "@/lib/prisma";
import type { Option } from "@/components/admin/form-fields";

export async function getArtistOptions(): Promise<Option[]> {
  const artists = await prisma.artist.findMany({ orderBy: { name: "asc" } });
  return artists.map((a) => ({ value: a.id, label: a.name }));
}

export async function getArtTypeOptions(): Promise<Option[]> {
  const types = await prisma.artType.findMany({ orderBy: { name: "asc" } });
  return types.map((t) => ({ value: t.id, label: t.name }));
}

export type PickerArtworkRow = {
  id: string;
  title: string;
  code: string;
  imageUrl: string;
  artistName: string;
};

export async function getPickerArtworks(): Promise<PickerArtworkRow[]> {
  const artworks = await prisma.artwork.findMany({
    orderBy: { createdAt: "desc" },
    include: { artist: { select: { name: true } } },
  });
  return artworks.map((a) => ({
    id: a.id,
    title: a.title,
    code: a.code,
    imageUrl: a.previewUrl ?? a.imageUrl,
    artistName: a.artist.name,
  }));
}
