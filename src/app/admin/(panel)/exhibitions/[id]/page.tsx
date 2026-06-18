import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { getPickerArtworks } from "@/lib/options";
import { ExhibitionForm } from "../exhibition-form";

export const dynamic = "force-dynamic";

function toInputDate(d: Date | null) {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default async function EditExhibitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [exhibition, artworks] = await Promise.all([
    prisma.exhibition.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        artworks: { orderBy: { sortOrder: "asc" } },
      },
    }),
    getPickerArtworks(),
  ]);
  if (!exhibition) notFound();

  return (
    <div>
      <PageHeader title="Edit Exhibition" />
      <ExhibitionForm
        artworks={artworks}
        initial={{
          id: exhibition.id,
          title: exhibition.title,
          status: exhibition.status,
          summary: exhibition.summary ?? undefined,
          description: exhibition.description ?? undefined,
          heroImageUrl: exhibition.heroImageUrl ?? undefined,
          location: exhibition.location ?? undefined,
          startDate: toInputDate(exhibition.startDate),
          endDate: toInputDate(exhibition.endDate),
          featured: exhibition.featured,
          published: exhibition.published,
          galleryImages: exhibition.images.map((img) => img.url),
          artworkIds: exhibition.artworks.map((a) => a.artworkId),
        }}
      />
    </div>
  );
}
