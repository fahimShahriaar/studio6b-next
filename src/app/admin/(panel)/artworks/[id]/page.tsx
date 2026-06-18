import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { getArtistOptions, getArtTypeOptions } from "@/lib/options";
import { ArtworkForm } from "../artwork-form";

export const dynamic = "force-dynamic";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [artwork, artists, artTypes] = await Promise.all([
    prisma.artwork.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    getArtistOptions(),
    getArtTypeOptions(),
  ]);
  if (!artwork) notFound();

  return (
    <div>
      <PageHeader title="Edit Artwork" />
      <ArtworkForm
        artists={artists}
        artTypes={artTypes}
        initial={{
          id: artwork.id,
          code: artwork.code,
          title: artwork.title,
          artistId: artwork.artistId,
          artTypeId: artwork.artTypeId ?? undefined,
          imageUrl: artwork.imageUrl,
          previewUrl: artwork.previewUrl ?? undefined,
          alt: artwork.alt ?? undefined,
          year: artwork.year ?? undefined,
          medium: artwork.medium ?? undefined,
          dimensions: artwork.dimensions ?? undefined,
          description: artwork.description ?? undefined,
          price: artwork.price ? Number(artwork.price) : undefined,
          currency: artwork.currency,
          priceVisible: artwork.priceVisible,
          availability: artwork.availability,
          featured: artwork.featured,
          galleryImages: artwork.images.map((img) => img.url),
        }}
      />
    </div>
  );
}
