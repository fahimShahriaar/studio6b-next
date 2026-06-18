import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { ArtworkCard } from "@/components/public/cards";
import { toArtworkCard } from "@/lib/mappers";

export const dynamic = "force-dynamic";

async function getCollection(slug: string) {
  return prisma.collection.findUnique({
    where: { slug },
    include: {
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
  const collection = await getCollection(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.title,
    description: collection.description ?? undefined,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  return (
    <article>
      {collection.coverImageUrl ? (
        <section className="relative flex h-64 items-center justify-center overflow-hidden bg-neutral-900 sm:h-80">
          <Image
            src={collection.coverImageUrl}
            alt={collection.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <h1 className="relative z-10 px-4 text-center font-serif text-4xl font-semibold text-white drop-shadow sm:text-5xl">
            {collection.title}
          </h1>
        </section>
      ) : (
        <div className="mx-auto max-w-6xl px-4 pt-12">
          <h1 className="font-serif text-4xl font-semibold">
            {collection.title}
          </h1>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-12">
        {collection.description ? (
          <p className="mb-10 max-w-3xl text-lg text-muted-foreground">
            {collection.description}
          </p>
        ) : null}

        {collection.artworks.length === 0 ? (
          <p className="text-muted-foreground">No artworks in this collection.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {collection.artworks.map(({ artwork }) => (
              <ArtworkCard key={artwork.slug} artwork={toArtworkCard(artwork)} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
