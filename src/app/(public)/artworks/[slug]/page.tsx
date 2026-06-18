import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { ArtworkGallery } from "@/components/public/artwork-gallery";
import { ArtworkCard, SectionHeading } from "@/components/public/cards";
import { toArtworkCard } from "@/lib/mappers";

export const dynamic = "force-dynamic";

async function getArtwork(slug: string) {
  return prisma.artwork.findUnique({
    where: { slug },
    include: {
      artist: true,
      artType: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtwork(slug);
  if (!artwork) return { title: "Artwork not found" };
  return {
    title: `${artwork.title} — ${artwork.artist.name}`,
    description: artwork.description ?? undefined,
  };
}

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [artwork, settings] = await Promise.all([getArtwork(slug), getSettings()]);
  if (!artwork) notFound();

  const moreFromArtist = await prisma.artwork.findMany({
    where: { artistId: artwork.artistId, NOT: { id: artwork.id } },
    include: { artist: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const galleryImages = [artwork.imageUrl, ...artwork.images.map((i) => i.url)];
  const price = artwork.priceVisible
    ? formatPrice(artwork.price ? artwork.price.toString() : null, artwork.currency)
    : null;

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    settings.whatsappTemplate,
    {
      code: artwork.code,
      title: artwork.title,
      medium: artwork.medium,
      artist: artwork.artist.name,
    }
  );

  const details = [
    { label: "Year", value: artwork.year },
    { label: "Medium", value: artwork.medium },
    { label: "Dimensions", value: artwork.dimensions },
    { label: "Type", value: artwork.artType?.name },
    { label: "Code", value: artwork.code },
  ].filter((d) => d.value);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <ArtworkGallery
          images={galleryImages}
          alt={artwork.alt ?? artwork.title}
        />

        <div>
          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
            {artwork.title}
          </h1>
          <Link
            href={`/artists/${artwork.artist.slug}`}
            className="mt-1 inline-block text-lg text-muted-foreground hover:text-foreground"
          >
            {artwork.artist.name}
          </Link>

          <div className="mt-4 flex items-center gap-3">
            {price ? <p className="text-2xl font-semibold">{price}</p> : null}
            {artwork.availability !== "AVAILABLE" ? (
              <Badge variant="secondary" className="capitalize">
                {artwork.availability.toLowerCase()}
              </Badge>
            ) : null}
          </div>

          {details.length > 0 ? (
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {details.map((d) => (
                <div key={d.label} className="contents">
                  <dt className="text-muted-foreground">{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {artwork.description ? (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">
              {artwork.description}
            </p>
          ) : null}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 w-full gap-2 bg-[#25D366] text-white hover:bg-[#1ebe5b] sm:w-auto"
            )}
          >
            <MessageCircle className="size-5" />
            Chat via WhatsApp
          </a>
        </div>
      </div>

      {moreFromArtist.length > 0 ? (
        <section className="mt-20">
          <SectionHeading
            title="Discover More from This Artist"
            href={`/artists/${artwork.artist.slug}`}
            linkLabel="View artist"
          />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {moreFromArtist.map((a) => (
              <ArtworkCard key={a.slug} artwork={toArtworkCard(a)} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
