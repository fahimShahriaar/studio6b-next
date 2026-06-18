import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { ArtTypeForm } from "../art-type-form";

export default async function EditArtTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const type = await prisma.artType.findUnique({ where: { id } });
  if (!type) notFound();

  return (
    <div>
      <PageHeader title="Edit Art Type" />
      <ArtTypeForm initial={{ id: type.id, name: type.name }} />
    </div>
  );
}
