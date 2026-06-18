import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { HeroCarousel } from "@/components/public/hero-carousel";
import {
  ArtworkCard,
  ExhibitionCard,
  SectionHeading,
} from "@/components/public/cards";
import { toArtworkCard } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [slides, upcoming, previous, collections] = await Promise.all([
    prisma.carouselSlide.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.exhibition.findMany({
      where: { published: true, status: "UPCOMING" },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
    prisma.exhibition.findMany({
      where: { published: true, status: "PREVIOUS" },
      orderBy: { endDate: "desc" },
      take: 3,
    }),
    prisma.collection.findMany({
      where: { featured: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);

  const featuredArtworks = await prisma.artwork.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { artist: { select: { name: true } } },
  });

  return (
    <div>
      <HeroCarousel slides={slides} />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16">
        {featuredArtworks.length > 0 ? (
          <section>
            <SectionHeading title="Featured Works" href="/collections" />
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {featuredArtworks.map((a) => (
                <ArtworkCard key={a.slug} artwork={toArtworkCard(a)} />
              ))}
            </div>
          </section>
        ) : null}

        {upcoming.length > 0 ? (
          <section>
            <SectionHeading title="Upcoming Exhibitions" href="/exhibitions" />
            <div className="grid gap-8 md:grid-cols-3">
              {upcoming.map((e) => (
                <ExhibitionCard key={e.slug} exhibition={e} />
              ))}
            </div>
          </section>
        ) : null}

        {previous.length > 0 ? (
          <section>
            <SectionHeading title="Previous Exhibitions" href="/exhibitions" />
            <div className="grid gap-8 md:grid-cols-3">
              {previous.map((e) => (
                <ExhibitionCard key={e.slug} exhibition={e} />
              ))}
            </div>
          </section>
        ) : null}

        {collections.length > 0 ? (
          <section>
            <SectionHeading title="Explore Collections" href="/collections" />
            <div className="grid gap-6 md:grid-cols-3">
              {collections.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  className="group relative block aspect-video overflow-hidden rounded-lg bg-muted"
                >
                  {c.coverImageUrl ? (
                    <Image
                      src={c.coverImageUrl}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h3 className="text-center font-serif text-xl font-semibold text-white drop-shadow">
                      {c.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
