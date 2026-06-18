import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, CalendarDays } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ArtworkCard, SectionHeading } from "@/components/public/cards";
import { toArtworkCard } from "@/lib/mappers";
import { formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabel = {
  ONGOING: "On Now",
  UPCOMING: "Upcoming",
  PREVIOUS: "Past",
} as const;

async function getExhibition(slug: string) {
  return prisma.exhibition.findFirst({
    where: { slug, published: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      artworks: {
        orderBy: { sortOrder: "asc" },
        include: { artwork: { include: { artist: { select: { name: true } } } } },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exhibition = await getExhibition(slug);
  if (!exhibition) return { title: "Exhibition not found" };
  return {
    title: exhibition.title,
    description: exhibition.summary ?? undefined,
  };
}

export default async function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exhibition = await getExhibition(slug);
  if (!exhibition) notFound();

  const dates = formatDateRange(exhibition.startDate, exhibition.endDate);

  return (
    <article>
      <section className="relative flex h-80 items-end overflow-hidden bg-neutral-900 sm:h-96">
        {exhibition.heroImageUrl ? (
          <Image
            src={exhibition.heroImageUrl}
            alt={exhibition.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
        ) : null}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-10 text-white">
          <Badge className="mb-3">{statusLabel[exhibition.status]}</Badge>
          <h1 className="font-serif text-4xl font-semibold drop-shadow sm:text-5xl">
            {exhibition.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/90">
            {dates ? (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" /> {dates}
              </span>
            ) : null}
            {exhibition.location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" /> {exhibition.location}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-12">
        {exhibition.description ? (
          <div className="max-w-3xl whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {exhibition.description}
          </div>
        ) : null}

        {exhibition.images.length > 0 ? (
          <section>
            <SectionHeading title="Gallery" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {exhibition.images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? exhibition.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {exhibition.artworks.length > 0 ? (
          <section>
            <SectionHeading title="Artworks in this exhibition" />
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {exhibition.artworks.map(({ artwork }) => (
                <ArtworkCard key={artwork.slug} artwork={toArtworkCard(artwork)} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
