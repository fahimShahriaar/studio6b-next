import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { getPickerArtworks } from "@/lib/options";
import { CollectionForm } from "../collection-form";

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [collection, artworks] = await Promise.all([
    prisma.collection.findUnique({
      where: { id },
      include: { artworks: { orderBy: { sortOrder: "asc" } } },
    }),
    getPickerArtworks(),
  ]);
  if (!collection) notFound();

  return (
    <div>
      <PageHeader title="Edit Collection" />
      <CollectionForm
        artworks={artworks}
        initial={{
          id: collection.id,
          title: collection.title,
          description: collection.description ?? undefined,
          coverImageUrl: collection.coverImageUrl ?? undefined,
          featured: collection.featured,
          sortOrder: collection.sortOrder,
          artworkIds: collection.artworks.map((a) => a.artworkId),
        }}
      />
    </div>
  );
}
