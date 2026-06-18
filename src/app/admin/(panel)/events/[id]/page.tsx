import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { EventForm } from "../event-form";

function toInputDate(d: Date | null) {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <PageHeader title="Edit Event" />
      <EventForm
        initial={{
          id: event.id,
          title: event.title,
          body: event.body ?? "",
          imageUrl: event.imageUrl ?? "",
          location: event.location ?? "",
          startDate: toInputDate(event.startDate),
          endDate: toInputDate(event.endDate),
          published: event.published,
        }}
      />
    </div>
  );
}
