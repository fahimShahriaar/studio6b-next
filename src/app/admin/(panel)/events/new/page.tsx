import { PageHeader } from "@/components/admin/page-header";
import { EventForm } from "../event-form";

export default function NewEventPage() {
  return (
    <div>
      <PageHeader title="New Event" />
      <EventForm />
    </div>
  );
}
