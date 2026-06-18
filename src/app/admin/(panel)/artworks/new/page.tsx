import { PageHeader } from "@/components/admin/page-header";
import { getArtistOptions, getArtTypeOptions } from "@/lib/options";
import { ArtworkForm } from "../artwork-form";

export const dynamic = "force-dynamic";

export default async function NewArtworkPage() {
  const [artists, artTypes] = await Promise.all([
    getArtistOptions(),
    getArtTypeOptions(),
  ]);

  return (
    <div>
      <PageHeader title="New Artwork" />
      {artists.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Create an artist first before adding artworks.
        </p>
      ) : (
        <ArtworkForm artists={artists} artTypes={artTypes} />
      )}
    </div>
  );
}
