import type { ArtworkCardData } from "@/components/public/cards";

type ArtworkWithArtist = {
  slug: string;
  title: string;
  imageUrl: string;
  previewUrl: string | null;
  alt: string | null;
  price: { toString(): string } | null;
  currency: string;
  priceVisible: boolean;
  availability: "AVAILABLE" | "SOLD" | "RESERVED";
  artist: { name: string };
};

export function toArtworkCard(a: ArtworkWithArtist): ArtworkCardData {
  return {
    slug: a.slug,
    title: a.title,
    imageUrl: a.imageUrl,
    previewUrl: a.previewUrl,
    alt: a.alt,
    artistName: a.artist.name,
    price: a.price ? a.price.toString() : null,
    currency: a.currency,
    priceVisible: a.priceVisible,
    availability: a.availability,
  };
}
