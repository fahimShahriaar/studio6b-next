import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { ArtistForm } from "../artist-form";

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artist = await prisma.artist.findUnique({ where: { id } });
  if (!artist) notFound();

  return (
    <div>
      <PageHeader title="Edit Artist" />
      <ArtistForm
        initial={{
          id: artist.id,
          name: artist.name,
          bio: artist.bio,
          imageUrl: artist.imageUrl,
        }}
      />
    </div>
  );
}
