import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { ArtworkCard } from "@/components/public/cards";
import { toArtworkCard } from "@/lib/mappers";

export const dynamic = "force-dynamic";

async function getArtist(slug: string) {
  return prisma.artist.findUnique({
    where: { slug },
    include: {
      artworks: {
        orderBy: { createdAt: "desc" },
        include: { artist: { select: { name: true } } },
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
  const artist = await getArtist(slug);
  if (!artist) return { title: "Artist not found" };
  return { title: artist.name, description: artist.bio ?? undefined };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtist(slug);
  if (!artist) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        {artist.imageUrl ? (
          <div className="relative size-32 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div>
          <h1 className="font-serif text-4xl font-semibold">{artist.name}</h1>
          {artist.bio ? (
            <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">
              {artist.bio}
            </p>
          ) : null}
        </div>
      </header>

      <section className="mt-12">
        <h2 className="mb-6 font-serif text-2xl font-semibold">Works</h2>
        {artist.artworks.length === 0 ? (
          <p className="text-muted-foreground">No artworks yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {artist.artworks.map((a) => (
              <ArtworkCard key={a.slug} artwork={toArtworkCard(a)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
