import { PageHeader } from "@/components/admin/page-header";
import { SlideForm } from "../slide-form";

export default function NewSlidePage() {
  return (
    <div>
      <PageHeader title="New Slide" />
      <SlideForm />
    </div>
  );
}
