import { PageHeader } from "@/components/admin/page-header";
import { getPickerArtworks } from "@/lib/options";
import { CollectionForm } from "../collection-form";

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  const artworks = await getPickerArtworks();

  return (
    <div>
      <PageHeader title="New Collection" />
      <CollectionForm artworks={artworks} />
    </div>
  );
}
