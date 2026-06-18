import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { SlideForm } from "../slide-form";

export default async function EditSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slide = await prisma.carouselSlide.findUnique({ where: { id } });
  if (!slide) notFound();

  return (
    <div>
      <PageHeader title="Edit Slide" />
      <SlideForm
        initial={{
          id: slide.id,
          imageUrl: slide.imageUrl,
          headline: slide.headline ?? "",
          subtext: slide.subtext ?? "",
          ctaLabel: slide.ctaLabel ?? "",
          ctaHref: slide.ctaHref ?? "",
          sortOrder: slide.sortOrder,
          active: slide.active,
        }}
      />
    </div>
  );
}
