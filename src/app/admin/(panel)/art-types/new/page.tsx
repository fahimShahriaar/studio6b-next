import { PageHeader } from "@/components/admin/page-header";
import { ArtTypeForm } from "../art-type-form";

export default function NewArtTypePage() {
  return (
    <div>
      <PageHeader title="New Art Type" />
      <ArtTypeForm />
    </div>
  );
}
