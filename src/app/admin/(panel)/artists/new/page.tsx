import { PageHeader } from "@/components/admin/page-header";
import { ArtistForm } from "../artist-form";

export default function NewArtistPage() {
  return (
    <div>
      <PageHeader title="New Artist" />
      <ArtistForm />
    </div>
  );
}
