import { PageHeader } from "@/components/admin/page-header";
import { getPickerArtworks } from "@/lib/options";
import { ExhibitionForm } from "../exhibition-form";

export const dynamic = "force-dynamic";

export default async function NewExhibitionPage() {
  const artworks = await getPickerArtworks();

  return (
    <div>
      <PageHeader title="New Exhibition" />
      <ExhibitionForm artworks={artworks} />
    </div>
  );
}
